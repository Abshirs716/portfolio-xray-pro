// Real Market Data Service - No more fake data!
const ALPHA_VANTAGE_API_KEY = '94ca356ab3dcb02e0e262d7d3e3e66989701a98856499cabff771091021ed161'; // We'll move this to env later

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: string;
}

export class RealMarketDataService {
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      console.log(`🚀 Fetching REAL data for ${symbol}...`);
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(`Invalid symbol: ${symbol}`);
      }
      
      if (data['Note']) {
        throw new Error('API rate limit reached. Please try again in a minute.');
      }
      
      const quote = data['Global Quote'];
      
      if (!quote || !quote['05. price']) {
        throw new Error('No data available for this symbol');
      }
      
      // Transform Alpha Vantage data to our format
      const stockQuote: StockQuote = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        lastUpdated: new Date().toISOString()
      };
      
      console.log('✅ Real market data received:', stockQuote);
      return stockQuote;
      
    } catch (error) {
      console.error('❌ Error fetching market data:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const realMarketDataService = new RealMarketDataService();