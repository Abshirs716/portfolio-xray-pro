import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveDataStatus {
  isLive: boolean;
  lastUpdated: string | null;
  source: string | null;
  errors: string[];
  successCount: number;
  failureCount: number;
}

interface DataSourceAttempt {
  source: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

export const useLiveDataMonitor = () => {
  const [status, setStatus] = useState<LiveDataStatus>({
    isLive: false,
    lastUpdated: null,
    source: null,
    errors: [],
    successCount: 0,
    failureCount: 0
  });

  const [auditLog, setAuditLog] = useState<DataSourceAttempt[]>([]);
  
  // ADD ATTEMPT LIMITING TO MONITOR
  const attemptCountRef = useRef(0);
  const maxAttemptsRef = useRef(5); // Only 5 attempts for monitor

  const testLiveDataSource = useCallback(async (symbol: string = 'AAPL') => {
    
    // STOP INFINITE MONITORING LOOPS
    if (attemptCountRef.current >= maxAttemptsRef.current) {
      console.error(`🛑 LIVE DATA MONITOR STOPPED after ${attemptCountRef.current} attempts`);
      console.error(`🚨 NO MORE MONITORING ATTEMPTS!`);
      return false;
    }
    
    attemptCountRef.current += 1;
    console.log(`🔍 Monitor: Testing live data for ${symbol}... (Attempt ${attemptCountRef.current}/${maxAttemptsRef.current})`);
    
    const attempts: DataSourceAttempt[] = [];
    
    try {
      console.log('📡 Monitor: Calling edge function with params:', { symbol, type: 'quote' });
      
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol, type: 'quote' }
      });

      console.log('📡 Monitor: Raw response received:', { data, error });
      console.log('📡 Monitor: Data success status:', data?.success);
      console.log('📡 Monitor: Data source:', data?.data?.source);
      
      const timestamp = new Date().toISOString();

      if (error) {
        attempts.push({
          source: 'Edge Function',
          success: false,
          error: error.message,
          timestamp
        });
        
        setStatus(prev => ({
          ...prev,
          isLive: false,
          errors: [...prev.errors, `Edge Function: ${error.message}`],
          failureCount: prev.failureCount + 1
        }));
        
        console.error('❌ Edge function failed:', error);
        return false;
      }

      if (!data.success) {
        attempts.push({
          source: 'Real Market Data Service',
          success: false,
          error: data.error,
          timestamp
        });
        
        setStatus(prev => ({
          ...prev,
          isLive: false,
          errors: [...prev.errors, `Real Market Data: ${data.error}`],
          failureCount: prev.failureCount + 1
        }));
        
        console.error('❌ Real market data failed:', data.error);
        return false;
      }

      // SUCCESS!
      attempts.push({
        source: data.data.source,
        success: true,
        timestamp
      });

      setStatus({
        isLive: true,
        lastUpdated: timestamp,
        source: data.data.source,
        errors: [],
        successCount: status.successCount + 1,
        failureCount: status.failureCount
      });

      console.log(`✅ Live data working! Source: ${data.data.source}, Price: $${data.data.price}`);
      return true;

    } catch (error) {
      const timestamp = new Date().toISOString();
      
      attempts.push({
        source: 'Network/Connection',
        success: false,
        error: error.message,
        timestamp
      });
      
      setStatus(prev => ({
        ...prev,
        isLive: false,
        errors: [...prev.errors, `Network: ${error.message}`],
        failureCount: prev.failureCount + 1
      }));
      
      console.error('❌ Network error testing live data:', error);
      return false;
    } finally {
      setAuditLog(prev => [...prev, ...attempts].slice(-50)); // Keep last 50 attempts
    }
  }, [status.successCount, status.failureCount]);

  // Monitor live data status every 30 seconds BUT WITH LIMITS
  useEffect(() => {
    // ONLY RUN IF WE HAVEN'T EXCEEDED ATTEMPTS
    if (attemptCountRef.current >= maxAttemptsRef.current) {
      console.error(`🛑 LIVE DATA MONITORING DISABLED - Too many attempts`);
      return;
    }
    
    // Initial test
    testLiveDataSource();
    
    // Set up monitoring interval BUT WITH LIMITS
    const interval = setInterval(() => {
      if (attemptCountRef.current < maxAttemptsRef.current) {
        testLiveDataSource();
      } else {
        console.error(`🛑 STOPPING LIVE DATA MONITORING - Attempt limit reached`);
        clearInterval(interval);
      }
    }, 30000); // Test every 30 seconds

    return () => clearInterval(interval);
  }, [testLiveDataSource]);

  // Verify no fake data is being used
  const verifyNoFakeData = useCallback((displayedData: any) => {
    const warnings: string[] = [];
    
    // Check for suspicious round numbers that indicate fake data
    if (displayedData.marketCap === 1000000000) {
      warnings.push('❌ FAKE: $1B market cap - obviously hardcoded');
    }
    
    if (displayedData.marketCap === 3000000000000) {
      warnings.push('❌ FAKE: Exactly $3T market cap - suspicious round number');
    }
    
    // Check for stale data
    if (displayedData.lastUpdated) {
      const staleTime = Date.now() - new Date(displayedData.lastUpdated).getTime();
      if (staleTime > 300000) { // 5 minutes
        warnings.push('❌ STALE: Data is more than 5 minutes old');
      }
    }
    
    // Check for missing source
    if (!displayedData.source || displayedData.source === 'hardcoded') {
      warnings.push('❌ NO SOURCE: Data has no live source attribution');
    }
    
    return {
      isValid: warnings.length === 0,
      warnings
    };
  }, []);

  return {
    status,
    auditLog,
    testLiveDataSource,
    verifyNoFakeData,
    clearErrors: () => setStatus(prev => ({ ...prev, errors: [] }))
  };
};