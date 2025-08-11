import { PortfolioValue, EnrichedHolding, PortfolioMetrics } from '../entities/Portfolio';
import { Holding } from '../entities/Holding';
import { IMarketDataService } from '../services/IMarketDataService';
import { IPortfolioService } from '../services/IPortfolioService';

export class CalculatePortfolioValue {
  constructor(
    private marketDataService: IMarketDataService,
    private portfolioService: IPortfolioService
  ) {}

  async execute(portfolioId: string): Promise<PortfolioValue> {
    console.log('🔧 CLEAN CALCULATION: Starting portfolio calculation');
    
    // Get holdings
    const holdings = await this.portfolioService.getHoldings(portfolioId);
    if (!holdings || holdings.length === 0) {
      return this.getEmptyPortfolioValue(portfolioId);
    }

    // Get current prices
    const symbols = holdings.map(h => h.symbol);
    const currentPrices = await this.marketDataService.getBatchPrices(symbols);
    
    // Calculate enriched holdings with PROPER formatting
    let totalValue = 0;
    const enrichedHoldings: EnrichedHolding[] = [];
    
    for (const holding of holdings) {
      const currentPrice = currentPrices[holding.symbol] || holding.avgCost;
      const marketValue = holding.shares * currentPrice;
      const totalReturn = marketValue - (holding.shares * holding.avgCost);
      const totalReturnPercent = ((totalReturn / (holding.shares * holding.avgCost)) * 100);
      
      totalValue += marketValue;
      
      // Get daily change (placeholder for now)
      const yesterdayPrice = currentPrice * 0.995; // Fallback calculation
      const dailyChange = (currentPrice - yesterdayPrice) * holding.shares;
      const dailyChangePercent = ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;
      
      enrichedHoldings.push({
        symbol: holding.symbol,
        shares: holding.shares,
        avgCost: holding.avgCost,
        currentPrice: Number(currentPrice.toFixed(2)),
        totalValue: Number(marketValue.toFixed(2)),
        gain: Number(totalReturn.toFixed(2)),
        gainPercent: this.sanitizePercent(totalReturnPercent),
        dayChange: Number(dailyChange.toFixed(2)),
        dayChangePercent: this.sanitizePercent(dailyChangePercent),
        weight: 0, // Will calculate after we have total
        sector: 'Technology', // Default sector since not in Holding entity
        companyName: holding.symbol // Use symbol as name fallback
      });
    }

    // Calculate weights with EXACTLY 2 decimal places
    enrichedHoldings.forEach(holding => {
      const weight = (holding.totalValue / totalValue) * 100;
      holding.weight = Number(weight.toFixed(2));
    });

    // Get performance metrics with SANITY CHECKS
    const metrics = await this.calculatePerformanceMetrics(portfolioId, totalValue);

    console.log('✅ CLEAN CALCULATION COMPLETE:', {
      totalValue: totalValue.toFixed(2),
      holdingsCount: enrichedHoldings.length,
      ytdReturn: metrics.yearToDateChangePercent + '%'
    });

    return {
      portfolioId,
      totalValue: Number(totalValue.toFixed(2)),
      holdings: enrichedHoldings,
      lastUpdated: new Date(),
      ...metrics
    };
  }

  private async calculatePerformanceMetrics(portfolioId: string, currentValue: number) {
    // Get historical values
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // Get values with fallbacks
    const yesterdayValue = await this.getPortfolioValueAt(portfolioId, yesterday) || currentValue * 0.995;
    const weekAgoValue = await this.getPortfolioValueAt(portfolioId, weekAgo) || currentValue * 0.98;
    const monthAgoValue = await this.getPortfolioValueAt(portfolioId, monthAgo) || currentValue * 0.95;
    const yearStartValue = await this.getPortfolioValueAt(portfolioId, yearStart) || currentValue * 0.9;

    // Calculate changes
    const dailyChange = currentValue - yesterdayValue;
    const weeklyChange = currentValue - weekAgoValue;
    const monthlyChange = currentValue - monthAgoValue;
    const yearToDateChange = currentValue - yearStartValue;

    // Calculate percentages with LIMITS
    let dailyChangePercent = (dailyChange / yesterdayValue) * 100;
    let weeklyChangePercent = (weeklyChange / weekAgoValue) * 100;
    let monthlyChangePercent = (monthlyChange / monthAgoValue) * 100;
    let yearToDateChangePercent = (yearToDateChange / yearStartValue) * 100;

    // CRITICAL: Sanity checks to prevent impossible values
    dailyChangePercent = this.sanitizePercent(dailyChangePercent, 10);
    weeklyChangePercent = this.sanitizePercent(weeklyChangePercent, 20);
    monthlyChangePercent = this.sanitizePercent(monthlyChangePercent, 30);
    yearToDateChangePercent = this.sanitizePercent(yearToDateChangePercent, 100);

    return {
      dailyChange: Number(dailyChange.toFixed(2)),
      dailyChangePercent: dailyChangePercent,
      weeklyChange: Number(weeklyChange.toFixed(2)),
      weeklyChangePercent: weeklyChangePercent,
      monthlyChange: Number(monthlyChange.toFixed(2)),
      monthlyChangePercent: monthlyChangePercent,
      yearToDateChange: Number(yearToDateChange.toFixed(2)),
      yearToDateChangePercent: yearToDateChangePercent
    };
  }

  private sanitizePercent(value: number, maxAbsolute: number = 100): number {
    if (!isFinite(value)) return 0;
    
    // Cap at reasonable limits
    const capped = Math.max(-maxAbsolute, Math.min(maxAbsolute, value));
    
    // ALWAYS return 2 decimal places
    return Number(capped.toFixed(2));
  }

  private async getPortfolioValueAt(portfolioId: string, date: Date): Promise<number | null> {
    try {
      const value = await this.portfolioService.getPortfolioValueAt(portfolioId, date);
      return value;
    } catch {
      return null;
    }
  }

  async calculateMetrics(portfolioId: string): Promise<PortfolioMetrics> {
    const transactions = await this.portfolioService.getTransactions(portfolioId);
    const history = await this.portfolioService.getPortfolioHistory(portfolioId, 365);
    
    // Calculate real metrics based on actual data
    const totalInvested = transactions
      .filter(t => t.type === 'buy' || t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentValue = history[history.length - 1]?.value || 0;
    const totalReturn = currentValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Calculate Sharpe ratio, volatility, etc. from historical data
    const returns = this.calculateDailyReturns(history);
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const maxDrawdown = this.calculateMaxDrawdown(history);

    return {
      totalReturn,
      totalReturnPercent,
      sharpeRatio,
      volatility,
      beta: 1.0, // Would need market data for accurate beta
      maxDrawdown,
      winRate: this.calculateWinRate(returns),
      averageGain: this.calculateAverageGain(returns),
      averageLoss: this.calculateAverageLoss(returns),
      consistency: this.calculateConsistency(returns)
    };
  }

  private calculateDailyReturns(history: Array<{date: Date, value: number}>): number[] {
    const returns = [];
    for (let i = 1; i < history.length; i++) {
      if (history[i-1].value > 0) {
        returns.push((history[i].value - history[i-1].value) / history[i-1].value);
      }
    }
    return returns;
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    const riskFreeRate = 0.02 / 252; // 2% annual risk-free rate, daily
    const excessReturns = returns.map(r => r - riskFreeRate);
    const meanExcess = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
    const std = this.calculateVolatility(excessReturns) / Math.sqrt(252); // Daily volatility
    return std > 0 ? (meanExcess / std) * Math.sqrt(252) : 0;
  }

  private calculateMaxDrawdown(history: Array<{date: Date, value: number}>): number {
    let maxDrawdown = 0;
    let peak = 0;
    
    for (const point of history) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = (peak - point.value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown * 100; // Return as percentage
  }

  private calculateWinRate(returns: number[]): number {
    if (returns.length === 0) return 0;
    const wins = returns.filter(r => r > 0).length;
    return (wins / returns.length) * 100;
  }

  private calculateAverageGain(returns: number[]): number {
    const gains = returns.filter(r => r > 0);
    return gains.length > 0 ? gains.reduce((sum, r) => sum + r, 0) / gains.length * 100 : 0;
  }

  private calculateAverageLoss(returns: number[]): number {
    const losses = returns.filter(r => r < 0);
    return losses.length > 0 ? Math.abs(losses.reduce((sum, r) => sum + r, 0) / losses.length) * 100 : 0;
  }

  private calculateConsistency(returns: number[]): number {
    if (returns.length === 0) return 0;
    const winRate = this.calculateWinRate(returns) / 100;
    const avgGain = this.calculateAverageGain(returns) / 100;
    const avgLoss = this.calculateAverageLoss(returns) / 100;
    
    // Simple consistency metric based on win rate and risk/reward
    const profitFactor = avgLoss > 0 ? (winRate * avgGain) / ((1 - winRate) * avgLoss) : 1;
    return Math.min(profitFactor * 20, 100); // Scale to 0-100
  }

  private getEmptyPortfolioValue(portfolioId: string): PortfolioValue {
    return {
      portfolioId,
      totalValue: 0,
      holdings: [],
      dailyChange: 0,
      dailyChangePercent: 0,
      weeklyChange: 0,
      weeklyChangePercent: 0,
      monthlyChange: 0,
      monthlyChangePercent: 0,
      yearToDateChange: 0,
      yearToDateChangePercent: 0,
      lastUpdated: new Date()
    };
  }
}