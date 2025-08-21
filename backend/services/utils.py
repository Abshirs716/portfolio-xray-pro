import pandas as pd
import numpy as np
import re
from typing import Dict, List

# ---------- 1) Header Synonyms & Standard Schema ----------

STANDARD_ORDER = ["symbol", "name", "quantity", "price", "market_value", "sector", "currency"]

SYNONYMS: Dict[str, List[str]] = {
    "symbol": [
        "symbol","ticker","security","secid","security id","security_id","instrument",
        "isin","cusip"  # if you want to treat CUSIP/ISIN as symbol, keep them here
    ],
    "name": [
        "name","security name","description","security description","long name","security_long_name"
    ],
    "quantity": [
        "quantity","qty","shares","units","position","position quantity","position_quantity"
    ],
    "price": [
        "price","last price","close price","market price","current price","unit price","px","last_px"
    ],
    "market_value": [
        "market value","current value","mv","value","position value","marketvalue","position_value"
    ],
    "sector": [
        "sector","gics sector","gics_sector","industry","industry group","industry_group"
    ],
    "currency": [
        "currency","ccy","iso_currency","base currency","reporting currency"
    ],
}

# Build a reverse index for faster matching
CANON_TO_SYNONYM = {canon: set([canon] + alts) for canon, alts in SYNONYMS.items()}
FLAT_INDEX: Dict[str, str] = {}
for canon, alts in CANON_TO_SYNONYM.items():
    for label in alts:
        FLAT_INDEX[label] = canon

# ---------- 2) Robust Numeric Coercion ----------

_MONEY_RE = re.compile(r"[,\s$£€¥]")

def _to_number(x):
    """
    Convert strings like "$12,345.67", "(1,234.50)", "—", "" into float.
    Leaves clean numbers untouched. Non-convertible → np.nan.
    """
    if x is None:
        return np.nan
    if isinstance(x, (int, float, np.number)):
        return float(x)
    s = str(x).strip()
    if s == "" or s == "—" or s.lower() in {"nan", "none", "null"}:
        return np.nan
    # Parentheses mean negative
    neg = s.startswith("(") and s.endswith(")")
    s = s[1:-1] if neg else s
    # Remove currency symbols, commas, spaces
    s = _MONEY_RE.sub("", s)
    # Handle percentages like "12.3%" → 0.123
    if s.endswith("%"):
        try:
            return float(s[:-1]) / 100.0 * (-1 if neg else 1)
        except:
            return np.nan
    try:
        val = float(s)
        return -val if neg else val
    except:
        return np.nan

def _smart_numeric(series: pd.Series) -> pd.Series:
    """Vectorized numeric cleanup."""
    return series.apply(_to_number).astype(float)

# ---------- 3) Header Normalization ----------

def _canonical_name(col: str) -> str:
    """
    Map an incoming column name to a canonical internal name
    using the synonyms dictionary. Falls back to lower-stripped.
    """
    lc = col.strip().lower()
    # direct lookup
    if lc in FLAT_INDEX:
        return FLAT_INDEX[lc]
    # try removing punctuation / underscores
    lc2 = lc.replace("_", " ").replace("-", " ").strip()
    return FLAT_INDEX.get(lc2, lc)

def _rename_to_canonical(df: pd.DataFrame) -> pd.DataFrame:
    new_cols = {}
    seen = set()
    for c in df.columns:
        can = _canonical_name(c)
        # avoid duplicate canon names by keeping the first occurrence
        if can in seen:
            new_cols[c] = c  # keep original
        else:
            new_cols[c] = can
            seen.add(can)
    return df.rename(columns=new_cols)

# ---------- 4) Custodian Heuristics (optional) ----------

def detect_custodian(df: pd.DataFrame) -> str:
    """
    Heuristic detection (optional for logging/UI).
    You can extend with more precise rules if needed.
    """
    headers = set([c.lower().strip() for c in df.columns])
    if {"description","market value"}.issubset(headers) or {"description","market_value"}.issubset(headers):
        return "interactive_brokers_like"
    if {"security name","ticker"}.issubset(headers):
        return "fidelity_like"
    if {"security description","symbol"}.issubset(headers):
        return "schwab_like"
    return "custom"

# ---------- 5) Public Normalizer ----------

def normalize_custodian_csv(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalize any custodian CSV into standard schema:
    ['symbol','name','quantity','price','market_value','sector','currency']

    - Canonicalizes headers via synonyms
    - Coerces numeric fields robustly (currency symbols, commas, parentheses)
    - Computes market_value = quantity * price if missing
    - Strips blank rows and keeps only standard columns (in order)
    """

    if df is None or df.empty:
        return pd.DataFrame(columns=STANDARD_ORDER)

    # 1) Canonicalize headers
    df = _rename_to_canonical(df)

    # 2) Keep best-guess columns; create missing ones empty
    for col in STANDARD_ORDER:
        if col not in df.columns:
            df[col] = np.nan

    # 3) Numeric coercion
    df["quantity"] = _smart_numeric(df["quantity"])
    df["price"] = _smart_numeric(df["price"])
    df["market_value"] = _smart_numeric(df["market_value"])

    # 4) If market_value missing/zero, recompute from qty * price
    mv_missing = df["market_value"].isna() | (df["market_value"] == 0)
    df.loc[mv_missing, "market_value"] = (df["quantity"].fillna(0) * df["price"].fillna(0))

    # 5) Clean text columns
    for tcol in ["symbol", "name", "sector", "currency"]:
        if tcol in df.columns:
            df[tcol] = df[tcol].astype(str).replace({"nan": "", "None": "", "NaN": ""}).str.strip()

    # 6) Drop rows that still have no symbol and no value
    df = df[~(df["symbol"].replace({"": np.nan}).isna() & (df["market_value"].fillna(0) == 0))]

    # 7) Ensure order & only standard columns
    df = df[STANDARD_ORDER]

    # (Optional) attach provenance-like hints as attrs for debugging
    df.attrs["custodian_guess"] = detect_custodian(df)

    return df.reset_index(drop=True)
