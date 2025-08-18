// src/types/portfolio.ts - Enhanced Types for Multi-Custodian Support

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
  weight?: number; // Added weight property as optional
}

export interface DataXRay {
  originalColumns: string[];
  mappedColumns: Record<string, string>;
  unmappedColumns: string[];
  sampleData: any[];
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
  dataXRay: DataXRay;
}

export interface CustodianDetection {
  custodian: string;
  confidence: number;
  format: string;
  columnMappings: Record<string, string>; // Made required (removed ?)
}

export interface ParsedHolding {
  symbol: string;
  description?: string;
  shares: number;
  price: number;
  marketValue: number;
  costBasis?: number;
}