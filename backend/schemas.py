from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date as _date

# Clients / Accounts
class ClientCreate(BaseModel):
    firm_id: int
    name: str
    external_id: Optional[str] = None

class ClientOut(BaseModel):
    id: int
    firm_id: int
    name: str
    external_id: Optional[str] = None
    class Config: 
        from_attributes = True

class AccountCreate(BaseModel):
    client_id: int
    name: str
    custodian: Optional[str] = None
    number: Optional[str] = None
    currency: Optional[str] = "USD"

class AccountOut(BaseModel):
    id: int
    client_id: int
    name: str
    custodian: Optional[str] = None
    number: Optional[str] = None
    currency: Optional[str] = "USD"
    class Config: 
        from_attributes = True

# ---- Batches ----
class BatchCreate(BaseModel):
    firm_id: int
    client_id: int
    as_of_date: _date
    created_by: int | None = None

class BatchFileInfo(BaseModel):
    file_id: int
    kind: str
    rows: int

class BatchIngestResult(BaseModel):
    batch_id: int
    files: List[BatchFileInfo]
    positions: int
    prices: int
    balances: int

class BatchOut(BaseModel):
    id: int
    firm_id: int
    client_id: int
    as_of_date: _date
    status: str
    notes: str | None = None
    class Config: 
        from_attributes = True