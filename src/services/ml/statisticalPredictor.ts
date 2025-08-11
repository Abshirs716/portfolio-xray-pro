export interface PricePrediction {
  day: number;
  prediction: number;
  lower: number;
  upper: number;
  confidence: number;
}

export interface SignalPrediction {
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  priceTarget: number;
  stopLoss: number;
  signals: {
    bullish: number;
    bearish: number;
    details: {
      movingAverage: string;
      rsi: string;
      macd: string;
    };
  };
}

export class StatisticalPredictor {
  // Monte Carlo simulation for price predictions
  monteCarloSimulation(
    currentPrice: number,
    volatility: number,
    drift: number,
    days: number,
    simulations: number = 1000
  ): PricePrediction[] {
    const predictions: PricePrediction[] = [];
    const dt = 1 / 252; // Daily time step
    
    for (let d = 1; d <= days; d++) {
      const prices: number[] = [];
      
      for (let s = 0; s < simulations; s++) {
        let price = currentPrice;
        for (let t = 0; t < d; t++) {
          const randomShock = this.generateRandomNormal();
          price = price * Math.exp(
            (drift - 0.5 * volatility * volatility) * dt +
            volatility * Math.sqrt(dt) * randomShock
          );
        }
        prices.push(price);
      }
      
      prices.sort((a, b) => a - b);
      
      predictions.push({
        day: d,
        prediction: this.median(prices),
        lower: prices[Math.floor(prices.length * 0.05)], // 5th percentile
        upper: prices[Math.floor(prices.length * 0.95)], // 95th percentile
        confidence: Math.max(50, 95 - d * 2) // Decrease confidence over time
      });
    }
    
    return predictions;
  }
  
  // ARIMA-like time series prediction
  timeSeriesForecast(prices: number[], days: number): PricePrediction[] {
    // Calculate trend
    const trend = this.calculateTrend(prices);
    const seasonality = this.calculateSeasonality(prices);
    const volatility = this.calculateVolatility(prices);
    
    const predictions: PricePrediction[] = [];
    const lastPrice = prices[prices.length - 1];
    
    for (let d = 1; d <= days; d++) {
      const trendComponent = trend * d;
      const seasonalComponent = seasonality[d % seasonality.length];
      const prediction = lastPrice * (1 + trendComponent + seasonalComponent);
      
      predictions.push({
        day: d,
        prediction,
        lower: prediction * (1 - volatility * Math.sqrt(d)),
        upper: prediction * (1 + volatility * Math.sqrt(d)),
        confidence: Math.max(60, 90 - d * 3)
      });
    }
    
    return predictions;
  }
  
  // Technical analysis-based predictions
  technicalPrediction(
    prices: number[],
    sma20: number[],
    sma50: number[],
    rsi: number[],
    macd: { value: number; signal: number }[]
  ): SignalPrediction {
    const lastPrice = prices[prices.length - 1];
    const lastSMA20 = sma20[sma20.length - 1];
    const lastSMA50 = sma50[sma50.length - 1];
    const lastRSI = rsi[rsi.length - 1];
    const lastMACD = macd[macd.length - 1];
    
    let bullishSignals = 0;
    let bearishSignals = 0;
    
    // Golden/Death Cross
    if (lastSMA20 > lastSMA50) bullishSignals++;
    else bearishSignals++;
    
    // RSI signals
    if (lastRSI < 30) bullishSignals += 2; // Oversold
    else if (lastRSI > 70) bearishSignals += 2; // Overbought
    
    // MACD signals
    if (lastMACD.value > lastMACD.signal) bullishSignals++;
    else bearishSignals++;
    
    // Price above/below moving averages
    if (lastPrice > lastSMA20) bullishSignals++;
    else bearishSignals++;
    
    const totalSignals = bullishSignals + bearishSignals;
    const bullishProbability = bullishSignals / totalSignals;
    
    // Calculate price targets
    const avgTrueRange = this.calculateATR(prices);
    const expectedMove = avgTrueRange * 2; // 2 ATR move
    
    return {
      direction: bullishProbability > 0.5 ? 'BULLISH' : 'BEARISH',
      confidence: Math.abs(bullishProbability - 0.5) * 200, // Convert to percentage
      priceTarget: bullishProbability > 0.5 
        ? lastPrice + expectedMove 
        : lastPrice - expectedMove,
      stopLoss: bullishProbability > 0.5
        ? lastPrice - avgTrueRange
        : lastPrice + avgTrueRange,
      signals: {
        bullish: bullishSignals,
        bearish: bearishSignals,
        details: {
          movingAverage: lastSMA20 > lastSMA50 ? 'Golden Cross' : 'Death Cross',
          rsi: lastRSI < 30 ? 'Oversold' : lastRSI > 70 ? 'Overbought' : 'Neutral',
          macd: lastMACD.value > lastMACD.signal ? 'Bullish' : 'Bearish'
        }
      }
    };
  }
  
  private generateRandomNormal(): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  
  private median(arr: number[]): number {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  }
  
  private calculateTrend(prices: number[]): number {
    // Simple linear regression
    const n = prices.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = prices;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / prices[prices.length - 1]; // Normalize by last price
  }
  
  private calculateSeasonality(prices: number[], period: number = 20): number[] {
    // Simple seasonal decomposition
    const seasonal: number[] = [];
    for (let i = 0; i < period; i++) {
      let sum = 0;
      let count = 0;
      for (let j = i; j < prices.length; j += period) {
        if (j > 0) {
          sum += (prices[j] - prices[j - 1]) / prices[j - 1];
          count++;
        }
      }
      seasonal.push(count > 0 ? sum / count : 0);
    }
    return seasonal;
  }
  
  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((p, i) => 
      Math.log(p / prices[i])
    );
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => 
      sum + Math.pow(r - mean, 2), 0
    ) / returns.length;
    return Math.sqrt(variance * 252); // Annualized
  }
  
  private calculateATR(prices: number[], period: number = 14): number {
    // Simplified ATR calculation
    const ranges: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      const range = Math.abs(prices[i] - prices[i - 1]);
      ranges.push(range);
    }
    const recentRanges = ranges.slice(-period);
    return recentRanges.reduce((a, b) => a + b, 0) / recentRanges.length;
  }
}

export const statisticalPredictor = new StatisticalPredictor();