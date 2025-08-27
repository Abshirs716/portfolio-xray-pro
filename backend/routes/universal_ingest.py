# backend/routes/universal_ingest.py
from __future__ import annotations
import io
import os
import re
import csv
from typing import Any, Dict, List, Optional, Tuple

from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from routes.universal_ingest_patch import handle_universal_upload

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
    for enc in ["utf-8-sig", "utf-8", "latin-1", "windows-1252"]:
        try:
            return b.decode(enc)
        except Exception:
            continue
    # fallback
    return b.decode("latin-1", errors="ignore")

def _read_csv_text(text: str) -> Tuple[List[str], List[List[str]]]:
    """
    Returns (headers, rows) from CSV text.
    Auto-detects delimiter.
    Removes obvious total rows.
    """
    lines = text.strip().splitlines()
    if not lines:
        return [], []
    
    # detect delimiter
    sample = "\n".join(lines[:10])
    delim = _detect_delimiter(sample)
    
    # parse as CSV
    reader = csv.reader(io.StringIO(text), delimiter=delim)
    all_rows = list(reader)
    
    # find header row (first row with >= 3 non-empty cells)
    header_idx = None
    for i, row in enumerate(all_rows):
        if sum(1 for c in row if c and c.strip()) >= 3:
            header_idx = i
            break
    if header_idx is None:
        return [], []
    
    headers = [str(c).strip() for c in all_rows[header_idx]]
    rows = all_rows[header_idx + 1:]
    
    # remove empty rows and total rows
    rows = [r for r in rows if any(c and c.strip() for c in r)]
    rows = [r for r in rows if not _is_total_row(r)]
    
    return headers, rows

# ---------- custodian guessing ----------
def _custodian_guess(filename: str, headers: List[str]) -> str:
    fname_lower = filename.lower()
    headers_str = " ".join(headers).lower()
    
    if "schwab" in fname_lower or "schwab" in headers_str:
        return "Schwab"
    if "fidelity" in fname_lower or "fidelity" in headers_str:
        return "Fidelity"
    if "vanguard" in fname_lower or "vanguard" in headers_str:
        return "Vanguard"
    if "td ameritrade" in fname_lower or "tdameritrade" in headers_str:
        return "TD Ameritrade"
    if "interactive brokers" in fname_lower or "ibkr" in headers_str:
        return "Interactive Brokers"
    return "Unknown"

def _guess_confidence(headers: List[str]) -> float:
    headers_lower = [h.lower() for h in headers]
    score = 0
    if any("symbol" in h or "ticker" in h for h in headers_lower):
        score += 25
    if any("quantity" in h or "shares" in h for h in headers_lower):
        score += 25
    if any("price" in h for h in headers_lower):
        score += 25
    if any("value" in h or "amount" in h for h in headers_lower):
        score += 25
    return min(99, max(10, score))

# ---------- normalization ----------
def _normalize_positions(headers: List[str], rows: List[List[str]]) -> List[Dict[str, Any]]:
    """
    Maps headers to standard fields and extracts positions.
    """
    # map headers to indices
    header_map = {}
    headers_lower = [h.lower() for h in headers]
    
    for i, h in enumerate(headers_lower):
        if "symbol" in h or "ticker" in h:
            header_map["symbol"] = i
        elif "name" in h or "description" in h:
            header_map["name"] = i
        elif "quantity" in h or "shares" in h:
            header_map["quantity"] = i
        elif "price" in h:
            header_map["price"] = i
        elif "value" in h or "amount" in h:
            if "market" in h:
                header_map["market_value"] = i
            elif header_map.get("market_value") is None:
                header_map["market_value"] = i
    
    positions = []
    for row in rows:
        if not row:
            continue
        
        # extract fields
        def safe_get(key: str) -> Any:
            idx = header_map.get(key)
            if idx is None or idx >= len(row):
                return None
            return row[idx]
        
        symbol = safe_get("symbol")
        if not symbol or not str(symbol).strip():
            continue
        
        pos = {
            "symbol": str(symbol).strip().upper(),
            "name": safe_get("name") or str(symbol).strip().upper(),
            "quantity": safe_get("quantity"),
            "price": safe_get("price"),
            "market_value": safe_get("market_value"),
        }
        positions.append(pos)
    
    return positions

# ---------- file reader ----------
def _read_file_any(uf: UploadFile) -> Tuple[str, List[str], List[List[str]], str]:
    """
    Reads UploadFile and returns (filename, headers, rows, note).
    Handles CSV, TSV, and Excel (if pandas available).
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
    mapping: Optional[str] = Form(None)
):
    """
    Integration-safe: delegates to normalize-based handler.
    - Keeps existing route & response shape
    - Adds per-file preview metadata for MappingModal
    """
    return await handle_universal_upload(files=files, mapping_json=mapping)