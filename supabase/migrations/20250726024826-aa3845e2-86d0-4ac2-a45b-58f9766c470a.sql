-- Fix historical data to create proper growth trends
-- Delete existing generated data and create better realistic data
DELETE FROM public.portfolio_history 
WHERE portfolio_id = '32b0d2a7-1891-47ef-aea8-efe58836ea91' 
  AND date < '2025-06-25';

-- Generate better historical data with consistent growth
DO $$
DECLARE
  portfolio_record RECORD;
  current_date_var DATE := CURRENT_DATE;
  start_date DATE := CURRENT_DATE - INTERVAL '365 days';
  date_iter DATE;
  base_value DECIMAL(15,2);
  current_value DECIMAL(15,2);
  previous_value DECIMAL(15,2);
  daily_change_val DECIMAL(15,2);
  daily_change_pct DECIMAL(8,4);
  day_progress DECIMAL(8,4);
  total_days INTEGER;
  days_elapsed INTEGER;
  growth_rate DECIMAL(8,4);
  volatility DECIMAL(8,4);
  trend_factor DECIMAL(8,4);
BEGIN
  -- Get portfolio info
  FOR portfolio_record IN 
    SELECT id, total_value FROM public.portfolios 
    WHERE total_value > 0
  LOOP
    -- Create a consistent upward growth pattern
    -- Start much lower to show realistic 25% annual growth
    base_value := portfolio_record.total_value * 0.80; -- Start 20% lower
    total_days := (current_date_var - start_date);
    
    -- Annual growth rate to reach current value
    growth_rate := 0.25 / 365; -- 25% annual = ~0.067% daily compound
    
    date_iter := start_date;
    current_value := base_value;
    
    WHILE date_iter <= current_date_var LOOP
      -- Skip if we already have data for this date
      IF NOT EXISTS (
        SELECT 1 FROM public.portfolio_history 
        WHERE portfolio_id = portfolio_record.id AND date = date_iter
      ) THEN
        
        days_elapsed := (date_iter - start_date);
        
        -- Compound growth with volatility
        current_value := base_value * power(1 + growth_rate, days_elapsed);
        
        -- Add realistic daily volatility (±1.2%)
        volatility := (random() - 0.5) * 0.024; -- ±1.2% daily
        current_value := current_value * (1 + volatility);
        
        -- Add slight weekly cycles
        trend_factor := sin(days_elapsed * 2 * 3.14159 / 7) * 0.003;
        current_value := current_value * (1 + trend_factor);
        
        -- Ensure we end up close to actual current value
        IF date_iter = current_date_var THEN
          current_value := portfolio_record.total_value;
        END IF;
        
        -- Calculate daily change
        IF date_iter = start_date THEN
          previous_value := current_value;
          daily_change_val := 0;
          daily_change_pct := 0;
        ELSE
          daily_change_val := current_value - previous_value;
          daily_change_pct := CASE 
            WHEN previous_value > 0 THEN (daily_change_val / previous_value) * 100
            ELSE 0 
          END;
        END IF;
        
        -- Insert the record
        INSERT INTO public.portfolio_history (
          portfolio_id,
          date,
          total_value,
          daily_change,
          daily_change_percent,
          created_at,
          updated_at
        ) VALUES (
          portfolio_record.id,
          date_iter,
          ROUND(current_value, 2),
          ROUND(daily_change_val, 2),
          ROUND(daily_change_pct, 4),
          now(),
          now()
        );
        
        previous_value := current_value;
      END IF;
      
      date_iter := date_iter + INTERVAL '1 day';
    END LOOP;
    
    RAISE NOTICE 'Fixed historical data for portfolio: %', portfolio_record.id;
  END LOOP;
END $$;