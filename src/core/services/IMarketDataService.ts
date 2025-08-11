import { MarketData } from '../entities/Holding';

export interface PriceData {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  timestamp: Date;
}

export interface HistoricalPrice {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IMarketDataService {
  getCurrentPrice(symbol: string): Promise<number>;
  getBatchPrices(symbols: string[]): Promise<Record<string, number>>;
  getMarketData(symbol: string): Promise<MarketData>;
  getHistoricalPrices(symbol: string, days: number): Promise<HistoricalPrice[]>;
  subscribeToPrice(symbol: string, callback: (price: number) => void): () => void;
  getCompanyInfo(symbol: string): Promise<CompanyInfo | null>;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio?: number;
  dividendYield?: number;
  description?: string;
}

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: Date;
  nextClose?: Date;
  timezone: string;
}