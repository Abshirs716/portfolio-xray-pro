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
    s = s.replace('"""','').replace('"','').strip()
    if s.lower() in _NUM_NULLS: return None
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("() ").replace(",", "").replace("$", "").replace("%", "")
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
# Alias dictionary (extended)
# =========================

ALIASES: Dict[str, List[str]] = {
    "symbol": ["symbol","ticker","security","securitysymbol","securityid","cusip","isin","sedol","underlying","product"],
    "name": ["name","securityname","description","securitydescription","longname","seclongname","issue"],
    "shares": ["shares","quantity","qty","units","position","amountshares","positionqty","positionquantity","holdings","unitsheld"],
    "price": ["price","unitprice","shareprice","pricepershare","lastprice","closeprice","marketprice","currentprice","nav","px"],
    "market_value": ["marketvalue","value","mv","currentvalue","positionvalue","marketval","marketvalueusd","currentmarketvalue","valusd","valueusd","mktvalue","mvusd"],
    "cost_basis": ["costbasis","bookvalue","avgcost","averagecost","bookcost","cost","purchaseprice","purchasecost","taxcost"],
    "currency": ["currency","curr","ccy","fx"],
    "sector": ["sector","industry","gicssector","category"],
    "date": ["date","asof","pricedate","tradedate","valuationdate","reportdate"],
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
    def looks_total(r: List[str]) -> bool:
        head = " ".join((c or "").lower() for c in r)[:100]
        return any(k in head for k in ["total","grand total","summary","account total","page","report"])

    cand_idx: List[int] = []
    for i, r in enumerate(rows[:120]):
        nonempty = [c for c in r if str(c).strip()]
        if len(nonempty) >= 3 and not looks_total(r):
            cand_idx.append(i)
    if not cand_idx:
        return ([], [])

    best_i = cand_idx[0]
    best_score = -1.0
    for i in cand_idx:
        r = rows[i]
        tokens = [str(c).strip() for c in r]
        if not tokens: continue
        num_like = 0; word_like = 0
        for t in tokens:
            t2 = t.replace('"','').strip()
            if re.fullmatch(r"[\$\(\)\d,\.\-\s%]+", t2):
                num_like += 1
            else:
                word_like += 1
        uniq = len(set(tokens))
        score = word_like*1.5 + uniq*0.25 - num_like*0.5
        if score > best_score:
            best_score = score
            best_i = i

    headers = [str(c or "").strip().strip('"') for c in rows[best_i]]
    while headers and headers[-1] == "": headers.pop()

    body: List[List[str]] = []
    for r in rows[best_i+1:]:
        row = [str(c or "").strip() for c in r[:len(headers)]]
        if len(row) < len(headers): row += [""]*(len(headers)-len(row))
        if any(c.strip() for c in row): body.append(row)
    return (headers, body)

def _csv_text_to_rows(text: str) -> Tuple[List[str], List[List[str]], List[str]]:
    raw_lines = text.splitlines()
    preview = raw_lines[:50]
    delim = _detect_delimiter_by_vote(preview)
    reader = csv.reader(io.StringIO(text), delimiter=delim, quotechar='"', skipinitialspace=True)
    rows = [list(row) for row in reader]
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
    """
    Returns (headers, rows, preview_lines, errors[])
    """
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
            # fall through to text route

    text = _decode(file_bytes)
    try:
        headers, body, preview = _csv_text_to_rows(text)
        return (headers, body, preview, errors)
    except Exception as e:
        return ([], [], [], errors + [f"text_parse_failed:{type(e).__name__}"])

# =========================
# Custodian + file type
# =========================

def detect_custodian(sample_lines: List[str]) -> str:
    blob = " ".join([ln.lower() for ln in sample_lines])
    for name in _RECOGNIZED_CUSTODIANS:
        if name in blob: return name.title()
    return "Unknown"

def _fuzzy_find(canon_headers: List[str], candidates: List[str]) -> Optional[int]:
    # exact > endswith > contains
    best_score = 0; best_idx: Optional[int] = None
    for i, h in enumerate(canon_headers):
        for alias in candidates:
            if h == alias:
                score = 300
            elif h.endswith(alias) or alias.endswith(h):
                score = 200
            elif alias in h:
                score = 120
            else:
                continue
            if score > best_score:
                best_score = score; best_idx = i
    return best_idx

def build_index_map(headers: List[str], explicit_map: Optional[Dict[str, str]] = None) -> Dict[str, int]:
    ch = [_canon(h) for h in headers]
    out: Dict[str, int] = {}

    # explicit first
    if explicit_map:
        for field, col_name in explicit_map.items():
            col = _canon(col_name)
            # try exact/contains
            try:
                out[field] = ch.index(col)
            except ValueError:
                idx = _fuzzy_find(ch, [col])
                if idx is not None: out[field] = idx

    # fill rest via fuzzy alias
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
    pos = _score_presence(headers, ["symbol"]) + max(_score_presence(headers, ["shares"]), _score_presence(headers, ["market_value"]))
    prc = _score_presence(headers, ["symbol"]) + _score_presence(headers, ["price"]) + _score_presence(headers, ["date"])
    txn = _score_presence(headers, ["symbol"]) + _score_presence(headers, ["type"])
    best = max(pos, prc, txn)
    if best <= 0: return "unknown"
    if best == pos: return "positions"
    if best == prc: return "prices"
    if best == txn: return "transactions"
    return "positions"

# =========================
# Row parsers
# =========================

def _cell(r: List[str], i: Optional[int]) -> Optional[str]:
    if i is None or i < 0 or i >= len(r): return None
    val = (r[i] or "").strip().strip('"')
    return val.replace('"""', '').strip() or None

def parse_positions(headers: List[str], rows: List[List[str]], idx: Dict[str, int]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for r in rows:
        if all(not (c and c.strip()) for c in r): continue
        joined = " ".join((c or "").lower() for c in r)
        if "total" in joined and "market" in joined: continue

        symbol = (_cell(r, idx.get("symbol")) or _cell(r, idx.get("name")) or "").strip()
        if not symbol: continue

        name = _cell(r, idx.get("name"))
        sector = _cell(r, idx.get("sector"))
        currency = _cell(r, idx.get("currency")) or "USD"

        shares = sanitize_number(_cell(r, idx.get("shares"))) or 0.0
        price  = sanitize_number(_cell(r, idx.get("price")))
        mv     = sanitize_number(_cell(r, idx.get("market_value")))

        if mv is None and price is not None:
            mv = shares * price
        if (mv is None or mv == 0.0) and shares == 0.0:
            continue

        out.append({
            "symbol": symbol.upper(),
            "name": name or symbol.upper(),
            "shares": float(shares),
            "price": float(price or 0.0),
            "market_value": float(mv or 0.0),
            "cost_basis": sanitize_number(_cell(r, idx.get("cost_basis"))),
            "sector": sector or None,
            "currency": currency,
        })
    return out

def parse_prices(headers: List[str], rows: List[List[str]], idx: Dict[str, int]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for r in rows:
        if all(not (c and c.strip()) for c in r): continue
        symbol = (_cell(r, idx.get("symbol")) or "").strip()
        if not symbol: continue
        price = sanitize_number(_cell(r, idx.get("price")))
        date  = _cell(r, idx.get("date"))
        if price is None: continue
        out.append({"symbol": symbol.upper(), "price": float(price), "date": date})
    return out

# =========================
# Confidence & result builder
# =========================

def _confidence(headers: List[str], idx: Dict[str, int], parsed_count: int) -> int:
    weight = 0
    for f in ("symbol","shares","price","market_value"):
        if f in idx: weight += 1
    base = 20 * weight
    rows_bonus = 20 if parsed_count >= 5 else 10 if parsed_count >= 1 else 0
    return max(10, min(99, base + rows_bonus))

def build_parse_result(
    file_bytes_list: List[Tuple[str, bytes]],
    explicit_mapping: Optional[Dict[str, Dict[str, str]]] = None
) -> Dict[str, Any]:
    combined_holdings: List[Dict[str, Any]] = []
    file_previews: List[Dict[str, Any]] = []
    any_custodian = "Unknown"

    for (fname, blob) in file_bytes_list:
        headers, rows, raw_preview, errs = extract_header_and_rows(fname, blob)
        custodian = detect_custodian(raw_preview)
        if any_custodian == "Unknown" and custodian != "Unknown":
            any_custodian = custodian

        idx = build_index_map(headers, (explicit_mapping or {}).get(fname))
        ftype = guess_file_type(headers)

        parsed: List[Dict[str, Any]] = []
        if ftype == "positions":
            parsed = parse_positions(headers, rows, idx)
        elif ftype == "prices":
            parsed = parse_prices(headers, rows, idx)

        conf = _confidence(headers, idx, len(parsed))
        require_mapping = (ftype == "unknown") or (conf < 70) or (ftype == "positions" and not parsed and len(rows) > 0)

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