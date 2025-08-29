export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  weight: number;
  sector?: string;
}

export interface RiskMetrics {
  sharpeRatio: number;
  volatility: number;
  beta: number;
  maxDrawdown: number;
  valueAtRisk: number;
  sortinoRatio: number;
}

export interface ConcentrationRisk {
  topHolding: number;
  top5Holdings: number;
  top10Holdings: number;
  herfindahlIndex: number;
}

export interface ParsedPortfolio {
  custodian: string;
  holdings: Holding[];
  totalValue: number;
  asOf: Date;
  metadata?: {
    rowsParsed: number;
    confidence: number;
  };
}

export interface CustodianFormat {
  name: string;
  identifiers: string[];
  requiredColumns: string[];
}