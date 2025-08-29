/* src/adapters/legacyAdapters.ts
 * FIXED VERSION - Preserves actual cost basis from backend
 */

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
    custodianDetected?: string;
    confidence?: number;
    files?: Array<{
      filename: string;
      type: string;
      confidence: number;
      require_mapping: boolean;
      headers?: string[];
      sample_rows?: string[][];
      custodian?: string;
    }>;
  };
}

export interface LegacyHolding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  marketValue: number;
  weight: number;
  sector: string;
  currency: string;
  costBasis: number;
  totalCost: number;
  cost_basis?: number; // Keep original for components that check it
  unrealizedPL: number;
  unrealizedPLPercent: number;
  totalReturn?: number;
  unrealizedGain?: number;
  unrealizedGainPercent?: number;
}

export interface LegacyAdapted {
  holdings: LegacyHolding[];
  totalValue: number;
  positionsCount: number;
  custodianDisplay: string;
}

const nz = (v: any, def = 0) => (Number.isFinite(v) ? v : def);
const pos = (v: number) => (v > 0 ? v : 0);

export function adaptParseResultToLegacy(parsed: ParseResult): LegacyAdapted {
  const raw = parsed?.holdings ?? [];

  const normalized = raw.map((h) => {
    const shares = pos(nz(h.shares, 0));
    const price = pos(nz(h.price, 0));
    const mv = pos(nz(h.market_value, shares * price));

    // Backend sends TOTAL cost in cost_basis field
    let totalCost = h.cost_basis || 0;
    let costPerShare: number;
    
    if (totalCost > 0 && shares > 0) {
      // We have real cost basis from backend - use it as-is
      costPerShare = totalCost / shares;
    } else {
      // No cost basis - use current price as estimate
      costPerShare = price;
      totalCost = costPerShare * shares;
    }

    const unrealizedPL = mv - totalCost;
    const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;

    const symbol = (h.symbol || "").toUpperCase();
    const name = h.name || symbol || "N/A";

    return {
      symbol,
      name,
      shares,
      price,
      marketValue: mv,
      sector: h.sector || "Other",
      currency: h.currency || "USD",
      costBasis: costPerShare,
      totalCost,
      cost_basis: h.cost_basis, // Pass through original
      unrealizedPL,
      unrealizedPLPercent,
      totalReturn: unrealizedPLPercent,
      unrealizedGain: unrealizedPL,
      unrealizedGainPercent: unrealizedPLPercent,
    } as LegacyHolding;
  });

  // Calculate totals and weights
  const totalValue = normalized.reduce((s, r) => s + pos(r.marketValue), 0);
  const positionsCount = normalized.length;
  const weightsDen = totalValue > 0 ? totalValue : 1;
  
  const withWeights = normalized.map((r) => ({
    ...r,
    weight: pos(r.marketValue) / weightsDen,
  }));

  // Custodian display
  const custodian =
    parsed?.metadata?.custodianDetected ||
    pickFirstKnownCustodian(parsed?.metadata?.files) ||
    "Unknown";

  return {
    holdings: withWeights,
    totalValue,
    positionsCount,
    custodianDisplay: custodian,
  };
}

function pickFirstKnownCustodian(
  files: ParseResult["metadata"]["files"] | undefined
): string | undefined {
  if (!files || !files.length) return undefined;
  const known = files.find((f) => (f.custodian || "").toLowerCase() !== "unknown");
  return known?.custodian || files[0]?.custodian;
}