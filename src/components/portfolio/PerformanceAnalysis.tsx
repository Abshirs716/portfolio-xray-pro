import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, Target, Eye, Calculator } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface PerformanceAnalysisProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

export const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ holdings, isDarkMode = false }) => {
  const [showCalculations, setShowCalculations] = useState(false);

  // Calculate performance metrics
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalUnrealizedGain = holdings.reduce((sum, h) => sum + h.unrealizedGain, 0);
  const totalUnrealizedGainPercent = totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0;

  // Calculate individual metrics
  const winners = holdings.filter(h => h.unrealizedGain > 0);
  const losers = holdings.filter(h => h.unrealizedGain < 0);
  const bestPerformer = holdings.reduce((best, h) => 
    h.unrealizedGainPercent > (best?.unrealizedGainPercent || -Infinity) ? h : best, holdings[0]);
  const worstPerformer = holdings.reduce((worst, h) => 
    h.unrealizedGainPercent < (worst?.unrealizedGainPercent || Infinity) ? h : worst, holdings[0]);

  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    metricBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.cardBg}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold ${theme.textPrimary} flex items-center`}>
          <TrendingUp className="w-7 h-7 mr-3 text-green-600" />
          Performance Analysis
        </h3>
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
            showCalculations 
              ? 'bg-green-600 text-white' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showCalculations ? 'Hide' : 'Show'} Calculations
        </button>
      </div>

      {/* Performance Overview */}
      <div className={`rounded-lg p-6 mb-8 ${
        isDarkMode ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-50 to-blue-50'
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className={`text-sm ${theme.textMuted} mb-1`}>Market Value</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{formatCurrency(totalMarketValue)}</p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted} mb-1`}>Cost Basis</p>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>{formatCurrency(totalCostBasis)}</p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted} mb-1`}>Total Gain/Loss</p>
            <p className={`text-2xl font-bold ${totalUnrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalUnrealizedGain)}
            </p>
          </div>
          <div>
            <p className={`text-sm ${theme.textMuted} mb-1`}>Return %</p>
            <p className={`text-2xl font-bold ${totalUnrealizedGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalUnrealizedGainPercent >= 0 ? '+' : ''}{totalUnrealizedGainPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Transparent Calculations */}
      {showCalculations && (
        <div className={`border-2 border-green-500 rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            100% Transparent Performance Calculations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded p-4 ${theme.metricBg}`}>
              <p className="text-xs font-bold text-green-600 mb-2">TOTAL GAIN/LOSS:</p>
              <p className={`text-xs ${theme.textSecondary}`}>
                Market Value: {formatCurrency(totalMarketValue)}<br/>
                - Cost Basis: {formatCurrency(totalCostBasis)}<br/>
                = Unrealized Gain: {formatCurrency(totalUnrealizedGain)}
              </p>
            </div>
            <div className={`rounded p-4 ${theme.metricBg}`}>
              <p className="text-xs font-bold text-blue-600 mb-2">RETURN PERCENTAGE:</p>
              <p className={`text-xs ${theme.textSecondary}`}>
                Gain: {formatCurrency(totalUnrealizedGain)}<br/>
                ÷ Cost: {formatCurrency(totalCostBasis)}<br/>
                × 100 = {totalUnrealizedGainPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`rounded-lg p-4 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textMuted}`}>Winners</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{winners.length}</p>
          <p className={`text-xs ${theme.textMuted}`}>{((winners.length / holdings.length) * 100).toFixed(0)}% of portfolio</p>
        </div>

        <div className={`rounded-lg p-4 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textMuted}`}>Losers</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{losers.length}</p>
          <p className={`text-xs ${theme.textMuted}`}>{((losers.length / holdings.length) * 100).toFixed(0)}% of portfolio</p>
        </div>

        <div className={`rounded-lg p-4 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textMuted}`}>Best Performer</span>
            <Target className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-bold text-green-600">{bestPerformer?.symbol}</p>
          <p className={`text-xs ${theme.textMuted}`}>+{bestPerformer?.unrealizedGainPercent.toFixed(1)}%</p>
        </div>

        <div className={`rounded-lg p-4 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textMuted}`}>Worst Performer</span>
            <Target className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-bold text-red-600">{worstPerformer?.symbol}</p>
          <p className={`text-xs ${theme.textMuted}`}>{worstPerformer?.unrealizedGainPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Holdings Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left p-2 ${theme.textMuted}`}>Symbol</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Shares</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Cost/Share</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Current Price</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Market Value</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Gain/Loss</th>
              <th className={`text-right p-2 ${theme.textMuted}`}>Return %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr key={index} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <td className={`p-2 font-semibold ${theme.textPrimary}`}>{holding.symbol}</td>
                <td className={`p-2 text-right ${theme.textSecondary}`}>{holding.shares.toFixed(2)}</td>
                <td className={`p-2 text-right ${theme.textSecondary}`}>
                  ${(holding.costBasis / holding.shares).toFixed(2)}
                </td>
                <td className={`p-2 text-right ${theme.textSecondary}`}>${holding.currentPrice.toFixed(2)}</td>
                <td className={`p-2 text-right ${theme.textSecondary}`}>{formatCurrency(holding.marketValue)}</td>
                <td className={`p-2 text-right font-semibold ${holding.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(holding.unrealizedGain)}
                </td>
                <td className={`p-2 text-right font-semibold ${holding.unrealizedGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {holding.unrealizedGainPercent >= 0 ? '+' : ''}{holding.unrealizedGainPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};