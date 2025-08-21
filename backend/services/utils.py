import pandas as pd

# Standard column names we will use internally
STANDARD_COLUMNS = {
    "symbol": "Symbol",
    "name": "Name",
    "quantity": "Quantity",
    "price": "Price",
    "market_value": "MarketValue",
    "sector": "Sector"
}

# Common custodian column mappings
CUSTODIAN_MAPPINGS = {
    "interactive_brokers": {
        "Symbol": "symbol",
        "Description": "name",
        "Quantity": "quantity",
        "Price": "price",
        "Market Value": "market_value",
        "Asset Class": "sector"
    },
    "fidelity": {
        "Ticker": "symbol",
        "Security Name": "name",
        "Shares": "quantity",
        "Last Price": "price",
        "Current Value": "market_value",
        "Sector": "sector"
    },
    "schwab": {
        "Symbol": "symbol",
        "Security Description": "name",
        "Quantity": "quantity",
        "Price": "price",
        "Market Value": "market_value",
        "Sector": "sector"
    }
}

def detect_custodian(df: pd.DataFrame) -> str:
    """Detects custodian format based on headers"""
    headers = set(df.columns)
    if "Market Value" in headers and "Description" in headers:
        return "interactive_brokers"
    elif "Security Name" in headers and "Ticker" in headers:
        return "fidelity"
    elif "Security Description" in headers and "Symbol" in headers:
        return "schwab"
    else:
        return "custom"

def normalize_custodian_csv(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize any custodian CSV into standard format"""
    custodian = detect_custodian(df)
    
    if custodian in CUSTODIAN_MAPPINGS:
        mapping = CUSTODIAN_MAPPINGS[custodian]
        df = df.rename(columns=mapping)
    else:
        # Fallback: try to align to standard names
        df = df.rename(columns=lambda x: x.strip().lower())
    
    # Ensure all standard columns exist
    for key in STANDARD_COLUMNS.keys():
        if key not in df.columns:
            df[key] = None
    
    # Keep only the standard columns
    df = df[list(STANDARD_COLUMNS.keys())]
    
    return df
