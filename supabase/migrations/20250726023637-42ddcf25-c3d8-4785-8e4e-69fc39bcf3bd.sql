-- Generate realistic historical portfolio data for the past year
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
  volatility DECIMAL(8,4);
  trend_factor DECIMAL(8,4);
  random_factor DECIMAL(8,4);
  day_progress DECIMAL(8,4);
  total_days INTEGER;
  days_elapsed INTEGER;
BEGIN
  -- Loop through all portfolios that have current data
  FOR portfolio_record IN 
    SELECT id, total_value FROM public.portfolios 
    WHERE total_value > 0
  LOOP
    -- Set base value (start lower for realistic growth)
    base_value := portfolio_record.total_value * 0.75; -- Start 25% lower for 1Y growth
    current_value := base_value;
    previous_value := base_value;
    
    -- Calculate total days for progress calculation
    total_days := (current_date_var - start_date);
    
    -- Generate data for each day in the past year
    date_iter := start_date;
    WHILE date_iter <= current_date_var LOOP
      -- Skip if we already have data for this date
      IF NOT EXISTS (
        SELECT 1 FROM public.portfolio_history 
        WHERE portfolio_id = portfolio_record.id AND date = date_iter
      ) THEN
        
        -- Calculate progress through the year (0 to 1)
        days_elapsed := (date_iter - start_date);
        day_progress := days_elapsed::DECIMAL / total_days::DECIMAL;
        
        -- Base growth trend toward current value
        current_value := base_value + (portfolio_record.total_value - base_value) * day_progress;
        
        -- Add realistic market volatility (1.5% daily standard deviation)
        volatility := 0.015;
        random_factor := (random() - 0.5) * volatility;
        
        -- Add some trend patterns (quarterly cycles)
        trend_factor := sin(day_progress * 4 * 3.14159) * 0.005;
        
        -- Apply volatility and trends
        current_value := current_value * (1 + random_factor + trend_factor);
        
        -- Ensure reasonable bounds
        current_value := GREATEST(base_value * 0.7, LEAST(portfolio_record.total_value * 1.2, current_value));
        
        -- Calculate daily change
        daily_change_val := current_value - previous_value;
        daily_change_pct := CASE 
          WHEN previous_value > 0 THEN (daily_change_val / previous_value) * 100
          ELSE 0 
        END;
        
        -- Insert the historical record
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
    
    RAISE NOTICE 'Generated historical data for portfolio: %', portfolio_record.id;
  END LOOP;
END $$;