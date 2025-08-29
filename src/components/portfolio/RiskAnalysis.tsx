import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, Shield, Activity, PieChart, BarChart3, Eye, Calculator } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface RiskAnalysisProps {
  holdings?: Holding[];
  portfolio?: any;
  isDarkMode?: boolean;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ holdings, portfolio, isDarkMode = false }) => {
  const [showCalculations, setShowCalculations] = useState(false);
  
  // Use holdings from either prop
  const portfolioHoldings = holdings || portfolio?.holdings || [];
  const totalValue = portfolio?.totalValue || portfolioHoldings.reduce((sum: number, h: Holding) => sum + h.marketValue, 0);

  if (!portfolioHoldings || portfolioHoldings.length === 0) {
    return (
      <div className="rounded-xl shadow-lg p-8 border border-gray-700 bg-gray-800">
        <p className="text-gray-400 text-center">No holdings data available for risk analysis</p>
      </div>
    );
  }

  // Calculate risk metrics
  const calculateRiskMetrics = () => {
    const returns = portfolioHoldings.map((h: Holding) => h.unrealizedGainPercent || 0);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const riskFreeRate = 2.5;
    
    // Standard Deviation
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    // Sharpe Ratio
    const sharpeRatio = stdDev !== 0 ? (avgReturn - riskFreeRate) / stdDev : 0;
    
    // Sortino Ratio (downside deviation)
    const downsideReturns = returns.filter(r => r < 0);
    const downsideDeviation = downsideReturns.length > 0 
      ? Math.sqrt(downsideReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / downsideReturns.length)
      : 0;
    const sortinoRatio = downsideDeviation !== 0 ? (avgReturn - riskFreeRate) / downsideDeviation : 0;
    
    // Beta (simplified - comparing to market average)
    const marketReturn = 10;
    const beta = stdDev !== 0 ? (avgReturn - riskFreeRate) / (marketReturn - riskFreeRate) : 1;
    
    // Max Drawdown
    const maxDrawdown = Math.min(...returns);
    
    // Value at Risk (95% confidence)
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor(sortedReturns.length * 0.05);
    const valueAtRisk = sortedReturns[varIndex] || 0;
    
    // Information Ratio
    const trackingError = stdDev * 0.8;
    const activeReturn = avgReturn - marketReturn;
    const informationRatio = trackingError !== 0 ? activeReturn / trackingError : 0;
    
    // Treynor Ratio
    const treynorRatio = beta !== 0 ? (avgReturn - riskFreeRate) / beta : 0;

    return {
      sharpeRatio: { value: sharpeRatio, label: 'Sharpe Ratio' },
      sortinoRatio: { value: sortinoRatio, label: 'Sortino Ratio' },
      beta: { value: beta, label: 'Beta' },
      maxDrawdown: { value: maxDrawdown, label: 'Max Drawdown' },
      valueAtRisk: { value: valueAtRisk, label: 'VaR (95%)' },
      standardDeviation: { value: stdDev, label: 'Std Deviation' },
      informationRatio: { value: informationRatio, label: 'Info Ratio' },
      treynorRatio: { value: treynorRatio, label: 'Treynor Ratio' }
    };
  };

  const riskCalculations = calculateRiskMetrics();

  // Calculate risk level
  const getRiskLevel = () => {
    const sharpe = riskCalculations.sharpeRatio.value;
    if (sharpe > 2) return { level: 'Low Risk', color: 'text-green-600', score: 2 };
    if (sharpe > 1) return { level: 'Moderate Risk', color: 'text-yellow-600', score: 5 };
    if (sharpe > 0) return { level: 'Medium Risk', color: 'text-orange-600', score: 7 };
    return { level: 'High Risk', color: 'text-red-600', score: 9 };
  };

  const riskLevel = getRiskLevel();

  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    metricBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
  };

  const getRiskColor = (value: number, metric: string) => {
    switch (metric) {
      case 'sharpe':
      case 'sortino':
        return value > 1 ? 'text-green-600' : value > 0 ? 'text-yellow-600' : 'text-red-600';
      case 'beta':
        return Math.abs(value - 1) < 0.3 ? 'text-green-600' : Math.abs(value - 1) < 0.7 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  // Calculate portfolio overview
  const totalCostBasis = portfolioHoldings.reduce((sum: number, h: Holding) => sum + h.costBasis, 0);
  const totalGainLoss = totalValue - totalCostBasis;
  const returnPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  return (
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.cardBg}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold ${theme.textPrimary} flex items-center`}>
          <Shield className="w-7 h-7 mr-3 text-blue-600" />
          Risk Analysis X-Ray™
        </h3>
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
            showCalculations 
              ? 'bg-blue-600 text-white' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showCalculations ? 'Hide' : 'Show'} Calculations
        </button>
      </div>

      {/* Portfolio Performance Overview */}
      <div className={`rounded-lg p-6 mb-8 ${
        isDarkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-4 ${theme.textPrimary}`}>Portfolio Performance Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className={`text-sm ${theme.textMuted}`}>Current Value</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted}`}>Cost Basis</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              ${totalCostBasis.toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted}`}>Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalGainLoss).toLocaleString()}
            </p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted}`}>Return %</p>
            <p className={`text-2xl font-bold ${returnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {returnPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <div className={`rounded-lg p-6 mb-8 ${theme.metricBg}`}>
        <h4 className={`text-lg font-semibold mb-4 ${theme.textPrimary}`}>Overall Risk Assessment</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-4xl font-bold ${riskLevel.color}`}>
              {riskLevel.score.toFixed(1)}
            </div>
            <div>
              <div className={`font-semibold px-3 py-1 rounded-full text-sm ${
                riskLevel.level === 'Low Risk' ? 'bg-green-100 text-green-700' :
                riskLevel.level === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-700' :
                riskLevel.level === 'Medium Risk' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {riskLevel.level}
              </div>
              <div className={`text-xs mt-1 ${theme.textMuted}`}>
                Scale: 1 (Low) - 10 (Very High)
              </div>
            </div>
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                riskLevel.level === 'Low Risk' ? 'bg-green-500' :
                riskLevel.level === 'Moderate Risk' ? 'bg-yellow-500' :
                riskLevel.level === 'Medium Risk' ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${riskLevel.score * 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transparent Calculations */}
      {showCalculations && (
        <div className={`border-2 border-blue-500 rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            100% Transparent Risk Calculations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(riskCalculations).slice(0, 6).map(([key, metric]) => (
              <div key={key} className={`rounded p-4 ${theme.metricBg}`}>
                <p className="text-xs font-bold text-blue-600 mb-2">{metric.label.toUpperCase()}:</p>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Formula shown here<br/>
                  Calculation: {metric.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(riskCalculations).map(([key, metric]) => (
          <div key={key} className={`rounded-lg p-4 ${theme.metricBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${theme.textMuted}`}>{metric.label}</span>
              <BarChart3 className="w-4 h-4 text-gray-400" />
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(metric.value, key)}`}>
              {Math.abs(metric.value).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Professional Assessment */}
      <div className={`rounded-lg p-4 ${
        isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-2 ${theme.textPrimary}`}>
          Professional Risk Assessment
        </h4>
        <p className={`text-sm ${theme.textSecondary}`}>
          Portfolio demonstrates {riskLevel.level.toLowerCase()} characteristics with a Sharpe ratio of {riskCalculations.sharpeRatio.value.toFixed(2)}, 
          indicating {riskCalculations.sharpeRatio.value > 1.0 ? 'efficient' : 'suboptimal'} risk-adjusted returns.
        </p>
      </div>
    </div>
  );
};