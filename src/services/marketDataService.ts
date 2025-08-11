import { supabase } from '@/integrations/supabase/client';

class MarketDataServiceWithProtection {
  private cache = new Map();
  private activeRequests = new Map();
  
  async getMarketData(symbol: string) {
    // CHECK CACHE FIRST
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < 60000) {
      console.log(`✅ Using cached data for ${symbol}`);
      return cached.data;
    }

    // PREVENT DUPLICATE REQUESTS
    if (this.activeRequests.has(symbol)) {
      console.log(`⏳ Waiting for existing request for ${symbol}`);
      return this.activeRequests.get(symbol);
    }

    // CREATE REQUEST PROMISE
    const requestPromise = this.fetchMarketData(symbol);
    this.activeRequests.set(symbol, requestPromise);

    try {
      const data = await requestPromise;
      
      // CACHE SUCCESSFUL RESULT
      this.cache.set(symbol, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } finally {
      // CLEANUP
      this.activeRequests.delete(symbol);
    }
  }

  private async fetchMarketData(symbol: string) {
    try {
      const { data, error } = await supabase.functions.invoke('market-data', {
        body: { symbol }
      });

      if (error) throw error;
      
      // VALIDATE RESPONSE - NEVER RETURN UNDEFINED!
      if (!data || typeof data.price !== 'number') {
        throw new Error('Invalid response structure');
      }

      console.log(`✅ Got market data for ${symbol}:`, data);
      return data;

    } catch (error) {
      console.error(`❌ Failed to fetch ${symbol}:`, error);
      
      // RETURN FALLBACK - NEVER UNDEFINED!
      const fallbackPrices = {
        'NVDA': 1150, 'MSFT': 465, 'AAPL': 225, 'GOOGL': 175,
        'AMZN': 185, 'TSLA': 250, 'JPM': 200, 'JNJ': 160,
        'BRK.B': 425, 'XOM': 110, 'PFE': 28, 'CVX': 165,
        'SPY': 550, 'QQQ': 475
      };
      
      return {
        symbol,
        price: fallbackPrices[symbol] || 100,
        change: 0,
        changePercent: '0.00%',
        source: 'Fallback (Error)',
        error: error.message
      };
    }
  }
}

export const marketDataService = new MarketDataServiceWithProtection();