-- Create portfolio_history table for tracking daily portfolio values
CREATE TABLE public.portfolio_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  daily_change DECIMAL(15,2) DEFAULT 0,
  daily_change_percent DECIMAL(8,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate entries for same portfolio/date
CREATE UNIQUE INDEX idx_portfolio_history_unique ON public.portfolio_history (portfolio_id, date);

-- Create index for efficient querying
CREATE INDEX idx_portfolio_history_portfolio_date ON public.portfolio_history (portfolio_id, date DESC);

-- Enable Row Level Security
ALTER TABLE public.portfolio_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own portfolio history" 
ON public.portfolio_history 
FOR SELECT 
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own portfolio history" 
ON public.portfolio_history 
FOR INSERT 
WITH CHECK (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own portfolio history" 
ON public.portfolio_history 
FOR UPDATE 
USING (
  portfolio_id IN (
    SELECT id FROM public.portfolios WHERE user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolio_history_updated_at
BEFORE UPDATE ON public.portfolio_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically calculate and store daily portfolio values
CREATE OR REPLACE FUNCTION public.calculate_and_store_portfolio_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  portfolio_record RECORD;
  current_date DATE := CURRENT_DATE;
  previous_value DECIMAL(15,2);
  daily_change_val DECIMAL(15,2);
  daily_change_pct DECIMAL(8,4);
BEGIN
  -- Loop through all portfolios
  FOR portfolio_record IN 
    SELECT id, total_value FROM public.portfolios 
    WHERE total_value > 0
  LOOP
    -- Get previous day's value
    SELECT total_value INTO previous_value 
    FROM public.portfolio_history 
    WHERE portfolio_id = portfolio_record.id 
    AND date < current_date 
    ORDER BY date DESC 
    LIMIT 1;
    
    -- Calculate daily change
    IF previous_value IS NOT NULL THEN
      daily_change_val := portfolio_record.total_value - previous_value;
      daily_change_pct := (daily_change_val / previous_value) * 100;
    ELSE
      daily_change_val := 0;
      daily_change_pct := 0;
    END IF;
    
    -- Insert or update today's record
    INSERT INTO public.portfolio_history (
      portfolio_id, 
      date, 
      total_value, 
      daily_change, 
      daily_change_percent
    ) 
    VALUES (
      portfolio_record.id, 
      current_date, 
      portfolio_record.total_value, 
      daily_change_val, 
      daily_change_pct
    )
    ON CONFLICT (portfolio_id, date) 
    DO UPDATE SET 
      total_value = EXCLUDED.total_value,
      daily_change = EXCLUDED.daily_change,
      daily_change_percent = EXCLUDED.daily_change_percent,
      updated_at = now();
  END LOOP;
END;
$$;