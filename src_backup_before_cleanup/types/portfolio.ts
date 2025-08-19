// src/types/portfolio.ts
// This file contains TYPE DEFINITIONS only - no JSX/HTML!

export interface Holding {
  symbol: string;
  name?: string;
  shares: number;
  averageCost: number;
  currentPrice?: number;
  marketValue?: number;
  costBasis?: number;
  unrealizedGain?: number;
  unrealizedGainPercent?: number;
  weight?: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  lastUpdated: Date;
  custodian?: string;
}

export interface ParseResult {
  success: boolean;
  holdings: Holding[];
  metadata: {
    custodianDetected: string;
    confidence: number;
    rowsProcessed: number;
    rowsSkipped: number;
    errors: string[];
    warnings: string[];
  };
  dataXRay: {
    originalColumns: string[];
    mappedColumns: Record<string, string>;
    unmappedColumns: string[];
    sampleData: any[];
  };
}

export interface CustodianPreset {
  name: string;
  identifyingColumns: string[];
  skipRows: number;
  dateFormat: string;
  columnMappings: {
    symbol: string | string[];
    shares: string | string[];
    cost?: string | string[];
    value?: string | string[];
    price?: string | string[];
    name?: string | string[];
  };
  validator: (row: any) => boolean;
}

export interface CalculationResult<T = number> {
  value: T;
  confidence: 'High' | 'Medium' | 'Low';
  transparency: {
    formula: string;
    steps: string[];
    inputs: Record<string, any>;
    assumptions: string[];
    methodology: string;
  };
  context?: {
    benchmark: string;
    interpretation: string;
    percentile?: number;
  };
}

export interface MetricsXRay {
  sharpeRatio: CalculationResult;
  sortinoRatio: CalculationResult;
  maxDrawdown: CalculationResult<{
    value: number;
    peak: number;
    trough: number;
    peakDate: Date;
    troughDate: Date;
    recoveryDays?: number;
  }>;
  upCapture: CalculationResult;
  downCapture: CalculationResult;
  beta: CalculationResult;
  alpha?: CalculationResult;
}

export interface ReportConfig {
  portfolio: Portfolio;
  metrics: MetricsXRay;
  includeAppendix: boolean;
  branding: {
    firmName: string;
    logo?: string;
    primaryColor: string;
    disclaimer?: string;
  };
  sections: {
    executiveSummary: boolean;
    detailedMetrics: boolean;
    holdings: boolean;
    recommendations: boolean;
    mathAppendix: boolean;
  };
}

export interface DataXRay {
  originalColumns: string[];
  mappedColumns: Record<string, string>;
  unmappedColumns: string[];
  sampleData: Record<string, string>[];
}