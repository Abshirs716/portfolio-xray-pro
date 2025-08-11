import { supabase } from '@/integrations/supabase/client';

interface MarketData {
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: string;
  volume: number;
  source: string;
  timestamp: string;
}

class WorkingMarketDataService {
  private cache = new Map<string, { data: MarketData; expires: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute

  async getMarketData(symbol: string): Promise<MarketData | null> {
    // Check cache
    const cached = this.cache.get(symbol);
    if (cached && cached.expires > Date.now()) {
      console.log(`📊 Using cached data for ${symbol}`);
      return cached.data;
    }

    try {
      console.log(`📊 Fetching live data for ${symbol}...`);

      // Call edge function with proper error handling
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error(`❌ Supabase function error for ${symbol}:`, error);
        
        // Try direct fetch as fallback
        const directUrl = `https://hutmrnnfwxzflftwvmha.supabase.co`;
        const directResponse = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0b3N6aWJ2cHpuaXFzdGpqc2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNDA5NTksImV4cCI6MjA2ODcxNjk1OX0.57tOILeYME3iLAZpvQWHEu1wm9uxFbw8RWO95MgPY8A`,
          },
          body: JSON.stringify({ symbol })
        });

        if (!directResponse.ok) {
          console.error(`❌ Direct fetch also failed: ${directResponse.status}`);
          return this.getFallbackData(symbol);
        }

        const directData = await directResponse.json();
        if (directData.price) {
          return this.processAndCacheData(symbol, directData);
        }
      }

      if (data && data.price) {
        return this.processAndCacheData(symbol, data);
      }

      console.warn(`⚠️ No valid data received for ${symbol}, using fallback`);
      return this.getFallbackData(symbol);

    } catch (error) {
      console.error(`❌ Failed to get data for ${symbol}:`, error);
      return this.getFallbackData(symbol);
    }
  }

  private processAndCacheData(symbol: string, data: any): MarketData {
    const marketData: MarketData = {
      symbol,
      price: data.price,
      previousClose: data.previousClose || data.price,
      change: data.change || 0,
      changePercent: data.changePercent || '0.00%',
      volume: data.volume || 0,
      source: data.source || 'Market Data',
      timestamp: data.timestamp || new Date().toISOString()
    };

    // Cache the data
    this.cache.set(symbol, {
      data: marketData,
      expires: Date.now() + this.CACHE_DURATION
    });

    console.log(`✅ Got data for ${symbol}: $${marketData.price} from ${marketData.source}`);
    return marketData;
  }

  private getFallbackData(symbol: string): MarketData {
    // Realistic estimates for July 2025
    const fallbackPrices: Record<string, number> = {
      'NVDA': 1150,
      'MSFT': 465,
      'AAPL': 225,
      'GOOGL': 175,
      'AMZN': 185,
      'TSLA': 250,
      'JPM': 200,
      'JNJ': 160,
      'BRK.B': 425,
      'XOM': 110,
      'PFE': 28,
      'CVX': 165,
      'SPY': 550,
      'QQQ': 475
    };

    const price = fallbackPrices[symbol] || 100;
    
    return {
      symbol,
      price,
      previousClose: price,
      change: 0,
      changePercent: '0.00%',
      volume: 0,
      source: 'Fallback (Live data unavailable)',
      timestamp: new Date().toISOString()
    };
  }

  async testConnection(): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol: 'AAPL' }
      });

      return {
        success: !error,
        data,
        error,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const workingMarketDataService = new WorkingMarketDataService();