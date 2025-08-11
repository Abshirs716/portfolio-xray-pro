export interface Holding {
  id: string;
  portfolioId: string;
  userId: string;
  symbol: string;
  shares: number;
  avgCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HoldingValue {
  holding: Holding;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  marketData?: MarketData;
}

export interface MarketData {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}