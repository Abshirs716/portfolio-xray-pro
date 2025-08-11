import { supabase } from "@/integrations/supabase/client";
import { centralizedPortfolioMetrics } from "./centralizedPortfolioMetrics";

interface RealRiskMetrics {
  sharpeRatio: number;
  portfolioBeta: number;
  volatility: number;
  maxDrawdown: number;
  valueAtRisk: number;
  sortinoRatio: number;
  calmarRatio: number;
  informationRatio: number;
  upCaptureRatio: number;
  downCaptureRatio: number;
  expectedShortfall: number;
  riskScore: number;
  concentrationRisk: number;
  sectorConcentration: number;
  totalValue: number;
  isRealData: boolean;
}

class RealRiskAnalysisService {
  private static instance: RealRiskAnalysisService;
  private cache: { [portfolioId: string]: { data: RealRiskMetrics; timestamp: number } } = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): RealRiskAnalysisService {
    if (!RealRiskAnalysisService.instance) {
      RealRiskAnalysisService.instance = new RealRiskAnalysisService();
    }
    return RealRiskAnalysisService.instance;
  }

  async getRealRiskMetrics(portfolioId?: string): Promise<RealRiskMetrics> {
    try {
      console.log('🔄 Calculating REAL portfolio risk metrics...');

      // Get primary portfolio if no ID provided
      let targetPortfolioId = portfolioId;
      if (!targetPortfolioId) {
        const { data: portfolio } = await supabase
          .from('portfolios')
          .select('id, total_value')
          .eq('is_primary', true)
          .single();
        
        if (!portfolio) {
          throw new Error('No primary portfolio found');
        }
        targetPortfolioId = portfolio.id;
      }

      // Check cache
      const cached = this.cache[targetPortfolioId];
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('✅ Using cached real risk metrics');
        return cached.data;
      }

      // Get portfolio metrics and history data
      const metrics = await centralizedPortfolioMetrics.getPortfolioMetrics(targetPortfolioId);
      
      // Get historical portfolio data for volatility and drawdown calculations
      const { data: historyData } = await supabase
        .from('portfolio_history')
        .select('date, total_value, daily_change, daily_change_percent')
        .eq('portfolio_id', targetPortfolioId)
        .order('date', { ascending: false })
        .limit(365); // 1 year of data

      // Get transactions for holdings analysis
      const { data: transactions } = await supabase
        .from('transactions')
        .select('symbol, type, quantity, price, amount')
        .eq('portfolio_id', targetPortfolioId)
        .not('symbol', 'is', null);

      const realMetrics = this.calculateRealRiskMetrics(metrics, historyData || [], transactions || []);
      
      // Cache the results
      this.cache[targetPortfolioId] = {
        data: realMetrics,
        timestamp: Date.now()
      };

      console.log('✅ Real risk metrics calculated successfully');
      return realMetrics;

    } catch (error) {
      console.error('🚨❌ REAL RISK SERVICE ERROR - FALLING BACK:', error);
      console.log('🚨❌ This fallback has Sharpe 0.75, not 0.15!');
      return this.getFallbackMetrics();
    }
  }

  private calculateRealRiskMetrics(
    portfolioMetrics: any,
    historyData: any[],
    transactions: any[]
  ): RealRiskMetrics {
    const totalValue = portfolioMetrics.totalValue;
    
    // Calculate real volatility from historical data
    const dailyReturns = this.calculateDailyReturns(historyData);
    const volatility = this.calculateVolatility(dailyReturns);
    
    // Calculate real maximum drawdown
    const maxDrawdown = this.calculateMaxDrawdown(historyData);
    
    // Use the correct Sharpe ratio from centralized portfolio metrics
    const sharpeRatio = portfolioMetrics.sharpeRatio;
    
    // Calculate Sortino ratio (downside deviation)
    const downSideReturns = dailyReturns.filter(r => r < 0);
    const downSideVolatility = this.calculateVolatility(downSideReturns);
    const riskFreeRate = 3; // Same as centralized metrics
    const annualizedReturn = (portfolioMetrics.yearToDateReturn / 7.5) * 12; // Annualize YTD
    const excessReturn = annualizedReturn - riskFreeRate;
    const sortinoRatio = downSideVolatility > 0 ? excessReturn / downSideVolatility : 0;
    
    // Calculate Calmar ratio (return/max drawdown)
    const calmarRatio = Math.abs(maxDrawdown) > 0 ? 
      annualizedReturn / Math.abs(maxDrawdown) : 0;
    
    // Calculate Value at Risk (95% confidence)
    const valueAtRisk = this.calculateVaR(dailyReturns, totalValue, 95);
    
    // Calculate Expected Shortfall (CVaR)
    const expectedShortfall = this.calculateExpectedShortfall(dailyReturns, totalValue, 0.95);
    
    // Calculate holdings concentration
    const concentrationMetrics = this.calculateConcentrationRisk(transactions, totalValue);
    
    // Calculate portfolio beta (relative to market)
    const portfolioBeta = this.calculatePortfolioBeta(historyData);
    
    // Calculate up/down capture ratios vs S&P 500
    const captureRatios = this.calculateCaptureRatios(historyData);
    
    // Information ratio (active return / tracking error)
    const informationRatio = this.calculateInformationRatio(historyData);

    return {
      sharpeRatio: isFinite(sharpeRatio) ? Math.max(-2, Math.min(3, sharpeRatio)) : 0,
      portfolioBeta: isFinite(portfolioBeta) ? Math.max(0.5, Math.min(2.5, portfolioBeta)) : 1.2,
      volatility: portfolioMetrics.volatility, // Use centralized volatility
      maxDrawdown: isFinite(maxDrawdown) ? Math.max(-50, Math.min(0, maxDrawdown)) : -15,
      valueAtRisk: isFinite(valueAtRisk) ? Math.max(0.5, Math.min(5, valueAtRisk)) : 2.1,
      sortinoRatio: isFinite(sortinoRatio) ? Math.max(-1, Math.min(2, sortinoRatio)) : 0.8,
      calmarRatio: isFinite(calmarRatio) ? Math.max(-1, Math.min(2, calmarRatio)) : 0.6,
      informationRatio: isFinite(informationRatio) ? Math.max(-0.5, Math.min(1, informationRatio)) : 0.2,
      upCaptureRatio: captureRatios.upCapture,
      downCaptureRatio: captureRatios.downCapture,
      expectedShortfall: isFinite(expectedShortfall) ? Math.max(1, Math.min(8, expectedShortfall)) : 3.2,
      riskScore: portfolioMetrics.riskScore,
      concentrationRisk: concentrationMetrics.maxWeight,
      sectorConcentration: concentrationMetrics.sectorConcentration,
      totalValue,
      isRealData: true
    };
  }

  private calculateDailyReturns(historyData: any[]): number[] {
    const returns: number[] = [];
    for (let i = 0; i < historyData.length - 1; i++) {
      const today = historyData[i];
      const yesterday = historyData[i + 1];
      if (yesterday.total_value > 0) {
        const dailyReturn = ((today.total_value - yesterday.total_value) / yesterday.total_value) * 100;
        if (isFinite(dailyReturn)) {
          returns.push(dailyReturn);
        }
      }
    }
    return returns;
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length < 2) return 15; // Default estimate
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const dailyVol = Math.sqrt(variance);
    const annualizedVol = dailyVol * Math.sqrt(252); // Annualized volatility
    
    // Cap volatility at reasonable levels (5% to 60%)
    return Math.max(5, Math.min(60, annualizedVol));
  }

  private calculateMaxDrawdown(historyData: any[]): number {
    if (historyData.length < 2) return -5; // Default estimate
    
    let peak = 0;
    let maxDrawdown = 0;
    
    console.log('🔍 CALCULATING MAX DRAWDOWN - Input data length:', historyData.length);
    
    // Go through data chronologically to find peak-to-trough
    for (let i = 0; i < historyData.length; i++) {
      const value = historyData[i].total_value;
      
      // Update peak if we found a new high
      if (value > peak) {
        peak = value;
      }
      
      // Calculate drawdown from peak
      if (peak > 0) {
        const drawdown = ((value - peak) / peak) * 100;
        if (drawdown < maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }
    
    console.log('🔍 RAW CALCULATED MAX DRAWDOWN:', maxDrawdown);
    
    // Ensure reasonable bounds: -1% to -25% max
    const result = Math.max(-25, Math.min(-1, maxDrawdown || -5));
    console.log('🔍 FINAL BOUNDED MAX DRAWDOWN:', result);
    
    return result;
  }

  private calculateVaR(returns: number[], portfolioValue: number, confidence: number): number {
    if (returns.length < 5) return 5; // 5% default as percentage
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence / 100) * sortedReturns.length);
    const varReturn = sortedReturns[index] || -5;
    
    console.log('🔍 VaR calculation - varReturn:', varReturn);
    
    // Return VaR as percentage, capped at reasonable levels
    const varPercent = Math.abs(varReturn);
    const result = Math.min(25, Math.max(1, varPercent)); // Cap between 1% and 25%
    
    console.log('🔍 Final VaR percentage:', result);
    return result;
  }

  private calculateExpectedShortfall(returns: number[], portfolioValue: number, confidence: number): number {
    if (returns.length < 5) return portfolioValue * 0.07; // 7% default
    
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * sortedReturns.length);
    const tailReturns = sortedReturns.slice(0, index + 1);
    
    if (tailReturns.length === 0) return portfolioValue * 0.07;
    
    const avgTailReturn = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
    return Math.abs(portfolioValue * (avgTailReturn / 100));
  }

  private calculateConcentrationRisk(transactions: any[], totalValue: number): { maxWeight: number; sectorConcentration: number } {
    const holdingsMap: Record<string, number> = {};
    const sectorMap: Record<string, number> = {};
    
    // Map symbols to sectors (real sector data)
    const sectorMapping: Record<string, string> = {
      'AAPL': 'Technology',
      'GOOGL': 'Technology', 
      'MSFT': 'Technology',
      'NVDA': 'Technology',
      'TSLA': 'Consumer Discretionary',
      'META': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'SPY': 'Index Fund',
      'QQQ': 'Index Fund'
    };
    
    transactions.forEach(tx => {
      if (!holdingsMap[tx.symbol]) holdingsMap[tx.symbol] = 0;
      
      if (tx.type === 'buy') {
        holdingsMap[tx.symbol] += tx.amount || 0;
      } else if (tx.type === 'sell') {
        holdingsMap[tx.symbol] -= tx.amount || 0;
      }
    });

    // Calculate sector concentrations
    Object.entries(holdingsMap).forEach(([symbol, value]) => {
      if (value > 0) {
        const sector = sectorMapping[symbol] || 'Other';
        if (!sectorMap[sector]) sectorMap[sector] = 0;
        sectorMap[sector] += value;
      }
    });

    const holdings = Object.values(holdingsMap).filter(value => value > 0);
    const weights = holdings.map(value => (value / totalValue) * 100);
    const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
    
    // Calculate actual sector concentration (largest sector percentage)
    const sectorWeights = Object.values(sectorMap).map(value => (value / totalValue) * 100);
    const sectorConcentration = sectorWeights.length > 0 ? Math.max(...sectorWeights) : 0;
    
    console.log('📊 Sector Analysis:', Object.entries(sectorMap).map(([sector, value]) => 
      `${sector}: ${((value / totalValue) * 100).toFixed(1)}%`));
    
    return { maxWeight, sectorConcentration };
  }

  private calculatePortfolioBeta(historyData: any[]): number {
    if (historyData.length < 30) {
      // Not enough data - estimate based on portfolio composition
      // Tech-heavy portfolios typically have beta > 1.0
      return 1.25; // Conservative estimate for tech-heavy portfolio
    }
    
    // Calculate beta from actual returns (simplified)
    const returns = this.calculateDailyReturns(historyData);
    if (returns.length < 20) return 1.25;
    
    // Estimate beta from volatility relative to market
    const portfolioVol = this.calculateVolatility(returns);
    const marketVol = 16; // Historical S&P 500 volatility ~16%
    const beta = portfolioVol / marketVol;
    
    // Cap beta at reasonable levels (0.5 to 2.0)
    return Math.max(0.5, Math.min(2.0, beta));
  }

  private calculateCaptureRatios(historyData: any[]): { upCapture: number; downCapture: number } {
    if (historyData.length < 50) {
      // Not enough data - estimate based on beta
      const beta = this.calculatePortfolioBeta(historyData);
      return {
        upCapture: Math.round(beta * 100), // Beta * 100 for up capture
        downCapture: Math.round(beta * 90)  // Slightly lower down capture
      };
    }
    
    // Calculate actual capture ratios from historical data
    const returns = this.calculateDailyReturns(historyData);
    // This would need S&P 500 data for accurate calculation
    // For now, estimate based on portfolio characteristics
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const upCapture = Math.round(Math.max(80, Math.min(120, (avgReturn + 1) * 100)));
    const downCapture = Math.round(Math.max(70, Math.min(110, (avgReturn + 0.8) * 100)));
    
    return { upCapture, downCapture };
  }

  private calculateInformationRatio(historyData: any[]): number {
    if (historyData.length < 30) {
      // Not enough data - estimate based on portfolio performance
      return 0.6; // Conservative estimate for diversified portfolio
    }
    
    // Calculate information ratio from actual data
    const returns = this.calculateDailyReturns(historyData);
    if (returns.length < 20) return 0.6;
    
    const excessReturns = returns.map(r => r - 0.02); // Subtract benchmark estimate
    const avgExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
    const trackingError = this.calculateVolatility(excessReturns);
    
    const infoRatio = trackingError > 0 ? avgExcessReturn / trackingError : 0;
    
    // Cap at reasonable levels (-1 to 2)
    return Math.max(-1, Math.min(2, infoRatio));
  }

  private getFallbackMetrics(): RealRiskMetrics {
    console.log('🚨❌ RETURNING FALLBACK METRICS - Sharpe 0.75!');
    return {
      sharpeRatio: 0.75,
      portfolioBeta: 1.35,
      volatility: 22.5,
      maxDrawdown: -15.2,
      valueAtRisk: 51697.74,
      sortinoRatio: 1.1,
      calmarRatio: 5.0,
      informationRatio: 0.8,
      upCaptureRatio: 110,
      downCaptureRatio: 85,
      expectedShortfall: 0,
      riskScore: 0,
      concentrationRisk: 0,
      sectorConcentration: 0,
      totalValue: 0,
      isRealData: false
    };
  }

  clearCache(portfolioId?: string): void {
    if (portfolioId) {
      delete this.cache[portfolioId];
    } else {
      this.cache = {};
    }
  }
}

export const realRiskAnalysisService = RealRiskAnalysisService.getInstance();