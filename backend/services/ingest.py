# backend/services/ingest.py
from __future__ import annotations
import csv
import io
import json
import re
from datetime import date
from typing import Dict, List, Tuple, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

import models  # Changed from "from .. import models" for flat structure

# ---------- Utility parsing helpers ----------

CURRENCY_REGEX = re.compile(r"[,$]")

def clean_number(v: str) -> Optional[float]:
    if v is None:
        return None
    s = str(v).strip()
    if not s:
        return None
    # parentheses as negatives: (10) -> -10
    neg = s.startswith("(") and s.endswith(")")
    s = s.strip("()")
    # remove $ and commas
    s = CURRENCY_REGEX.sub("", s)
    try:
        n = float(s)
        return -n if neg else n
    except ValueError:
        return None

def header_signature(headers: List[str]) -> str:
    # normalized, lower-cased, spaces collapsed
    norm = [re.sub(r"\s+", " ", h.strip().lower()) for h in headers]
    return ",".join(norm)

def detect_file_kind(filename: str, headers: List[str]) -> str:
    f = filename.lower()
    if re.search(r"position|holding", f):
        return "positions"
    if re.search(r"price|prices", f):
        return "prices"
    if re.search(r"balance|balances", f):
        return "balances"

    # Heuristic by headers
    hs = {h.lower() for h in headers}
    if {"symbol", "quantity"} & hs and ("market value" in hs or "price" in hs):
        return "positions"
    if {"date", "price"} <= hs:
        return "prices"
    if {"date", "market value"} <= hs or {"date", "cash"} <= hs:
        return "balances"
    return "positions"  # default safest bet

def pick(mapping: Dict[str, int], row: List[str], key: str) -> Optional[str]:
    idx = mapping.get(key)
    if idx is None:
        return None
    if idx < 0 or idx >= len(row):
        return None
    return row[idx]

# ---------- Mapping memory ----------

def find_or_create_mapping(db: Session, firm_id: int, headers: List[str], custodian_hint: Optional[str]) -> models.Mapping:
    sig = header_signature(headers)
    m: models.Mapping | None = db.execute(
        select(models.Mapping).where(
            models.Mapping.firm_id == firm_id,
            models.Mapping.header_signature == sig
        )
    ).scalar_one_or_none()

    if m:
        return m

    # naive inferred mapping (v1). Can be edited later by a UI.
    headers_l = [h.strip().lower() for h in headers]
    index_map = {h: i for i, h in enumerate(headers_l)}

    def find_col(cands: List[str]) -> Optional[int]:
        for c in cands:
            if c in index_map:
                return index_map[c]
        return None

    inferred = {
        # positions fields
        "symbol": find_col(["symbol", "ticker", "security", "security id"]),
        "name": find_col(["name", "security name"]),
        "quantity": find_col(["quantity", "shares", "qty"]),
        "price": find_col(["price", "current price", "last price"]),
        "market_value": find_col(["market value", "marketvalue", "mv"]),
        "cost_basis": find_col(["cost basis", "cost", "avg cost", "average cost"]),
        "sector": find_col(["sector"]),
        "currency": find_col(["currency", "ccy"]),
        # prices fields
        "date": find_col(["date", "as of", "as_of", "pricedate"]),
        "close": find_col(["close", "price", "px_last"]),
        # balances fields
        "cash": find_col(["cash"]),
        "account": find_col(["account", "account number", "acct"]),
    }

    m = models.Mapping(
        firm_id=firm_id,
        custodian_hint=custodian_hint,
        header_signature=sig,
        json_mapping=json.dumps(inferred),
        version=1,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

# ---------- Core ingest ----------

class IngestResult(dict):
    # simple container for response
    pass

def ingest_batch(
    db: Session,
    *,
    firm_id: int,
    client_id: int,
    as_of: date,
    created_by: Optional[int],
    files: List[Tuple[str, bytes, Optional[str]]],  # (filename, content, custodian_hint)
) -> IngestResult:
    """
    Returns IngestResult with:
      { "batch_id": int, "files": [{id, kind, rows}], "positions": n, "prices": n, "balances": n }
    """
    # 1) create batch
    batch = models.Batch(
        firm_id=firm_id,
        client_id=client_id,
        created_by=created_by,
        as_of_date=as_of,
        status="ingested",
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    out_files = []
    positions_inserted = 0
    prices_inserted = 0
    balances_inserted = 0

    for (fname, content, custodian_hint) in files:
        # 2) persist File (storage_path is local dev placeholder)
        frow = models.File(
            firm_id=firm_id,
            storage_path=f"uploads/{fname}",
            size_bytes=len(content),
            mime="text/csv",
        )
        db.add(frow)
        db.commit()
        db.refresh(frow)

        # 3) read CSV
        text = content.decode("utf-8", errors="ignore")
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)
        if not rows:
            out_files.append({"file_id": frow.id, "kind": "unknown", "rows": 0})
            continue

        headers = [h.strip() for h in rows[0]]
        kind = detect_file_kind(fname, headers)
        mapping_row = find_or_create_mapping(db, firm_id, headers, custodian_hint)
        mapping = json.loads(mapping_row.json_mapping or "{}") if mapping_row else {}

        # 4) route based on kind
        if kind == "positions":
            cnt = _ingest_positions(db, batch.id, frow.id, headers, rows[1:], mapping, as_of)
            positions_inserted += cnt
        elif kind == "prices":
            cnt = _ingest_prices(db, batch.id, frow.id, headers, rows[1:], mapping)
            prices_inserted += cnt
        elif kind == "balances":
            cnt = _ingest_balances(db, batch.id, frow.id, headers, rows[1:], mapping)
            balances_inserted += cnt
        else:
            # default try positions
            cnt = _ingest_positions(db, batch.id, frow.id, headers, rows[1:], mapping, as_of)
            positions_inserted += cnt

        out_files.append({"file_id": frow.id, "kind": kind, "rows": max(0, len(rows) - 1)})

    db.commit()

    return IngestResult(
        batch_id=batch.id,
        files=out_files,
        positions=positions_inserted,
        prices=prices_inserted,
        balances=balances_inserted,
    )

# ---------- Specific ingestors ----------

def _ingest_positions(
    db: Session,
    batch_id: int,
    file_id: int,
    headers: List[str],
    data_rows: List[List[str]],
    mapping: Dict[str, int],
    as_of: date,
) -> int:
    count = 0
    for i, row in enumerate(data_rows, start=2):  # 1-based header means data starts at row 2
        symbol = pick(mapping, row, "symbol") or pick(mapping, row, "ticker")
        if not symbol:
            # skip hopeless row
            continue
        name = pick(mapping, row, "name")
        qty = clean_number(pick(mapping, row, "quantity") or pick(mapping, row, "shares") or "0")
        price = clean_number(pick(mapping, row, "price"))
        mv = clean_number(pick(mapping, row, "market_value"))
        if mv is None and qty is not None and price is not None:
            mv = round(qty * price, 2)
        cost = clean_number(pick(mapping, row, "cost_basis") or pick(mapping, row, "average cost"))
        currency = pick(mapping, row, "currency") or "USD"
        sector = pick(mapping, row, "sector")

        p = models.Position(
            batch_id=batch_id,
            account_id=None,  # v1: not mapping account unless provided; we'll add in v2
            symbol=symbol.strip(),
            name=name,
            quantity=qty,
            price=price,
            market_value=mv,
            cost_basis=cost,
            currency=currency,
            sector=sector,
            as_of_date=as_of,
            source_file_id=file_id,
            source_row=i,
        )
        db.add(p)
        count += 1
    return count

def _ingest_prices(
    db: Session,
    batch_id: int,
    file_id: int,
    headers: List[str],
    data_rows: List[List[str]],
    mapping: Dict[str, int],
) -> int:
    count = 0
    for i, row in enumerate(data_rows, start=2):
        symbol = pick(mapping, row, "symbol") or pick(mapping, row, "ticker")
        date_s = pick(mapping, row, "date")
        px = clean_number(pick(mapping, row, "close") or pick(mapping, row, "price"))
        if not symbol or not date_s or px is None:
            continue
        try:
            d = date.fromisoformat(date_s.strip().split(" ")[0].replace("/", "-"))
        except Exception:
            # simple US style mm/dd/yyyy support
            m = re.match(r"(\d{1,2})/(\d{1,2})/(\d{4})", date_s.strip())
            if m:
                d = date(int(m.group(3)), int(m.group(1)), int(m.group(2)))
            else:
                continue
        pr = models.Price(
            batch_id=batch_id,
            symbol=symbol.strip(),
            date=d,
            price=px,
            currency="USD",
            source_file_id=file_id,
            source_row=i,
        )
        db.add(pr)
        count += 1
    return count

def _ingest_balances(
    db: Session,
    batch_id: int,
    file_id: int,
    headers: List[str],
    data_rows: List[List[str]],
    mapping: Dict[str, int],
) -> int:
    count = 0
    for i, row in enumerate(data_rows, start=2):
        date_s = pick(mapping, row, "date")
        if not date_s:
            continue
        try:
            d = date.fromisoformat(date_s.strip().split(" ")[0].replace("/", "-"))
        except Exception:
            m = re.match(r"(\d{1,2})/(\d{1,2})/(\d{4})", date_s.strip())
            if m:
                d = date(int(m.group(3)), int(m.group(1)), int(m.group(2)))
            else:
                continue
        cash = clean_number(pick(mapping, row, "cash"))
        mv = clean_number(pick(mapping, row, "market_value"))
        bal = models.Balance(
            batch_id=batch_id,
            account_id=None,
            date=d,
            cash=cash,
            market_value=mv,
            currency="USD",
            source_file_id=file_id,
            source_row=i,
        )
        db.add(bal)
        count += 1
    return count