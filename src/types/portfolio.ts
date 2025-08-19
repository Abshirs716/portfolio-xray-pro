// src/types/portfolio.ts - Complete Types from August 18th
export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
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

export interface CustodianDetection {
  custodian: string;
  confidence: number;
  format: string;
  columnMappings?: Record<string, string>;
}

export interface ParsedHolding {
  symbol: string;
  description?: string;
  shares: number;
  price: number;
  marketValue: number;
  costBasis?: number;
  unrealizedGain?: number;
  unrealizedGainPercent?: number;
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

export interface DataXRay {
  originalColumns: string[];
  mappedColumns: Record<string, string>;
  unmappedColumns: string[];
  sampleData: Record<string, string>[];
}

export interface CustomMappingProps {
  csvHeaders: string[];
  sampleData: string[][];
  onMappingComplete: (mapping: ColumnMapping) => void;
  onCancel: () => void;
}

export interface ColumnMapping {
  symbol: number;
  name?: number;
  shares: number;
  currentPrice?: number;
  marketValue?: number;
  averageCost?: number;
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