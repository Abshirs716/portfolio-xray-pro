-- Create a trigger to automatically populate portfolio history
CREATE OR REPLACE FUNCTION public.auto_update_portfolio_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update today's portfolio history when portfolio total_value changes
  INSERT INTO public.portfolio_history (
    portfolio_id, 
    date, 
    total_value, 
    daily_change, 
    daily_change_percent
  ) 
  VALUES (
    NEW.id, 
    CURRENT_DATE, 
    NEW.total_value,
    COALESCE(NEW.total_value - OLD.total_value, 0),
    CASE 
      WHEN OLD.total_value > 0 THEN 
        ((NEW.total_value - OLD.total_value) / OLD.total_value) * 100
      ELSE 0 
    END
  )
  ON CONFLICT (portfolio_id, date) 
  DO UPDATE SET 
    total_value = EXCLUDED.total_value,
    daily_change = EXCLUDED.daily_change,
    daily_change_percent = EXCLUDED.daily_change_percent,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on portfolios table
DROP TRIGGER IF EXISTS trigger_portfolio_history_update ON public.portfolios;
CREATE TRIGGER trigger_portfolio_history_update
  AFTER UPDATE OF total_value ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_portfolio_history();

-- Ensure portfolio_history table has unique constraint
ALTER TABLE public.portfolio_history 
DROP CONSTRAINT IF EXISTS portfolio_history_portfolio_id_date_key;

ALTER TABLE public.portfolio_history 
ADD CONSTRAINT portfolio_history_portfolio_id_date_key 
UNIQUE (portfolio_id, date);