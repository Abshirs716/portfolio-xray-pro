import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PortfolioService from '@/services/portfolioService';
import { useToast } from '@/hooks/use-toast';

/**
 * usePortfolio Hook - REAL DATABASE DATA ONLY
 */

export const usePortfolio = () => {
  const { user } = useAuth();
  
  // Add error boundary for QueryClient
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (error) {
    console.error('QueryClient not available:', error);
    return {
      portfolio: null,
      transactions: [],
      performanceData: [],
      metrics: null,
      isLoading: true,
      error: new Error('QueryClient not initialized'),
      refetch: () => Promise.resolve()
    };
  }
  
  const { toast } = useToast();

  const {
    data: portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio
  } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: PortfolioService.getPrimaryPortfolio,
    enabled: !!user,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError
  } = useQuery({
    queryKey: ['transactions', user?.id, portfolio?.id],
    queryFn: () => PortfolioService.getPortfolioTransactions(portfolio?.id),
    enabled: !!user && !!portfolio?.id,
    staleTime: 30000,
  });

  const {
    data: performanceData,
    isLoading: performanceLoading
  } = useQuery({
    queryKey: ['portfolio-performance', user?.id, portfolio?.id],
    queryFn: () => PortfolioService.getPortfolioPerformanceData(portfolio?.id),
    enabled: !!user && !!portfolio?.id,
    staleTime: 60000,
  });

  // Calculate metrics using centralized service
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    const loadCentralizedMetrics = async () => {
      if (!portfolio?.id || !transactions) return;
      
      try {
        console.log('🔄 Loading REAL metrics from database for:', portfolio.id);
        const { centralizedPortfolioMetrics } = await import('@/services/centralizedPortfolioMetrics');
        const realMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics(portfolio.id);
        console.log('✅ REAL metrics loaded:', realMetrics);
        setMetrics(realMetrics);
      } catch (error) {
        console.error('❌ Failed to load real metrics:', error);
        // NO FAKE FALLBACKS - leave as null
      }
    };
    
    loadCentralizedMetrics();
  }, [portfolio?.id, transactions]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Portfolio change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['portfolio', user.id] });
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Portfolio Updated",
              description: "Your portfolio data has been refreshed.",
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['transactions', user.id] });
          queryClient.invalidateQueries({ queryKey: ['portfolio-performance', user.id] });
          queryClient.invalidateQueries({ queryKey: ['portfolio', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  return {
    portfolio,
    transactions: transactions || [],
    performanceData: performanceData || [],
    metrics,
    isLoading: portfolioLoading || transactionsLoading || performanceLoading,
    error: portfolioError || transactionsError,
    refetch: refetchPortfolio
  };
};
