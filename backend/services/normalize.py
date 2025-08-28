# backend/services/normalize.py
from __future__ import annotations
import csv, io, re
from typing import Dict, List, Tuple, Optional, Any

# Optional Excel support
try:
    import pandas as _pd  # type: ignore
    _HAS_PANDAS = True
except Exception:
    _pd = None
    _HAS_PANDAS = False

# =========================
# Number & header sanitizers
# =========================

_NUM_NULLS = {"", "nan", "null", "none", "-", "--", "n/a", "na"}

def sanitize_number(x: Any) -> Optional[float]:
    if x is None:
        return None
    if isinstance(x, (int, float)):
        try: return float(x)
        except Exception: return None
    s = str(x).strip()
    if not s: return None
    
    # Handle complex custodial formatting: """$18,723.00""" or """(10)"""
    s = s.replace('"""','').replace('"','').strip()
    if s.lower() in _NUM_NULLS: return None
    
    # Handle parentheses for negative values (common in custodial exports)
    neg = (s.startswith("(") and s.endswith(")")) or s.startswith("-")
    s = s.strip("()- ").replace(",", "").replace("$", "").replace("%", "")
    s = re.sub(r"\s+", "", s)
    
    try:
        v = float(s)
        return -v if neg else v
    except Exception:
        return None

_CANON_RX = re.compile(r"[^a-z0-9]+")
def _canon(h: str) -> str:
    return _CANON_RX.sub("", (h or "").lower()).strip()

# =========================
# Enhanced Universal alias dictionary (ALL custodians + custom formats)
# =========================

ALIASES: Dict[str, List[str]] = {
    "symbol": ["symbol","ticker","security","securitysymbol","securityid","cusip","isin","sedol","underlying","product","mysymbol"],
    "name": ["name","securityname","securitydescription","description","longname","seclongname","issue","nameofsecurity"],
    "shares": ["shares","quantity","qty","units","position","amountshares","positionqty","positionquantity","holdings","unitsheld"],
    "price": ["price","unitprice","shareprice","pricepershare","lastprice","closeprice","marketprice","currentprice","nav","px","close"],
    "market_value": ["marketvalue","value","mv","currentvalue","positionvalue","marketval","marketvalueusd","currentmarketvalue","valusd","valueusd","mktvalue","mvusd","currentvalue"],
    "cost_basis": ["costbasis","cost","bookvalue","avgcost","averagecost","bookcost","purchaseprice","purchasecost","taxcost","basis","averageprice","avgprice","unitcost","totalcost"],
    "currency": ["currency","curr","ccy","fx"],
    "sector": ["sector","industry","gicssector","category"],
    "date": ["date","asof","pricedate","tradedate","valuationdate","reportdate","datetime","timestamp"],
    "type": ["type","action","transactiontype","activity","activitytype"],
}

_RECOGNIZED_CUSTODIANS = [
    "charles schwab","schwab","fidelity","td ameritrade","tdameritrade","ameritrade",
    "interactive brokers","ibkr","etrade","e*trade","vanguard","merrill",
    "morgan stanley","ubs","wells fargo","raymond james","jpmorgan","j.p. morgan",
    "lpl financial","ally invest","rbc","pershing","sei","apex","betterment"
]

# =========================
# File → rows (universal IO)
# =========================

def _decode(blob: bytes) -> str:
    for enc in ("utf-8-sig","utf-8","latin-1"):
        try: return blob.decode(enc)
        except Exception: continue
    return blob.decode("latin-1", errors="ignore")

def _detect_delimiter_by_vote(lines: List[str]) -> str:
    sample = [ln for ln in lines if ln.strip()][:30]
    cand = [",","\t",";","|"]
    votes = {d:0 for d in cand}
    for ln in sample:
        for d in cand:
            if ln.count(d) >= 1:
                votes[d] += 1
    return max(votes, key=votes.get) if sample else ","

def _pick_header_from_rows(rows: List[List[str]]) -> Tuple[List[str], List[List[str]]]:
    """Enhanced header detection for complex custodial formats"""
    
    def looks_total(r: List[str]) -> bool:
        head = " ".join((c or "").lower() for c in r)[:100]
        return any(k in head for k in ["total","grand total","summary","account total","page","report","***"])

    def looks_custodian_metadata(r: List[str]) -> bool:
        """Detect custodian header rows like 'Charles Schwab & Co., Inc.' or 'Account: 123-456'"""
        head = " ".join((c or "").lower() for c in r)[:200]
        metadata_indicators = [
            "charles schwab", "fidelity", "vanguard", "td ameritrade", "tdameritrade",
            "account:", "owner:", "as of", "positions export", "portfolio:",
            "interactive brokers", "etrade", "merrill lynch", "positions for account"
        ]
        return any(indicator in head for indicator in metadata_indicators)
    
    def is_data_header(r: List[str]) -> bool:
        """Identify actual data headers vs metadata rows"""
        if not r or len(r) < 2:
            return False
            
        clean_headers = []
        for h in r:
            if not h:
                continue
            cleaned = str(h).replace('"""', '').replace('"', '').strip()
            if cleaned:
                clean_headers.append(cleaned.lower())
        
        if len(clean_headers) < 2:
            return False
            
        financial_matches = 0
        for header in clean_headers:
            header_canon = _canon(header)
            for field, aliases in ALIASES.items():
                for alias in aliases:
                    alias_canon = _canon(alias)
                    if alias_canon and (alias_canon in header_canon or header_canon == alias_canon):
                        financial_matches += 1
                        break
        
        return financial_matches >= 2

    cand_idx: List[int] = []
    for i, r in enumerate(rows[:30]):
        if not r:
            continue
        if looks_custodian_metadata(r):
            continue
        if looks_total(r):
            continue
        
        nonempty = [c for c in r if str(c).strip()]
        if len(nonempty) >= 2:
            cand_idx.append(i)

    if not cand_idx:
        return ([], [])

    best_i = cand_idx[0]
    best_score = -1.0
    
    for i in cand_idx:
        r = rows[i]
        
        if is_data_header(r):
            score = 1000
        else:
            tokens = [str(c).strip().replace('"""', '').replace('"', '') for c in r if c]
            if not tokens:
                continue
                
            num_like = 0
            word_like = 0
            
            for t in tokens:
                if re.fullmatch(r"[\$\(\)\d,\.\-\s%]+", t.replace('"', '')):
                    num_like += 1
                else:
                    word_like += 1
            
            uniq = len(set(tokens))
            score = word_like * 2.0 + uniq * 0.5 - num_like * 0.3
        
        if score > best_score:
            best_score = score
            best_i = i

    headers = []
    for c in rows[best_i]:
        if c is None:
            headers.append("")
        else:
            # Critical: Clean triple quotes from headers
            cleaned = str(c).replace('"""', '').replace('"', '').strip()
            headers.append(cleaned)
    
    while headers and headers[-1] == "":
        headers.pop()

    body: List[List[str]] = []
    for r in rows[best_i + 1:]:
        if looks_total(r):
            continue
            
        row = []
        for j, c in enumerate(r[:len(headers)]):
            if c is None:
                row.append("")
            else:
                # Critical: Clean triple quotes from cell values
                cleaned = str(c).replace('"""', '').replace('"', '').strip()
                row.append(cleaned)
        
        while len(row) < len(headers):
            row.append("")
        
        if any(c.strip() for c in row):
            body.append(row)

    return (headers, body)

def _csv_text_to_rows(text: str) -> Tuple[List[str], List[List[str]], List[str]]:
    raw_lines = text.splitlines()
    preview = raw_lines[:50]
    delim = _detect_delimiter_by_vote(preview)
    
    reader = csv.reader(
        io.StringIO(text), 
        delimiter=delim, 
        quotechar='"', 
        skipinitialspace=True,
        doublequote=True
    )
    
    rows = []
    for row in reader:
        rows.append(list(row))
    
    headers, body = _pick_header_from_rows(rows)
    return (headers, body, preview)

def _load_xlsx_to_rows(blob: bytes) -> Tuple[Tuple[List[str], List[List[str]]], List[str]]:
    assert _HAS_PANDAS and _pd is not None
    b = io.BytesIO(blob)
    xl = _pd.ExcelFile(b)  # type: ignore
    best_df = None; best_score = -1
    for sheet in xl.sheet_names:
        df = xl.parse(sheet, header=None)
        cols_nonnull = df.count().gt(0).sum()
        rows_nonnull = df.count(axis=1).gt(0).sum()
        score = int(cols_nonnull) * int(rows_nonnull)
        if score > best_score:
            best_score = score; best_df = df
    if best_df is None:
        return ([], []), []
    data: List[List[str]] = [[("" if _pd.isna(x) else str(x)) for x in row] for row in best_df.values.tolist()]
    preview = ["\t".join(row[:10]) for row in data[:50]]
    return _pick_header_from_rows(data), preview

def extract_header_and_rows(filename: str, file_bytes: bytes) -> Tuple[List[str], List[List[str]], List[str], List[str]]:
    errors: List[str] = []
    lower = (filename or "").lower()

    if lower.endswith((".xlsx",".xls")):
        if not _HAS_PANDAS:
            return ([], [], [], ["excel_requires_pandas_openpyxl"])
        try:
            (headers, body), preview = _load_xlsx_to_rows(file_bytes)
            return (headers, body, preview, errors)
        except Exception as e:
            errors.append(f"excel_read_failed:{type(e).__name__}")

    text = _decode(file_bytes)
    try:
        headers, body, preview = _csv_text_to_rows(text)
        return (headers, body, preview, errors)
    except Exception as e:
        return ([], [], [], errors + [f"text_parse_failed:{type(e).__name__}"])

# =========================
# Enhanced Custodian detection
# =========================

def detect_custodian(sample_lines: List[str], filename: str = "") -> str:
    blob = " ".join([ln.lower() for ln in sample_lines])
    fname_lower = filename.lower()
    
    custodian_patterns = [
        ("Charles Schwab", ["charles schwab", "schwab"]),
        ("Fidelity", ["fidelity"]),
        ("TD Ameritrade", ["td ameritrade", "tdameritrade", "ameritrade", "td-"]),
        ("Vanguard", ["vanguard"]),
        ("Interactive Brokers", ["interactive brokers", "ibkr"]),
        ("E*Trade", ["etrade", "e*trade"]),
        ("Merrill Lynch", ["merrill"]),
    ]
    
    for custodian_name, patterns in custodian_patterns:
        if any(pattern in blob or pattern in fname_lower for pattern in patterns):
            return custodian_name
    
    if "custom" in fname_lower or "unknown" in fname_lower:
        return "Custom Format"
    
    return "Unknown"

def _fuzzy_find(canon_headers: List[str], candidates: List[str]) -> Optional[int]:
    best_score = 0; best_idx: Optional[int] = None
    for i, h in enumerate(canon_headers):
        for alias in candidates:
            alias_canon = _canon(alias)
            if not alias_canon:
                continue
            if h == alias_canon:
                score = 300
            elif h.endswith(alias_canon) or alias_canon.endswith(h):
                score = 200
            elif alias_canon in h or h in alias_canon:
                score = 120
            else:
                continue
            if score > best_score:
                best_score = score; best_idx = i
    return best_idx

def build_index_map(headers: List[str], explicit_map: Optional[Dict[str, str]] = None) -> Dict[str, int]:
    ch = [_canon(h) for h in headers]
    out: Dict[str, int] = {}

    if explicit_map:
        for field, col_name in explicit_map.items():
            col = _canon(col_name)
            try:
                out[field] = ch.index(col)
            except ValueError:
                idx = _fuzzy_find(ch, [col])
                if idx is not None: out[field] = idx

    for field, alias_list in ALIASES.items():
        if field in out: continue
        idx = _fuzzy_find(ch, alias_list)
        if idx is not None: out[field] = idx
    
    return out

def _score_presence(headers: List[str], fields: List[str]) -> int:
    ch = [_canon(h) for h in headers]
    score = 0
    for f in fields:
        idx = _fuzzy_find(ch, ALIASES.get(f, []))
        if idx is not None: score += 1
    return score

def guess_file_type(headers: List[str]) -> str:
    """Enhanced file type detection for price files"""
    headers_lower = [h.lower() for h in headers]
    
    # Strong indicators of price file - check first
    has_date = any(d in headers_lower for d in ['date', 'datetime', 'timestamp'])
    has_price_indicator = any(p in headers_lower for p in ['close', 'price', 'open', 'high', 'low'])
    has_position_indicator = any(s in headers_lower for s in ['shares', 'quantity', 'units', 'qty'])
    has_value_indicator = any(v in headers_lower for v in ['market value', 'marketvalue', 'value', 'market_value'])
    
    # If it has quantity/shares indicators OR market value, it's likely positions
    if has_position_indicator or has_value_indicator:
        return "positions"
    
    # If it has date and price but NO position indicators, it's a price file
    if has_date and has_price_indicator and not has_position_indicator and not has_value_indicator:
        return "prices"
    
    # Standard scoring
    pos_score = _score_presence(headers, ["symbol", "shares"]) + max(_score_presence(headers, ["price"]), _score_presence(headers, ["market_value"]))
    prc_score = _score_presence(headers, ["symbol", "price", "date"]) + (_score_presence(headers, ["close"]) * 2)
    txn_score = _score_presence(headers, ["symbol", "type", "date"])
    
    best_score = max(pos_score, prc_score, txn_score)
    if best_score <= 0: return "unknown"
    if best_score == prc_score: return "prices"
    if best_score == txn_score: return "transactions"
    return "positions"

# =========================
# Row parsers
# =========================

def _cell(r: List[str], i: Optional[int]) -> Optional[str]:
    if i is None or i < 0 or i >= len(r): return None
    val = (r[i] or "").strip().strip('"')
    # Critical: Clean triple quotes from cell values
    return val.replace('"""', '').strip() or None

def parse_positions(headers: List[str], rows: List[List[str]], idx: Dict[str, int]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    
    for r in rows:
        if all(not (c and c.strip()) for c in r): continue
        joined = " ".join((c or "").lower() for c in r)
        if "total" in joined and ("market" in joined or "***" in joined): continue

        symbol = (_cell(r, idx.get("symbol")) or _cell(r, idx.get("name")) or "").strip()
        if not symbol: continue

        name = _cell(r, idx.get("name")) or symbol.upper()
        sector = _cell(r, idx.get("sector"))
        currency = _cell(r, idx.get("currency")) or "USD"

        shares = sanitize_number(_cell(r, idx.get("shares"))) or 0.0
        price = sanitize_number(_cell(r, idx.get("price")))
        mv = sanitize_number(_cell(r, idx.get("market_value")))
        cost_basis_raw = sanitize_number(_cell(r, idx.get("cost_basis")))

        if mv is None and price is not None and shares != 0:
            mv = abs(shares) * price
        
        if mv is None or mv == 0.0:
            if shares == 0.0:
                continue

        if cost_basis_raw is None:
            cost_basis_raw = (price or 0.0) * 0.85 * abs(shares) if price else 0.0

        out.append({
            "symbol": symbol.upper(),
            "name": name,
            "shares": float(shares),
            "price": float(price or 0.0),
            "market_value": float(mv or 0.0),
            "cost_basis": float(cost_basis_raw or 0.0),
            "sector": sector,
            "currency": currency,
        })
    
    return out

def parse_prices(headers: List[str], rows: List[List[str]], idx: Dict[str, int]) -> List[Dict[str, Any]]:
    """Parse price data - but return empty since we only want positions"""
    return []

# =========================
# Confidence & result builder
# =========================

def _confidence(headers: List[str], idx: Dict[str, int], parsed_count: int) -> int:
    weight = 0
    for f in ("symbol","shares","price","market_value"):
        if f in idx: weight += 1
    
    base = 15 * weight
    rows_bonus = 15 if parsed_count >= 3 else 10 if parsed_count >= 1 else 0
    
    if weight >= 3:
        base += 20
    
    return max(10, min(95, base + rows_bonus))

def build_parse_result(
    file_bytes_list: List[Tuple[str, bytes]],
    explicit_mapping: Optional[Dict[str, Dict[str, str]]] = None
) -> Dict[str, Any]:
    combined_holdings: List[Dict[str, Any]] = []
    file_previews: List[Dict[str, Any]] = []
    any_custodian = "Unknown"
    
    for (fname, blob) in file_bytes_list:
        headers, rows, raw_preview, errs = extract_header_and_rows(fname, blob)
        custodian = detect_custodian(raw_preview, fname)
        if any_custodian == "Unknown" and custodian != "Unknown":
            any_custodian = custodian
        
        idx = build_index_map(headers, (explicit_mapping or {}).get(fname))
        ftype = guess_file_type(headers)
        
 # ADD THE DEBUG CODE HERE (right after the ftype line above)
        print(f"DEBUG: File {fname}")
        print(f"DEBUG: Headers detected: {headers}")
        print(f"DEBUG: First 3 rows: {rows[:3] if rows else 'No rows'}")
        print(f"DEBUG: Index map: {idx}")
        print(f"DEBUG: File type: {ftype}")

        parsed: List[Dict[str, Any]] = []
        if ftype == "positions":
            parsed = parse_positions(headers, rows, idx)
        elif ftype == "prices":
            parsed = parse_prices(headers, rows, idx)
        
        conf = _confidence(headers, idx, len(parsed))
        
        # Enhanced mapping detection
        has_valid_values = False
        if parsed and len(parsed) > 0:
            for p in parsed:
                if p.get("market_value", 0) > 0 or p.get("price", 0) > 0:
                    has_valid_values = True
                    break
        
        require_mapping = (
            (ftype == "unknown") or 
            (conf < 50) or 
            (ftype == "positions" and not parsed and len(rows) > 0) or
            (ftype == "positions" and parsed and not has_valid_values)
        )
        
        file_previews.append({
            "filename": fname,
            "type": ftype,
            "headers": headers,
            "sample_rows": rows[:5],
            "confidence": conf,
            "require_mapping": require_mapping,
            "custodian": custodian,
            "index_map": idx,
            "errors": errs,
            "ftype_guess": ftype,
            "parsed_rows_sample": parsed[:2],
        })
        
        # Only add positions to holdings, not prices
        if ftype == "positions" and parsed:
            combined_holdings.extend(parsed)

    total_value = float(sum((h.get("market_value") or 0.0) for h in combined_holdings))
    if total_value > 0:
        for h in combined_holdings:
            mv = float(h.get("market_value") or 0.0)
            h["weight"] = mv / total_value
    else:
        for h in combined_holdings:
            h["weight"] = 0.0

    return {
        "holdings": combined_holdings,
        "totals": {"total_value": total_value, "positions_count": len(combined_holdings)},
        "metadata": {
            "custodianDetected": any_custodian,
            "confidence": 95 if combined_holdings else 30,
            "files": file_previews,
            "transparency_score": 0.0,
            "batch_mode": True,
        }
    }