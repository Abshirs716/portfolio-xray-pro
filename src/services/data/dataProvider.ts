// src/services/data/dataProvider.ts

export interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalData {
  symbol: string;
  prices: PriceData[];
  lastUpdated: string;
}

export interface ApiResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

class DataProvider {
  private apiKey: string;
  private baseUrl = 'https://www.alphavantage.co/query';
  private cache = new Map<string, HistoricalData>();

  constructor() {
    this.apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    if (!this.apiKey) {
      throw new Error('Alpha Vantage API key not found. Please add VITE_ALPHA_VANTAGE_API_KEY to your .env.local file');
    }
  }

  async getHistoricalData(symbol: string, outputSize: 'compact' | 'full' = 'compact'): Promise<HistoricalData> {
    console.log(`📊 Fetching historical data for ${symbol}...`);
    
    // Check cache first
    const cacheKey = `${symbol}_${outputSize}`;
    if (this.cache.has(cacheKey)) {
      console.log(`✅ Found ${symbol} in cache`);
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputSize}&apikey=${this.apiKey}`;
      
      console.log(`🌐 Making API request for ${symbol}...`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      // Check for API errors
      if (!data['Time Series (Daily)']) {
        console.error('API Response:', data);
        throw new Error(`No time series data found for ${symbol}. Check if symbol is valid.`);
      }

      // Transform API response to our format
      const prices: PriceData[] = Object.entries(data['Time Series (Daily)'])
        .map(([date, values]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

      const historicalData: HistoricalData = {
        symbol: symbol.toUpperCase(),
        prices,
        lastUpdated: data['Meta Data']['3. Last Refreshed']
      };

      // Cache the result
      this.cache.set(cacheKey, historicalData);
      
      console.log(`✅ Successfully fetched ${prices.length} days of data for ${symbol}`);
      return historicalData;

    } catch (error) {
      console.error(`❌ Error fetching data for ${symbol}:`, error);
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  calculateReturns(symbol: string, periods: number = 252): number[] {
    const data = this.cache.get(`${symbol}_compact`);
    if (!data || data.prices.length < periods + 1) {
      return [];
    }

    const prices = data.prices.slice(-periods - 1); // Get last N+1 prices
    const returns: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const return_ = (prices[i].close - prices[i - 1].close) / prices[i - 1].close;
      returns.push(return_);
    }

    return returns;
  }

  getCurrentPrice(symbol: string): number | null {
    const data = this.cache.get(`${symbol}_compact`);
    if (!data || data.prices.length === 0) {
      return null;
    }
    
    // Return the most recent closing price
    return data.prices[data.prices.length - 1].close;
  }

  // Method to get portfolio-level returns based on holdings
  async getPortfolioReturns(holdings: Array<{symbol: string, shares: number}>, periods: number = 252): Promise<number[]> {
    console.log('📊 Calculating portfolio-level returns...');
    
    // Fetch data for all holdings
    const promises = holdings.map(holding => this.getHistoricalData(holding.symbol));
    const allData = await Promise.all(promises);
    
    // Find the common date range across all holdings
    const allDates = allData[0].prices.map(p => p.date);
    const portfolioReturns: number[] = [];
    
    for (let i = 1; i < Math.min(allDates.length, periods + 1); i++) {
      const date = allDates[i];
      const prevDate = allDates[i - 1];
      
      let portfolioValueToday = 0;
      let portfolioValueYesterday = 0;
      
      for (let j = 0; j < holdings.length; j++) {
        const holding = holdings[j];
        const data = allData[j];
        
        const todayPrice = data.prices.find(p => p.date === date)?.close || 0;
        const yesterdayPrice = data.prices.find(p => p.date === prevDate)?.close || 0;
        
        portfolioValueToday += todayPrice * holding.shares;
        portfolioValueYesterday += yesterdayPrice * holding.shares;
      }
      
      if (portfolioValueYesterday > 0) {
        const portfolioReturn = (portfolioValueToday - portfolioValueYesterday) / portfolioValueYesterday;
        portfolioReturns.push(portfolioReturn);
      }
    }
    
    console.log(`✅ Calculated ${portfolioReturns.length} portfolio return periods`);
    return portfolioReturns;
  }
}

// Export singleton instance
export const dataProvider = new DataProvider();