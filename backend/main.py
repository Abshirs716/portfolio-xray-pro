from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import uvicorn
import io
from services.utils import normalize_custodian_csv
from services.analytics import analyze_portfolio
from routes.universal_ingest import router as universal_ingest_router

app = FastAPI(
    title="CapX100 Backend",
    description="Minimal Portfolio Intelligence Backend",
    version="0.1.0"
)

# CORS configuration - FIXED to include port 5175
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"http://localhost:\d{4}$",  # Allow any localhost:PORT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the universal ingest router
app.include_router(universal_ingest_router, prefix="/v3")

@app.get("/")
def root():
    return {"status": "CapX100 backend running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    portfolios = []
    for file in files:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        normalized = normalize_custodian_csv(df)
        portfolios.append(normalized)
    
    portfolio_data = pd.concat(portfolios, ignore_index=True) if portfolios else pd.DataFrame()
    performance = analyze_portfolio(portfolio_data)
    
    return {
        "message": "Files uploaded successfully",
        "rows": len(portfolio_data),
        "columns": list(portfolio_data.columns) if not portfolio_data.empty else [],
        "performance": performance
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)