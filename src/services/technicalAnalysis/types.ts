export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number; // 0-100
  timestamp: Date;
}

export interface PricePrediction {
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  timeframe: '1D' | '1W' | '1M' | '3M';
  confidence: number;
  direction: 'UP' | 'DOWN' | 'SIDEWAYS';
  percentageChange: number;
  generatedAt: Date;
}

export interface CrossoverSignal {
  type: 'GOLDEN_CROSS' | 'DEATH_CROSS';
  shortMA: number;
  longMA: number;
  occurred: boolean;
  date: Date;
  predictedImpact: {
    direction: 'BULLISH' | 'BEARISH';
    magnitude: number; // Expected % change
    confidence: number;
  };
}

// TEST: Verify types work
export const testTypes = () => {
  console.log('🧪 Testing TypeScript interfaces...');
  
  const testPrediction: PricePrediction = {
    symbol: 'AAPL',
    targetPrice: 200,
    currentPrice: 185,
    timeframe: '1M',
    confidence: 78,
    direction: 'UP',
    percentageChange: 8.1,
    generatedAt: new Date()
  };
  
  const testIndicator: TechnicalIndicator = {
    name: 'RSI',
    value: 65.4,
    signal: 'BUY',
    confidence: 82,
    timestamp: new Date()
  };
  
  const testCrossover: CrossoverSignal = {
    type: 'GOLDEN_CROSS',
    shortMA: 50,
    longMA: 200,
    occurred: true,
    date: new Date(),
    predictedImpact: {
      direction: 'BULLISH',
      magnitude: 12.5,
      confidence: 85
    }
  };
  
  console.log('✅ Type Test Results:');
  console.log('  📈 Prediction:', testPrediction);
  console.log('  📊 Indicator:', testIndicator);
  console.log('  ⚡ Crossover:', testCrossover);
  
  return { testPrediction, testIndicator, testCrossover };
};