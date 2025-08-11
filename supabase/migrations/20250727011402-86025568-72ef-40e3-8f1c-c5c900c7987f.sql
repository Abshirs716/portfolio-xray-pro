-- Create stock_prices table for real-time prices
CREATE TABLE IF NOT EXISTS stock_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  open DECIMAL(10, 2),
  high DECIMAL(10, 2),
  low DECIMAL(10, 2),
  volume BIGINT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_stock_prices_symbol_timestamp ON stock_prices(symbol, timestamp DESC);

-- Enable RLS for stock_prices
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;

-- Create policy for stock_prices (readable by all authenticated users, writable by none for now)
CREATE POLICY "Stock prices are readable by authenticated users" 
ON stock_prices 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Add holdings table to track user's actual stock positions
CREATE TABLE IF NOT EXISTS holdings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  shares DECIMAL(15, 6) NOT NULL,
  avg_cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster holdings queries
CREATE INDEX idx_holdings_user_portfolio ON holdings(user_id, portfolio_id);
CREATE INDEX idx_holdings_symbol ON holdings(symbol);

-- Enable RLS for holdings
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

-- Create policies for holdings
CREATE POLICY "Users can manage their own holdings" 
ON holdings 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_holdings_updated_at
BEFORE UPDATE ON holdings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();