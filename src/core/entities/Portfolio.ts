export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description?: string;
  totalValue: number;
  currency: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioValue {
  portfolioId: string;
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChange: number;
  weeklyChangePercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  yearToDateChange: number;
  yearToDateChangePercent: number;
  holdings: EnrichedHolding[];
  lastUpdated: Date;
}

export interface EnrichedHolding {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weight: number;
  sector?: string;
  companyName?: string;
}

export interface PortfolioMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  winRate: number;
  averageGain: number;
  averageLoss: number;
  consistency: number;
}