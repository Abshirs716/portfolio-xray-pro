from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import pandas as pd
import io
import json

from config import CORS_ORIGINS
from database import Base, engine, get_db
import models
import schemas
from services.utils import normalize_custodian_csv
from services.analytics import analyze_portfolio
from services.ingest import ingest_batch, header_signature

app = FastAPI(title="CapX100 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables at startup for dev
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

# ---- Upload Endpoint (Modified to Save AND Display) ----
@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    # Read all files into memory once
    file_contents = []
    for file in files:
        content = await file.read()
        file_contents.append((file.filename, content))
    
    # Save to database with full provenance tracking
    batch_result = ingest_batch(
        db,
        firm_id=1,  # Default firm for testing
        client_id=1,  # Default client for testing
        as_of=date.today(),
        created_by=None,
        files=[(f[0], f[1], None) for f in file_contents]
    )
    
    # Process first file for immediate display (existing logic)
    if file_contents:
        df = pd.read_csv(io.BytesIO(file_contents[0][1]))
        normalized_df = normalize_custodian_csv(df)
        analysis = analyze_portfolio(normalized_df)
        
        # Add batch info to the analysis
        analysis['batch_id'] = batch_result['batch_id']
        analysis['files_saved'] = len(batch_result['files'])
        analysis['positions_saved'] = batch_result['positions']
        
        return {
            "message": f"Files uploaded and saved as batch {batch_result['batch_id']}",
            "rows": len(normalized_df),
            "columns": list(normalized_df.columns),
            "performance": analysis,
            "batch_id": batch_result['batch_id'],
            "saved_to_database": True
        }
    
    return {"message": "No files uploaded", "saved_to_database": False}

# ---- Clients ----
@app.post("/clients", response_model=schemas.ClientOut)
def create_client(payload: schemas.ClientCreate, db: Session = Depends(get_db)):
    client = models.Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@app.get("/clients", response_model=List[schemas.ClientOut])
def list_clients(firm_id: int, db: Session = Depends(get_db)):
    return db.query(models.Client).filter(models.Client.firm_id == firm_id).order_by(models.Client.id.desc()).all()

# ---- Accounts ----
@app.post("/accounts", response_model=schemas.AccountOut)
def create_account(payload: schemas.AccountCreate, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter_by(id=payload.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    acct = models.Account(**payload.model_dump())
    db.add(acct)
    db.commit()
    db.refresh(acct)
    return acct

@app.get("/accounts", response_model=List[schemas.AccountOut])
def list_accounts(client_id: int, db: Session = Depends(get_db)):
    return db.query(models.Account).filter(models.Account.client_id == client_id).order_by(models.Account.id.desc()).all()

# ---- Batches: list/get ----
@app.get("/batches", response_model=List[schemas.BatchOut])
def list_batches(firm_id: int, client_id: int, db: Session = Depends(get_db)):
    q = db.query(models.Batch).filter(
        models.Batch.firm_id == firm_id,
        models.Batch.client_id == client_id
    ).order_by(models.Batch.id.desc())
    return q.all()

@app.get("/batches/{batch_id}", response_model=schemas.BatchOut)
def get_batch(batch_id: int, db: Session = Depends(get_db)):
    b = db.query(models.Batch).filter_by(id=batch_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Batch not found")
    return b

# ---- Ingest: multi-file ----
@app.post("/ingest/batch", response_model=schemas.BatchIngestResult)
async def ingest_batch_endpoint(
    firm_id: int = Form(...),
    client_id: int = Form(...),
    as_of_date: date = Form(...),
    created_by: int | None = Form(None),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    # Read all files into memory (v1). For very large files, stream chunk-by-chunk in v2.
    payload = []
    for up in files:
        content = await up.read()
        payload.append((up.filename, content, None))  # custodian_hint=None v1
    res = ingest_batch(
        db,
        firm_id=firm_id,
        client_id=client_id,
        as_of=as_of_date,
        created_by=created_by,
        files=payload,
    )
    return schemas.BatchIngestResult(**res)

# ---- Mappings Management ----
@app.get("/mappings")
def list_mappings(firm_id: int, db: Session = Depends(get_db)):
    mappings = db.query(models.Mapping).filter(
        models.Mapping.firm_id == firm_id
    ).order_by(models.Mapping.id.desc()).all()
    
    result = []
    for m in mappings:
        result.append({
            "id": m.id,
            "custodian_hint": m.custodian_hint,
            "header_signature": m.header_signature,
            "mapping": json.loads(m.json_mapping) if m.json_mapping else {},
            "created_at": m.created_at.isoformat() if m.created_at else None
        })
    return result

@app.post("/mappings/save")
def save_mapping(
    firm_id: int = Form(...),
    headers: str = Form(...),  # JSON array of headers
    mapping: str = Form(...),   # JSON object of mapping
    custodian_hint: str = Form(None),
    db: Session = Depends(get_db)
):
    headers_list = json.loads(headers)
    mapping_dict = json.loads(mapping)
    sig = header_signature(headers_list)
    
    # Check if exists
    existing = db.query(models.Mapping).filter(
        models.Mapping.firm_id == firm_id,
        models.Mapping.header_signature == sig
    ).first()
    
    if existing:
        existing.json_mapping = json.dumps(mapping_dict)
        existing.custodian_hint = custodian_hint
        db.commit()
        return {"message": "Mapping updated", "id": existing.id}
    else:
        new_mapping = models.Mapping(
            firm_id=firm_id,
            custodian_hint=custodian_hint,
            header_signature=sig,
            json_mapping=json.dumps(mapping_dict),
            version=1
        )
        db.add(new_mapping)
        db.commit()
        return {"message": "Mapping created", "id": new_mapping.id}

@app.post("/mappings/preview")
async def preview_with_mapping(
    file: UploadFile = File(...),
    mapping: str = Form(...)  # JSON mapping
):
    """Preview how a file would look with a specific mapping"""
    content = await file.read()
    mapping_dict = json.loads(mapping)
    
    # Parse CSV
    df = pd.read_csv(io.BytesIO(content))
    headers = df.columns.tolist()
    
    # Apply mapping to get sample data
    sample_rows = []
    for _, row in df.head(5).iterrows():
        mapped_row = {}
        for field, col_idx in mapping_dict.items():
            if col_idx is not None and col_idx < len(headers):
                mapped_row[field] = str(row.iloc[col_idx])
        sample_rows.append(mapped_row)
    
    return {
        "headers": headers,
        "sample_rows": sample_rows,
        "total_rows": len(df)
    }