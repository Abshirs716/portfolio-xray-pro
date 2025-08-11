import { useState, useEffect, useRef } from 'react';
import { marketDataService } from '@/services/marketDataService';

export function useMarketData(symbol: string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttemptsRef = useRef(3);
  const isLoadingRef = useRef(false);

  // ADD THIS DEBUG LINE
  console.log(`📊 useMarketData for ${symbol} - Attempt ${attempts + 1} of ${maxAttemptsRef.current}`);

  useEffect(() => {
    // THIS MUST STOP THE LOOP
    if (attempts >= maxAttemptsRef.current) {
      console.error(`❌ STOPPED after ${attempts} attempts for ${symbol}`);
      console.error(`🛑 NO MORE ATTEMPTS FOR ${symbol}!`);
      setError(`Failed after ${attempts} attempts`);
      return; // THIS STOPS THE LOOP!
    }

    if (isLoadingRef.current) {
      console.log(`⏳ Already loading ${symbol}, skipping...`);
      return;
    }

    const fetchData = async () => {
      console.log(`🔄 Starting attempt ${attempts + 1} for ${symbol}`);
      isLoadingRef.current = true;
      setAttempts(prev => {
        const newAttempts = prev + 1;
        console.log(`📈 Incrementing attempts for ${symbol}: ${prev} → ${newAttempts}`);
        return newAttempts;
      });

      try {
        // YOUR FETCH LOGIC HERE
        const result = await marketDataService.getMarketData(symbol);
        
        if (!result || result === undefined || result.price === undefined) {
          throw new Error('Received undefined data');
        }
        
        setData(result);
        setError(null);
        console.log(`✅ Success for ${symbol} on attempt ${attempts + 1}`);
      } catch (err) {
        console.error(`❌ Attempt ${attempts + 1} failed for ${symbol}:`, err);
        setError(err.message);
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchData();
    
    return () => {
      isLoadingRef.current = false;
    };
  }, [symbol]); // ONLY SYMBOL!

  return { data, error, attempts };
}