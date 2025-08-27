# backend/routes/universal_ingest.py
from __future__ import annotations
import io
import os
import re
import csv
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel

# Optional pandas support for Excel; fall back to pure CSV if missing
try:
    import pandas as pd  # type: ignore
    HAS_PANDAS = True
except Exception:
    HAS_PANDAS = False

router = APIRouter(tags=["universal_ingest"])

# ---------- helpers ----------
_NUM_RE = re.compile(r"-?\$?\(?\d{1,3}(?:,\d{3})*(?:\.\d+)?\)?|\$?\(?\d+(?:\.\d+)?\)?")

def _to_number(x: Any) -> float:
    if x is None:
        return 0.0
    s = str(x).strip()
    if s == "":
        return 0.0
    neg = s.startswith("(") and s.endswith(")")
    s = s.replace("$", "").replace(",", "").replace("(", "").replace(")", "")
    try:
        v = float(s)
    except ValueError:
        return 0.0
    return -v if neg else v

def _is_total_row(cells: List[str]) -> bool:
    if not cells:
        return False
    first = (cells[0] or "").strip().lower()
    # common custodial total markers
    return any(k in first for k in ["total", "grand total", "account total", "summary"])

def _detect_delimiter(sample: str) -> str:
    for d in [",", "\t", ";", "|"]:
        if d in sample:
            return d
    return ","

def _decode_bytes(b: bytes) -> str:
    for enc in ("utf-8", "latin1"):
        try:
            return b.decode(enc, errors="ignore")
        except Exception:
            continue
    return b.decode(errors="ignore")

def _pick_header_and_rows(lines: List[str]) -> Tuple[List[str], List[List[str]], int]:
    """
    Heuristically choose header among the first 10 lines:
    - needs >=3 columns
    - not "mostly numeric"
    - not a total/summary line
    Returns (headers, rows, header_index)
    """
    for i, raw in enumerate(lines[:10]):
        if not raw.strip():
            continue
        d = _detect_delimiter(raw)
        cols = [c.strip().strip('"').strip("'") for c in raw.split(d)]
        if len([c for c in cols if c]) < 3:
            continue
        if _is_total_row(cols):
            continue
        numeric_like = sum(1 for c in cols if _NUM_RE.fullmatch(c or "") is not None)
        # treat as header if less than half look numeric
        if numeric_like <= len(cols) // 2:
            headers = cols
            rows: List[List[str]] = []
            for data in lines[i + 1 :]:
                parts = [p.strip().strip('"').strip("'") for p in data.split(d)]
                if not any(parts):
                    continue
                if _is_total_row(parts):
                    continue
                rows.append(parts)
            return headers, rows, i
    # fallback: first non-empty line as header
    for i, raw in enumerate(lines):
        if raw.strip():
            d = _detect_delimiter(raw)
            headers = [c.strip().strip('"').strip("'") for c in raw.split(d)]
            rows: List[List[str]] = []
            for data in lines[i + 1 :]:
                parts = [p.strip().strip('"').strip("'") for p in data.split(d)]
                if not any(parts):
                    continue
                if _is_total_row(parts):
                    continue
                rows.append(parts)
            return headers, rows, i
    return [], [], 0

def _auto_map(headers: List[str]) -> Dict[str, int]:
    """
    Map typical portfolio columns → indices.
    """
    h = [x.lower() for x in headers]
    def pick(*keys: str) -> int:
        for i, col in enumerate(h):
            for k in keys:
                if k in col:
                    return i
        return -1

    return {
        "symbol": pick("symbol", "ticker"),
        "name": pick("name", "security", "description"),
        "quantity": pick("quantity", "qty", "shares", "share"),
        "price": pick("price", "last", "close"),
        "market_value": pick("market value", "market_value", "marketvalue", "value"),
        "sector": pick("sector"),
        "cost_basis": pick("cost basis", "cost_basis", "cost"),
        "currency": pick("currency", "ccy"),
    }

def _guess_confidence(headers: List[str]) -> float:
    h = [x.lower() for x in headers]
    score = 0.0
    if any(k in h for k in ["symbol", "ticker"]):
        score += 0.35
    if any(("quantity" in x) or ("shares" in x) for x in h):
        score += 0.25
    if any("price" in x for x in h):
        score += 0.2
    if any(("market value" in x) or ("market_value" in x) or (x == "value") for x in h):
        score += 0.2
    return max(0.0, min(100.0, round(score * 100, 1)))

def _custodian_guess(filename: str, headers: List[str]) -> str:
    name = filename.lower()
    text = " ".join(headers).lower()
    if "schwab" in name or "schwab" in text:
        return "Charles Schwab"
    if "fidelity" in name or "fidelity" in text:
        return "Fidelity"
    if "ibkr" in name or "interactive brokers" in text:
        return "Interactive Brokers"
    if "vanguard" in name or "vanguard" in text:
        return "Vanguard"
    if "morgan stanley" in name or "morgan stanley" in text:
        return "Morgan Stanley"
    if "td ameritrade" in name or "td ameritrade" in text:
        return "TD Ameritrade"
    return "Unknown / Mixed"

def _normalize_positions(headers: List[str], rows: List[List[str]]) -> List[Dict[str, Any]]:
    mapping = _auto_map(headers)
    out: List[Dict[str, Any]] = []
    for r in rows:
        def val(idx: int) -> str:
            return r[idx].strip() if 0 <= idx < len(r) else ""
        symbol = val(mapping.get("symbol", -1)) or val(mapping.get("ticker", -1))
        name = val(mapping.get("name", -1))
        qty = _to_number(val(mapping.get("quantity", -1)))
        price = _to_number(val(mapping.get("price", -1)))
        mv = _to_number(val(mapping.get("market_value", -1)))
        if mv == 0 and (qty or price):
            mv = qty * price
        sector = val(mapping.get("sector", -1))
        cost = _to_number(val(mapping.get("cost_basis", -1)))
        ccy = val(mapping.get("currency", -1))
        # skip blank lines
        if not symbol and qty == 0 and price == 0 and mv == 0:
            continue
        out.append({
            "symbol": symbol,
            "name": name,
            "quantity": qty,
            "price": price,
            "market_value": mv,
            "sector": sector,
            "cost_basis": cost,
            "currency": ccy,
        })
    return out

def _read_csv_text(text: str) -> Tuple[List[str], List[List[str]]]:
    # Remove blank lines up front
    normalized = "\n".join([ln for ln in text.splitlines() if ln.strip() != ""])
    lines = normalized.splitlines()
    headers, rows, _ = _pick_header_and_rows(lines)
    return headers, rows

def _read_file_any(uf: UploadFile) -> Tuple[str, List[str], List[List[str]], str]:
    """
    Returns: (filename, headers, rows, note)
    note is a human-friendly string about how it was parsed.
    """
    name = uf.filename or f"file-{id(uf)}"
    raw = uf.file.read()  # already in memory with FastAPI
    # Try Excel via pandas
    ext = (os.path.splitext(name)[1] or "").lower()
    if ext in [".xlsx", ".xls"] and HAS_PANDAS:
        try:
            uf.file.seek(0)
            data = uf.file.read()
            bio = io.BytesIO(data)
            df = pd.read_excel(bio, engine="openpyxl")
            # heuristics: find header row by scanning for a row with >= 3 non-numeric strings
            # If df already used first row as header, keep; otherwise coerce columns to strings
            df.columns = [str(c).strip() for c in df.columns]
            # Drop fully empty rows
            df = df.dropna(how="all")
            # Convert to rows
            headers = [str(c).strip() for c in df.columns]
            rows: List[List[str]] = df.astype(str).applymap(lambda x: x.strip()).values.tolist()
            # Remove obvious total rows
            rows = [r for r in rows if not _is_total_row(r)]
            return name, headers, rows, "excel/pandas"
        except Exception:
            pass  # fall back to CSV parsing

    # CSV / TSV
    uf.file.seek(0)
    text = _decode_bytes(raw)
    headers, rows = _read_csv_text(text)
    return name, headers, rows, "text/csv-like"

# ---------- response model your UI already understands ----------
class ParseResult(BaseModel):
    holdings: List[Dict[str, Any]]
    totals: Dict[str, Any]
    metadata: Dict[str, Any]

# ---------- endpoint: universal upload (multi-file) ----------
@router.post("/universal/upload", response_model=ParseResult)
async def universal_upload(
    files: List[UploadFile] = File(...),
    firm_id: Optional[str] = Form(None),
    client_id: Optional[str] = Form(None),
):
    """
    Single-call universal parser:
    - accepts multiple files
    - auto-detects headers
    - normalizes positions
    - merges results
    - returns ParseResult for your current dashboard
    """
    all_positions: List[Dict[str, Any]] = []
    confidences: List[float] = []
    custodians_seen: List[str] = []

    for uf in files:
        name, headers, rows, note = _read_file_any(uf)
        if not headers or not rows:
            continue
        positions = _normalize_positions(headers, rows)
        if positions:
            all_positions.extend(positions)
        confidences.append(_guess_confidence(headers))
        custodians_seen.append(_custodian_guess(name, headers))

    total_value = sum(_to_number(p.get("market_value", 0)) for p in all_positions)
    # compute weights inline so your UI can render allocs immediately
    weights_denom = total_value if total_value > 0 else sum(_to_number(p.get("quantity", 0)) * _to_number(p.get("price", 0)) for p in all_positions)
    safe_denom = weights_denom if weights_denom > 0 else 1.0
    holdings = []
    for p in all_positions:
        mv = _to_number(p.get("market_value", 0))
        if mv == 0:
            mv = _to_number(p.get("quantity", 0)) * _to_number(p.get("price", 0))
        h = {
            "symbol": p.get("symbol", ""),
            "name": p.get("name", ""),
            "shares": _to_number(p.get("quantity", 0)),
            "price": _to_number(p.get("price", 0)),
            "market_value": mv,
            "sector": p.get("sector") or "",
            "cost_basis": _to_number(p.get("cost_basis", 0)),
            "currency": p.get("currency") or "",
            "weight": (mv / safe_denom) if safe_denom > 0 else 0.0,
        }
        holdings.append(h)

    # Metadata
    confidence = round(sum(confidences) / len(confidences), 1) if confidences else 100.0
    custodian_detected = " / ".join(sorted(set([c for c in custodians_seen if c and c != 'Unknown / Mixed']))) or "Unknown / Mixed"

    return ParseResult(
        holdings=holdings,
        totals={"total_value": round(total_value, 2), "positions_count": len(holdings)},
        metadata={
            "custodianDetected": custodian_detected,
            "confidence": confidence,
            "transparency_score": 100 if holdings else 0,
            "batch_mode": "universal_single_call",
        },
    )
