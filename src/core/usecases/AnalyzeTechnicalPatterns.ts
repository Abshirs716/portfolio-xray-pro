import { IMarketDataService } from '../services/IMarketDataService';
import { HistoricalPrice } from '../services/IMarketDataService';

export interface TechnicalSignal {
  symbol: string;
  pattern: string;
  confidence: number;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  description: string;
  timestamp: Date;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  };
  sma50: number;
  sma200: number;
  ema12: number;
  ema26: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export class AnalyzeTechnicalPatterns {
  constructor(private marketDataService: IMarketDataService) {}

  async analyzeStock(symbol: string): Promise<{
    indicators: TechnicalIndicators;
    signals: TechnicalSignal[];
  }> {
    console.log(`🔍 Analyzing technical patterns for ${symbol}`);
    
    // Get historical data for analysis
    const historicalData = await this.marketDataService.getHistoricalPrices(symbol, 200);
    
    if (historicalData.length < 50) {
      throw new Error('Insufficient data for technical analysis');
    }

    // Calculate indicators
    const indicators = this.calculateIndicators(historicalData);
    
    // Detect patterns and generate signals
    const signals = this.detectPatterns(symbol, historicalData, indicators);
    
    console.log(`✅ Technical analysis complete for ${symbol}:`, {
      rsi: indicators.rsi.toFixed(2),
      signals: signals.length
    });

    return { indicators, signals };
  }

  private calculateIndicators(data: HistoricalPrice[]): TechnicalIndicators {
    const closes = data.map(d => d.close);
    
    // Calculate RSI
    const rsi = this.calculateRSI(closes, 14);
    
    // Calculate Moving Averages
    const sma50 = this.calculateSMA(closes, 50);
    const sma200 = this.calculateSMA(closes, 200);
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    
    // Calculate MACD
    const macd = this.calculateMACD(closes);
    
    // Calculate Bollinger Bands
    const bollingerBands = this.calculateBollingerBands(closes, 20);
    
    return {
      rsi,
      macd,
      sma50,
      sma200,
      ema12,
      ema26,
      bollingerBands
    };
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI using smoothed averages
    for (let i = period + 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        avgGain = (avgGain * (period - 1) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      }
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    
    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(0, period), period);
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
  }

  private calculateMACD(prices: number[]): { value: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    
    // Calculate signal line (9-period EMA of MACD)
    const macdHistory = [];
    for (let i = 26; i < prices.length; i++) {
      const ema12Val = this.calculateEMA(prices.slice(0, i + 1), 12);
      const ema26Val = this.calculateEMA(prices.slice(0, i + 1), 26);
      macdHistory.push(ema12Val - ema26Val);
    }
    
    const signalLine = this.calculateEMA(macdHistory, 9);
    const histogram = macdLine - signalLine;
    
    return {
      value: macdLine,
      signal: signalLine,
      histogram
    };
  }

  private calculateBollingerBands(prices: number[], period: number = 20): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const sma = this.calculateSMA(prices, period);
    const relevantPrices = prices.slice(-period);
    
    // Calculate standard deviation
    const squaredDiffs = relevantPrices.map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const stdDev = Math.sqrt(variance);
    
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  }

  private detectPatterns(
    symbol: string,
    data: HistoricalPrice[],
    indicators: TechnicalIndicators
  ): TechnicalSignal[] {
    const signals: TechnicalSignal[] = [];
    const currentPrice = data[data.length - 1].close;

    // Golden Cross / Death Cross Detection
    if (indicators.sma50 > indicators.sma200 * 0.99 && indicators.sma50 < indicators.sma200 * 1.01) {
      const isGoldenCross = indicators.sma50 > indicators.sma200;
      const divergence = Math.abs(indicators.sma50 - indicators.sma200) / indicators.sma200;
      const confidence = Math.round(75 + (divergence * 1000) + Math.random() * 10);
      
      signals.push({
        symbol,
        pattern: isGoldenCross ? 'Golden Cross' : 'Death Cross',
        confidence: Math.min(confidence, 95),
        signal: isGoldenCross ? 'BULLISH' : 'BEARISH',
        entryPrice: currentPrice,
        targetPrice: currentPrice * (isGoldenCross ? 1.12 : 0.88),
        stopLoss: currentPrice * (isGoldenCross ? 0.95 : 1.05),
        description: `SMA50 ${isGoldenCross ? 'crossed above' : 'crossed below'} SMA200`,
        timestamp: new Date()
      });
    }

    // RSI Overbought/Oversold
    if (indicators.rsi > 70) {
      // Higher RSI = higher confidence for bearish signal
      const confidence = Math.round(60 + ((indicators.rsi - 70) * 1.5) + Math.random() * 8);
      signals.push({
        symbol,
        pattern: 'RSI Overbought',
        confidence: Math.min(confidence, 94),
        signal: 'BEARISH',
        entryPrice: currentPrice,
        targetPrice: currentPrice * 0.95,
        stopLoss: currentPrice * 1.03,
        description: `RSI at ${indicators.rsi.toFixed(2)} - Overbought conditions`,
        timestamp: new Date()
      });
    } else if (indicators.rsi < 30) {
      // Lower RSI = higher confidence for bullish signal
      const confidence = Math.round(60 + ((30 - indicators.rsi) * 1.5) + Math.random() * 8);
      signals.push({
        symbol,
        pattern: 'RSI Oversold',
        confidence: Math.min(confidence, 94),
        signal: 'BULLISH',
        entryPrice: currentPrice,
        targetPrice: currentPrice * 1.05,
        stopLoss: currentPrice * 0.97,
        description: `RSI at ${indicators.rsi.toFixed(2)} - Oversold conditions`,
        timestamp: new Date()
      });
    }

    // MACD Crossover
    if (Math.abs(indicators.macd.histogram) < 0.5) {
      const isBullish = indicators.macd.value > indicators.macd.signal;
      const histogramStrength = Math.abs(indicators.macd.histogram);
      const confidence = Math.round(65 + (histogramStrength * 20) + Math.random() * 12);
      
      signals.push({
        symbol,
        pattern: `MACD ${isBullish ? 'Bullish' : 'Bearish'} Crossover`,
        confidence: Math.min(confidence, 93),
        signal: isBullish ? 'BULLISH' : 'BEARISH',
        entryPrice: currentPrice,
        targetPrice: currentPrice * (isBullish ? 1.08 : 0.92),
        stopLoss: currentPrice * (isBullish ? 0.96 : 1.04),
        description: `MACD ${isBullish ? 'crossed above' : 'crossed below'} signal line`,
        timestamp: new Date()
      });
    }

    // Bollinger Band Squeeze/Breakout
    const bbWidth = indicators.bollingerBands.upper - indicators.bollingerBands.lower;
    const bbMiddle = indicators.bollingerBands.middle;
    const bbSqueezeThreshold = bbMiddle * 0.04; // 4% of middle band

    if (bbWidth < bbSqueezeThreshold) {
      const squeezeIntensity = (bbSqueezeThreshold - bbWidth) / bbSqueezeThreshold;
      const confidence = Math.round(55 + (squeezeIntensity * 25) + Math.random() * 15);
      
      signals.push({
        symbol,
        pattern: 'Bollinger Band Squeeze',
        confidence: Math.min(confidence, 92),
        signal: 'NEUTRAL',
        description: 'Volatility contraction - potential breakout pending',
        timestamp: new Date()
      });
    }

    // Price at Bollinger Bands
    if (currentPrice > indicators.bollingerBands.upper) {
      const extension = (currentPrice - indicators.bollingerBands.upper) / indicators.bollingerBands.upper;
      const confidence = Math.round(68 + (extension * 100) + Math.random() * 10);
      
      signals.push({
        symbol,
        pattern: 'Price Above Upper Bollinger Band',
        confidence: Math.min(confidence, 93),
        signal: 'BEARISH',
        entryPrice: currentPrice,
        targetPrice: indicators.bollingerBands.middle,
        stopLoss: currentPrice * 1.02,
        description: 'Price extended above upper band - potential pullback',
        timestamp: new Date()
      });
    } else if (currentPrice < indicators.bollingerBands.lower) {
      const extension = (indicators.bollingerBands.lower - currentPrice) / indicators.bollingerBands.lower;
      const confidence = Math.round(68 + (extension * 100) + Math.random() * 10);
      
      signals.push({
        symbol,
        pattern: 'Price Below Lower Bollinger Band',
        confidence: Math.min(confidence, 93),
        signal: 'BULLISH',
        entryPrice: currentPrice,
        targetPrice: indicators.bollingerBands.middle,
        stopLoss: currentPrice * 0.98,
        description: 'Price extended below lower band - potential bounce',
        timestamp: new Date()
      });
    }

    // Head and Shoulders Pattern Detection (simplified)
    if (data.length >= 50) {
      const recentData = data.slice(-50);
      const headAndShoulders = this.detectHeadAndShoulders(recentData);
      if (headAndShoulders) {
        signals.push(headAndShoulders);
      }
    }

    return signals;
  }

  private detectHeadAndShoulders(data: HistoricalPrice[]): TechnicalSignal | null {
    // Simplified head and shoulders detection
    const highs = data.map(d => d.high);
    const currentPrice = data[data.length - 1].close;
    
    // Find peaks
    const peaks: { index: number; value: number }[] = [];
    for (let i = 2; i < highs.length - 2; i++) {
      if (highs[i] > highs[i-1] && highs[i] > highs[i-2] && 
          highs[i] > highs[i+1] && highs[i] > highs[i+2]) {
        peaks.push({ index: i, value: highs[i] });
      }
    }

    // Check for head and shoulders pattern (3 peaks with middle highest)
    if (peaks.length >= 3) {
      const lastThreePeaks = peaks.slice(-3);
      const [leftShoulder, head, rightShoulder] = lastThreePeaks;
      
      if (head.value > leftShoulder.value * 1.02 && 
          head.value > rightShoulder.value * 1.02 &&
          Math.abs(leftShoulder.value - rightShoulder.value) / leftShoulder.value < 0.03) {
        
        // Find neckline (lowest point between shoulders)
        const necklineStart = Math.min(leftShoulder.index, head.index);
        const necklineEnd = Math.max(head.index, rightShoulder.index);
        const neckline = Math.min(...data.slice(necklineStart, necklineEnd + 1).map(d => d.low));
        
        // Calculate dynamic confidence based on pattern quality
        const headHeight = head.value - neckline;
        const shoulderBalance = Math.abs(leftShoulder.value - rightShoulder.value) / leftShoulder.value;
        const patternStrength = headHeight / head.value;
        const confidence = Math.round(75 + (patternStrength * 30) + ((1 - shoulderBalance) * 15) + Math.random() * 8);
        
        return {
          symbol: data[0].symbol,
          pattern: 'Head and Shoulders',
          confidence: Math.min(confidence, 94),
          signal: 'BEARISH',
          entryPrice: currentPrice,
          targetPrice: neckline - (head.value - neckline),
          stopLoss: rightShoulder.value,
          description: 'Classic reversal pattern detected',
          timestamp: new Date()
        };
      }
    }

    return null;
  }
}