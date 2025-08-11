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

export class CentralizedMarketDataService {
  private static instance: CentralizedMarketDataService;
  private cache: Map<string, { data: MarketData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute

  static getInstance(): CentralizedMarketDataService {
    if (!this.instance) {
      this.instance = new CentralizedMarketDataService();
    }
    return this.instance;
  }

  async getMarketData(symbol: string): Promise<MarketData | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`📊 Using cached data for ${symbol}`);
        return cached.data;
      }

      console.log(`📊 Fetching live data for ${symbol}...`);

      // Call edge function
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol }
      });

      if (error) {
        console.error(`❌ Edge function error for ${symbol}:`, error);
        
        // If error has debugInfo, it's our custom error
        if (error.debugInfo) {
          console.error('Debug info:', error.debugInfo);
          console.error('Available keys:', error.debugInfo.availableKeys);
          console.error('Attempts:', error.debugInfo.attempts);
        }
        
        return null;
      }

      if (!data || !data.price) {
        console.error(`❌ Invalid data for ${symbol}:`, data);
        return null;
      }

      // Validate data
      if (!this.isValidMarketData(symbol, data)) {
        console.error(`❌ Data validation failed for ${symbol}:`, data);
        return null;
      }

      // Cache the data
      this.cache.set(symbol, {
        data,
        timestamp: Date.now()
      });

      console.log(`✅ Got live data for ${symbol}: $${data.price} from ${data.source}`);
      return data;

    } catch (error) {
      console.error(`❌ Failed to get market data for ${symbol}:`, error);
      return null;
    }
  }

  private isValidMarketData(symbol: string, data: any): boolean {
    // Basic validation
    if (!data.price || data.price <= 0) return false;

    // Symbol-specific validation
    const validationRules: Record<string, { minPrice: number; maxPrice: number }> = {
      'NVDA': { minPrice: 800, maxPrice: 2000 },
      'MSFT': { minPrice: 300, maxPrice: 600 },
      'AAPL': { minPrice: 150, maxPrice: 300 },
      'GOOGL': { minPrice: 100, maxPrice: 250 },
      'AMZN': { minPrice: 100, maxPrice: 300 },
      'TSLA': { minPrice: 100, maxPrice: 500 },
      'BRK.B': { minPrice: 300, maxPrice: 600 },
      'JPM': { minPrice: 100, maxPrice: 300 },
      'JNJ': { minPrice: 100, maxPrice: 250 },
      'XOM': { minPrice: 50, maxPrice: 200 },
      'CVX': { minPrice: 100, maxPrice: 300 },
      'PFE': { minPrice: 20, maxPrice: 100 },
      'SPY': { minPrice: 300, maxPrice: 700 },
      'QQQ': { minPrice: 300, maxPrice: 600 }
    };

    const rule = validationRules[symbol];
    if (rule) {
      if (data.price < rule.minPrice || data.price > rule.maxPrice) {
        console.error(`❌ ${symbol} price $${data.price} outside valid range $${rule.minPrice}-$${rule.maxPrice}`);
        return false;
      }
    }

    return true;
  }

  async getMultipleMarketData(symbols: string[]): Promise<Map<string, MarketData>> {
    const results = new Map<string, MarketData>();
    
    // Fetch in parallel but limit concurrency
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const promises = batch.map(symbol => this.getMarketData(symbol));
      const batchResults = await Promise.all(promises);
      
      batch.forEach((symbol, index) => {
        const data = batchResults[index];
        if (data) {
          results.set(symbol, data);
        }
      });
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export const marketDataService = CentralizedMarketDataService.getInstance();