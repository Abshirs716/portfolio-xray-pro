# backend/routes/universal_ingest_patch.py
from __future__ import annotations
from fastapi import UploadFile, File, Form, HTTPException
from typing import List, Optional, Dict, Any
import json

from services.normalize import build_parse_result

# ---- Public function your existing endpoint can call safely ----
# This keeps the change tiny: your /v3/universal/upload just imports and calls this.

async def handle_universal_upload(
    files: List[UploadFile],
    mapping_json: Optional[str] = None
) -> Dict[str, Any]:
    """
    Integration-safe helper for /v3/universal/upload.
    - Reads incoming files (in memory)
    - Applies optional per-file column mapping
    - Produces a stable ParseResult plus per-file preview metadata
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files received")

    # Optional mapping: {"filename.csv": {"symbol":"Ticker", "shares":"Qty", ...}, ...}
    explicit_mapping: Dict[str, Dict[str, str]] = {}
    if mapping_json:
        try:
            raw = json.loads(mapping_json)
            if isinstance(raw, dict):
                # Normalize keys to strings
                for fname, mp in raw.items():
                    if isinstance(mp, dict):
                        explicit_mapping[str(fname)] = {str(k): str(v) for k, v in mp.items()}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid mapping JSON: {e}")

    # Read files into memory (keep names intact for mapping lookup)
    pairs: List[tuple[str, bytes]] = []
    for f in files:
        name = f.filename or "upload.csv"
        content = await f.read()
        pairs.append((name, content))

    # Use the new normalizer (File 1)
    result = build_parse_result(pairs, explicit_mapping=explicit_mapping or None)

    # Ensure strict ParseResult compatibility your UI expects
    # holdings: list of { symbol, shares, price, market_value, weight, ... }
    # totals:   { total_value, positions_count }
    # metadata: { custodianDetected, confidence, files:[{filename, headers, sample_rows, type, confidence, require_mapping, custodian}], ... }

    # Guard: never return NaN/None in numerics (frontend hates that)
    try:
        totals = result.get("totals", {})
        if totals.get("total_value") is None:
            totals["total_value"] = 0.0
        if totals.get("positions_count") is None:
            totals["positions_count"] = len(result.get("holdings", []))
        result["totals"] = totals

        for h in result.get("holdings", []):
            h["shares"] = float(h.get("shares") or 0.0)
            h["price"] = float(h.get("price") or 0.0)
            h["market_value"] = float(h.get("market_value") or 0.0)
            h["weight"] = float(h.get("weight") or 0.0)
    except Exception:
        # If anything odd slips through, fall back to empty safely
        result = {
            "holdings": [],
            "totals": {"total_value": 0.0, "positions_count": 0},
            "metadata": {
                "custodianDetected": "Unknown",
                "confidence": 10,
                "files": [],
                "transparency_score": 0.0,
                "batch_mode": True
            }
        }

    return result