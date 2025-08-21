import pandas as pd

def analyze_portfolio(df: pd.DataFrame) -> dict:
    """
    Perform minimal portfolio analysis on a normalized DataFrame.
    Expected columns: ['symbol', 'name', 'quantity', 'price', 'market_value', 'sector']
    """
    # Drop rows without a symbol
    df = df.dropna(subset=["symbol"])
    
    # Ensure numeric values
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0)
    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)
    df["market_value"] = pd.to_numeric(df["market_value"], errors="coerce").fillna(
        df["quantity"] * df["price"]
    )
    
    # Basic portfolio metrics
    total_value = float(df["market_value"].sum())  # Convert to Python float
    holdings_count = int(df["symbol"].nunique())   # Convert to Python int
    
    # Sector allocation (if sector info available)
    if "sector" in df.columns:
        sector_allocation = {
            str(k): float(v) for k, v in 
            df.groupby("sector")["market_value"].sum().to_dict().items()
        }
    else:
        sector_allocation = {}
    
    # Prepare response - convert all numpy types to Python types
    top_holdings = df.sort_values("market_value", ascending=False)[["symbol", "name", "market_value"]].head(5)
    top_holdings_list = []
    for _, row in top_holdings.iterrows():
        top_holdings_list.append({
            "symbol": str(row["symbol"]),
            "name": str(row["name"]),
            "market_value": float(row["market_value"])
        })
    
    results = {
        "total_value": round(total_value, 2),
        "holdings": holdings_count,
        "sector_allocation": sector_allocation,
        "top_holdings": top_holdings_list
    }
    
    return results