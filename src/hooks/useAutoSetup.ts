import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/hooks/usePortfolio';
import PortfolioService from '@/services/portfolioService';
import { useToast } from '@/hooks/use-toast';

/**
 * Auto-setup hook for new users
 * Creates default portfolio and sample data if none exists
 */
export const useAutoSetup = () => {
  const { user } = useAuth();
  const { portfolio, isLoading } = usePortfolio();
  const { toast } = useToast();

  useEffect(() => {
    const setupNewUser = async () => {
      if (!user || isLoading) return;
      
      // If user has no portfolio, create one
      if (!portfolio) {
        try {
          await PortfolioService.createDefaultPortfolio(user.id);
          toast({
            title: "Welcome to "Welcome to CapX100!"
            !",
            description: "Your portfolio has been created. Start by adding some transactions.",
          });
        } catch (error) {
          console.error('Error setting up new user:', error);
          toast({
            title: "Setup Error",
            description: "There was an issue setting up your account. Please try refreshing.",
            variant: "destructive",
          });
        }
      }
    };

    setupNewUser();
  }, [user, portfolio, isLoading, toast]);
};

export default useAutoSetup;