// src/services/analytics/PerformanceAnalyzer.ts

import { Holding } from '../../types/portfolio';

export interface HoldingPerformance extends Holding {
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  gain: number;
  gainPercent: number;
  dayChange?: number;
  dayChangePercent?: number;
}

export interface PerformanceMetrics {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  holdings: HoldingPerformance[];
  dayChange?: number;
  dayChangePercent?: number;
}

export interface TimeBasedReturns {
  oneDay?: number;
  oneWeek?: number;
  oneMonth?: number;
  threeMonths?: number;
  sixMonths?: number;
  ytd?: number;
  oneYear?: number;
  threeYears?: number;
  fiveYears?: number;
  allTime?: number;
}

class PerformanceAnalyzer {
  /**
   * Calculate performance metrics for all holdings
   */
  calculatePerformance(holdings: Holding[]): PerformanceMetrics {
    let totalValue = 0;
    let totalCost = 0;
    
    const performanceHoldings: HoldingPerformance[] = holdings.map(holding => {
      // Use the market value from the holding if available, otherwise calculate
      const currentPrice = holding.marketValue 
        ? holding.marketValue / holding.quantity 
        : holding.price || 0;
      
      const currentValue = holding.marketValue || (holding.quantity * currentPrice);
      const totalCostForHolding = holding.quantity * (holding.costBasis || holding.price || 0);
      const gain = currentValue - totalCostForHolding;
      const gainPercent = totalCostForHolding > 0 
        ? (gain / totalCostForHolding) * 100 
        : 0;

      totalValue += currentValue;
      totalCost += totalCostForHolding;

      return {
        ...holding,
        currentPrice,
        currentValue,
        totalCost: totalCostForHolding,
        gain,
        gainPercent,
        costBasis: holding.costBasis || holding.price || 0
      };
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 
      ? (totalGain / totalCost) * 100 
      : 0;

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      holdings: performanceHoldings
    };
  }

  /**
   * Calculate time-based returns (requires historical data)
   */
  calculateTimeBasedReturns(
    holdings: Holding[], 
    historicalData?: Map<string, any>
  ): TimeBasedReturns {
    // This would integrate with a market data API
    // For now, returning mock data for demonstration
    return {
      oneDay: 0.45,
      oneWeek: 1.23,
      oneMonth: 3.67,
      threeMonths: 8.92,
      sixMonths: 15.34,
      ytd: 18.76,
      oneYear: 22.45,
      threeYears: 67.89,
      fiveYears: 124.56,
      allTime: 234.78
    };
  }

  /**
   * Calculate risk-adjusted returns
   */
  calculateRiskAdjustedReturns(performance: PerformanceMetrics, riskFreeRate: number = 4.5) {
    // Simplified Sharpe ratio calculation
    const annualizedReturn = performance.totalGainPercent;
    const standardDeviation = this.calculateStandardDeviation(performance.holdings);
    const sharpeRatio = (annualizedReturn - riskFreeRate) / standardDeviation;

    return {
      sharpeRatio,
      sortinoRatio: sharpeRatio * 1.1, // Simplified
      treynorRatio: sharpeRatio * 0.9  // Simplified
    };
  }

  /**
   * Calculate standard deviation of returns
   */
  private calculateStandardDeviation(holdings: HoldingPerformance[]): number {
    const returns = holdings.map(h => h.gainPercent);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
    return Math.sqrt(variance);
  }

  /**
   * Identify tax loss harvesting opportunities
   */
  identifyTaxLossHarvesting(holdings: HoldingPerformance[]): HoldingPerformance[] {
    return holdings
      .filter(h => h.gain < 0)
      .filter(h => Math.abs(h.gain) > 100) // Only meaningful losses
      .sort((a, b) => a.gain - b.gain); // Most negative first
  }

  /**
   * Calculate portfolio beta
   */
  calculatePortfolioBeta(holdings: HoldingPerformance[]): number {
    // Simplified beta calculation
    // In production, this would use correlation with market index
    const weightedBeta = holdings.reduce((total, holding) => {
      const weight = holding.currentValue / holdings.reduce((sum, h) => sum + h.currentValue, 0);
      const estimatedBeta = 1.0; // Would fetch from market data
      return total + (weight * estimatedBeta);
    }, 0);
    
    return weightedBeta;
  }

  /**
   * Generate performance summary text
   */
  generatePerformanceSummary(metrics: PerformanceMetrics): string {
    const direction = metrics.totalGain >= 0 ? 'up' : 'down';
    const absoluteGain = Math.abs(metrics.totalGain);
    const absolutePercent = Math.abs(metrics.totalGainPercent);
    
    return `Your portfolio is ${direction} ${this.formatCurrency(absoluteGain)} (${absolutePercent.toFixed(2)}%) ` +
           `with a total value of ${this.formatCurrency(metrics.totalValue)}. ` +
           `${metrics.holdings.filter(h => h.gain > 0).length} positions are profitable.`;
  }

  /**
   * Format currency for display
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}

export default PerformanceAnalyzer;