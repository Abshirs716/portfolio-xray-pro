export interface ParseResult {
  holdings: Array<{
    symbol: string;
    name?: string;
    shares: number;
    price: number;
    market_value: number;
    weight?: number;
    cost_basis?: number;
    sector?: string;
    currency?: string;
  }>;
  totals: { 
    total_value: number; 
    positions_count: number; 
  };
  metadata: {
    custodianDetected: string;
    confidence: number;
    files?: Array<{
      filename: string;
      type: string;
      confidence: number;
      require_mapping: boolean;
      headers?: string[];
      sample_rows?: string[][];
      index_map?: Record<string, number>;
      errors?: string[];
    }>;
  };
}

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

export function adaptParseResultToLegacy(result: ParseResult) {
  const holdings: Holding[] = result.holdings.map(h => {
    // Use actual cost_basis from backend if available, otherwise estimate
    const costBasis = h.cost_basis || 0;
    const marketValue = h.market_value || 0;
    const shares = h.shares || 0;
    const price = h.price || 0;
    
    // Calculate unrealized gain properly
    const unrealizedGain = marketValue - costBasis;
    const unrealizedGainPercent = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;
    
    // Calculate cost per share
    const costPerShare = shares > 0 && costBasis > 0 ? costBasis / shares : price;
    
    return {
      symbol: h.symbol,
      name: h.name || h.symbol,
      shares: shares,
      currentPrice: price,
      marketValue: marketValue,
      costBasis: costBasis,
      unrealizedGain: unrealizedGain,
      unrealizedGainPercent: unrealizedGainPercent,
      weight: h.weight || 0,
      sector: h.sector
    };
  });

  // Calculate totals properly
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);

  return {
    holdings,
    totalValue: totalMarketValue,
    totalCostBasis: totalCostBasis,
    positionsCount: result.totals.positions_count,
    custodianDisplay: result.metadata.custodianDetected
  };
}