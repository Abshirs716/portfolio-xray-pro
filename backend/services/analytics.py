import pandas as pd
import numpy as np
from typing import Dict, List

# --------- Helpers ---------

def _safe_num(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce").fillna(0.0).astype(float)

def _weights(mv: pd.Series) -> pd.Series:
    total = float(mv.sum())
    if total <= 0:
        return mv * 0.0
    return (mv / total).astype(float)

def _top_k_weight(weights: pd.Series, k: int) -> float:
    if weights.empty:
        return 0.0
    return float(weights.sort_values(ascending=False).head(k).sum())

def _diversification_score(weights: pd.Series) -> float:
    """
    Herfindahl-Hirschman-based diversification:
      HHI = sum(w_i^2). Perfect concentration (one holding) -> HHI = 1.0
      For N equal weights: HHI = 1/N (diversified).
    Normalize to [0,1] so that higher = more diversified:
      score = (1 - HHI) / (1 - 1/N) for N>1; else 0
    """
    w = weights[weights > 0]
    n = len(w)
    if n <= 1:
        return 0.0
    hhi = float((w ** 2).sum())
    return float(max(0.0, min(1.0, (1.0 - hhi) / (1.0 - 1.0 / n))))

def _round2(x: float) -> float:
    try:
        return round(float(x), 2)
    except Exception:
        return 0.0

def _round4(x: float) -> float:
    try:
        return round(float(x), 4)
    except Exception:
        return 0.0

# --------- Public API ---------

def analyze_portfolio(df: pd.DataFrame) -> Dict:
    """
    Enhanced minimal analysis (Step B):
      - Cleans numeric columns
      - Computes per-holding weights
      - Concentration metrics (Top-1/3/5)
      - Sector allocation (values and weights)
      - Diversification score (HHI-based)
      - Basic transparency metrics + score
      - Diagnostics for frontend display
    Expected columns after normalization: 
      ['symbol','name','quantity','price','market_value','sector','currency']
    """
    if df is None or df.empty:
        return {
            "total_value": 0.0,
            "holdings": 0,
            "sector_allocation_value": {},
            "sector_allocation_weight": {},
            "top_holdings": [],
            "top1_weight": 0.0,
            "top3_weight": 0.0,
            "top5_weight": 0.0,
            "diversification_score": 0.0,
            "transparency": {
                "priced_ratio": 0.0,
                "mv_ratio": 0.0,
                "mapped_ratio": 0.0,
                "score": 0.0
            },
            "diagnostics": {
                "missing_symbol_rows": 0,
                "zero_mv_rows": 0,
                "duplicate_symbols": [],
            }
        }

    # Basic cleanup
    df = df.copy()
    # force expected cols
    for c in ["symbol","name","quantity","price","market_value","sector","currency"]:
        if c not in df.columns:
            df[c] = np.nan

    # numeric coercion
    df["quantity"] = _safe_num(df["quantity"])
    df["price"] = _safe_num(df["price"])
    df["market_value"] = _safe_num(df["market_value"])

    # recompute MV where missing/zero if qty*price exists
    mask_mv0 = df["market_value"] == 0
    df.loc[mask_mv0, "market_value"] = (df["quantity"] * df["price"]).where(mask_mv0, df["market_value"])

    # drop rows with no symbol AND zero MV (pure noise rows)
    sym_missing = df["symbol"].isna() | (df["symbol"].astype(str).str.strip() == "")
    zero_mv = df["market_value"] == 0
    noise_mask = sym_missing & zero_mv
    if noise_mask.any():
        df = df.loc[~noise_mask].copy()

    # totals & weights
    total_value = float(df["market_value"].sum())
    # group by symbol to consolidate duplicates
    by_symbol = (
        df.groupby(["symbol","name","sector","currency"], dropna=False)["market_value"]
          .sum()
          .reset_index()
          .sort_values("market_value", ascending=False)
    )
    weights = _weights(by_symbol["market_value"])

    # concentration & diversification
    top1 = _top_k_weight(weights, 1)
    top3 = _top_k_weight(weights, 3)
    top5 = _top_k_weight(weights, 5)
    div_score = _diversification_score(weights)

    # top holdings records (value + weight)
    by_symbol["weight"] = weights
    top_holdings = by_symbol.head(10).copy()
    top_holdings["market_value"] = top_holdings["market_value"].map(_round2)
    top_holdings["weight"] = top_holdings["weight"].apply(lambda x: _round4(x))
    top_holdings_records = top_holdings.rename(columns={
        "symbol":"symbol","name":"name","sector":"sector","currency":"currency",
        "market_value":"market_value","weight":"weight"
    }).to_dict(orient="records")

    # sector allocation (value & weight)
    if "sector" in df.columns:
        sector_val = df.groupby("sector", dropna=False)["market_value"].sum().sort_values(ascending=False)
        sector_wt = _weights(sector_val)
        sector_val_json = {str(k if pd.notna(k) else "Unclassified"): _round2(v) for k, v in sector_val.items()}
        sector_wt_json = {str(k if pd.notna(k) else "Unclassified"): _round4(v) for k, v in sector_wt.items()}
    else:
        sector_val_json, sector_wt_json = {}, {}

    # transparency primitives
    priced_ratio = float((df["price"] > 0).mean()) if len(df) else 0.0
    mv_ratio = float((df["market_value"] > 0).mean()) if len(df) else 0.0
    # mapped ratio ~ proportion of expected fields present & non-empty at least once
    expected = ["symbol","quantity","price","market_value"]
    present = 0
    for c in expected:
        if c in df.columns and (df[c].notna() & (df[c] != 0) if c in {"quantity","price","market_value"} else df[c].astype(str).str.strip() != "").any():
            present += 1
    mapped_ratio = present / len(expected) if expected else 0.0
    transparency_score = 100.0 * (0.5 * mv_ratio + 0.3 * priced_ratio + 0.2 * mapped_ratio)

    # diagnostics
    dupes = (
        by_symbol["symbol"].astype(str)
        .value_counts()
        .loc[lambda s: s > 1]
        .index.tolist()
    )
    diagnostics = {
        "missing_symbol_rows": int(sym_missing.sum()),
        "zero_mv_rows": int((df["market_value"] == 0).sum()),
        "duplicate_symbols": dupes,
    }

    return {
        "total_value": _round2(total_value),
        "holdings": int(by_symbol["symbol"].nunique()),
        "sector_allocation_value": sector_val_json,
        "sector_allocation_weight": sector_wt_json,
        "top_holdings": top_holdings_records,
        "top1_weight": _round4(top1),
        "top3_weight": _round4(top3),
        "top5_weight": _round4(top5),
        "diversification_score": _round4(div_score),
        "transparency": {
            "priced_ratio": _round4(priced_ratio),
            "mv_ratio": _round4(mv_ratio),
            "mapped_ratio": _round4(mapped_ratio),
            "score": _round2(transparency_score),
        },
        "diagnostics": diagnostics
    }
