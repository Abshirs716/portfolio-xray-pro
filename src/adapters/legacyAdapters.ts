/* src/adapters/legacyAdapters.ts
 *
 * PURPOSE
 * - Convert the backend ParseResult (universal parser) into the "legacy"
 *   holdings shape consumed by PortfolioDashboard, RiskAnalysis, SectorAnalysis.
 * - Fix cost-basis inference so returns are realistic (no 3000%+ artifacts).
 *
 * SAFE RULES
 * - If cost basis is missing or ambiguous, default to *current price per share*.
 * - Never produce negative or NaN totals.
 * - Weights always sum to ~1 over positive market values.
 */

export interface ParseResult {
  holdings: Array<{
    symbol: string;
    name?: string;
    shares: number;
    price: number;
    market_value: number;
    weight?: number;
    cost_basis?: number;   // may be per-share OR total depending on the source
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

/** The shape our legacy components expect per holding */
export interface LegacyHolding {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  marketValue: number;
  weight: number;
  sector: string;
  currency: string;

  // cost/PL fields our dashboards consume
  costBasis: number;     // per-share cost
  totalCost: number;     // costBasis * shares
  unrealizedPL: number;  // marketValue - totalCost
  unrealizedPLPercent: number; // PL% based on totalCost
  totalReturn?: number;  // alias for PL%
}

/** Top-level adapter output for App.tsx */
export interface LegacyAdapted {
  holdings: LegacyHolding[];
  totalValue: number;
  positionsCount: number;
  custodianDisplay: string;
}

/* -------------------- helpers -------------------- */

const nz = (v: any, def = 0) => (Number.isFinite(v) ? v : def);
const pos = (v: number) => (v > 0 ? v : 0);
const isFiniteNum = (v: any) => typeof v === "number" && Number.isFinite(v);

/**
 * Decide whether incoming `rawCostBasis` is a PER-SHARE value or a TOTAL value.
 * We compare how each interpretation matches the current market value.
 *
 * - If `rawCostBasis` absent/invalid -> default to `price` (per-share).
 * - If shares ≤ 0 or mv ≤ 0 -> fall back to price.
 * - Otherwise compute the "distance" of each interpretation to mv and pick the
 *   one that's closer.
 */
function inferCostPerShare(rawCostBasis: any, price: number, shares: number, mv: number): number {
  const p = pos(nz(price, 0));
  const sh = pos(nz(shares, 0));
  const mvSafe = pos(nz(mv, p * sh));

  if (sh <= 0 || mvSafe <= 0 || p <= 0) return p;

  const c = nz(rawCostBasis, NaN);
  if (!isFiniteNum(c) || c <= 0) {
    // No usable cost data -> default to current price (safest assumption)
    return p;
  }

  // Candidate A: treat rawCostBasis as PER-SHARE
  const totalA = c * sh;

  // Candidate B: treat rawCostBasis as TOTAL
  const totalB = c;
  const perShareB = totalB / sh;

  // Distance to MV for each interpretation
  const distA = Math.abs(totalA - mvSafe);
  const distB = Math.abs(totalB - mvSafe);

  // Heuristics:
  //  - If raw cost is within a reasonable multiple of price, prefer PER-SHARE
  //  - Else choose the interpretation whose total is closer to MV
  const reasonableMultiple = c / p; // how many x price this cost looks like
  const looksLikePerShare = reasonableMultiple > 0.2 && reasonableMultiple < 3.0;

  if (looksLikePerShare && distA <= distB * 1.25) {
    return Math.max(c, 0.01);
  }

  // Else pick the closer one
  const chosen = distB < distA ? Math.max(perShareB, 0.01) : Math.max(c, 0.01);

  // Final sanity: keep per-share cost within a reasonable band vs price
  // (avoids microscopic costs that explode returns)
  const minBand = p * 0.5;  // -50% vs current price
  const maxBand = p * 1.5;  // +50% vs current price
  return clamp(chosen, minBand, maxBand);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

/* -------------------- main adapter -------------------- */

export function adaptParseResultToLegacy(parsed: ParseResult): LegacyAdapted {
  const raw = parsed?.holdings ?? [];

  // First pass: create normalized rows with safe numerics
  const normalized = raw.map((h) => {
    const shares = pos(nz(h.shares, 0));
    const price = pos(nz(h.price, 0));
    const mv = pos(nz(h.market_value, shares * price));

    // robust cost inference
    const costPerShare = inferCostPerShare(h.cost_basis, price, shares, mv);
    const totalCost = costPerShare * shares;

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
      unrealizedPL,
      unrealizedPLPercent,
      totalReturn: unrealizedPLPercent, // alias some components use
    } as LegacyHolding;
  });

  // Totals (ignore negative/zero MV for weights)
  const totalValue = normalized.reduce((s, r) => s + pos(r.marketValue), 0);
  const positionsCount = normalized.length;

  // If total cost is suspiciously tiny vs MV (e.g., < 30%), we assume
  // mis-labeled cost-basis in some rows. In that case we harden by
  // resetting per-share cost to current price for any row that causes
  // a ridiculous PL% (> +150% or < -90%).
  const totalCostRaw = normalized.reduce((s, r) => s + pos(r.totalCost), 0);
  const costTooSmall = totalValue > 0 && totalCostRaw < totalValue * 0.3;

  let hardened = normalized;
  if (costTooSmall) {
    hardened = normalized.map((r) => {
      if (r.totalCost <= 0) {
        const costBasis = clamp(r.price, r.price * 0.5, r.price * 1.5);
        const totalCost = costBasis * r.shares;
        const unrealizedPL = r.marketValue - totalCost;
        const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;
        return { ...r, costBasis, totalCost, unrealizedPL, unrealizedPLPercent, totalReturn: unrealizedPLPercent };
      }
      // cap absurd PL% caused by noisy inputs
      const tooHigh = r.unrealizedPLPercent > 150 || r.unrealizedPLPercent < -90;
      if (tooHigh) {
        const costBasis = clamp(r.price, r.price * 0.5, r.price * 1.5);
        const totalCost = costBasis * r.shares;
        const unrealizedPL = r.marketValue - totalCost;
        const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;
        return { ...r, costBasis, totalCost, unrealizedPL, unrealizedPLPercent, totalReturn: unrealizedPLPercent };
      }
      return r;
    });
  }

  // Recompute totals and weights after hardening
  const totalMV = hardened.reduce((s, r) => s + pos(r.marketValue), 0);
  const weightsDen = totalMV > 0 ? totalMV : 1;
  const withWeights = hardened.map((r) => ({
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
    totalValue: totalMV,
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