import React, { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, Target, Eye, Calculator, BarChart3 } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface PortfolioDashboardProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ holdings, isDarkMode = false }) => {
  const [showCalculations, setShowCalculations] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sectors' | 'performance'>('overview');

  // Calculate metrics from actual holdings data
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalUnrealizedGain = totalMarketValue - totalCostBasis;
  const totalReturnPercent = totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0;

  // Calculate win rate
  const winners = holdings.filter(h => h.unrealizedGain > 0).length;
  const winRate = holdings.length > 0 ? (winners / holdings.length) * 100 : 0;

  // Get top holdings
  const sortedHoldings = [...holdings].sort((a, b) => b.marketValue - a.marketValue);
  const top5Holdings = sortedHoldings.slice(0, 5);

  // Calculate concentration
  const top1Concentration = holdings.length > 0 ? (sortedHoldings[0].marketValue / totalMarketValue) * 100 : 0;
  const top3Concentration = sortedHoldings.slice(0, 3).reduce((sum, h) => sum + h.marketValue, 0) / totalMarketValue * 100;
  const top5Concentration = top5Holdings.reduce((sum, h) => sum + h.marketValue, 0) / totalMarketValue * 100;

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
          <BarChart3 className="w-7 h-7 mr-3 text-green-600" />
          Portfolio Dashboard
        </h3>
        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`px-4 py-2 rounded ${activeTab === 'sectors' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Sectors
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 rounded ${activeTab === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Performance
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className={`text-sm ${theme.textMuted}`}>Portfolio Value</span>
          </div>
          <p className={`text-2xl font-bold ${theme.textPrimary}`}>
            {formatCurrency(totalMarketValue)}
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-1`}>
            Cost: {formatCurrency(totalCostBasis)}
          </p>
        </div>

        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className={`text-sm ${theme.textMuted}`}>Total Return</span>
          </div>
          <p className={`text-2xl font-bold ${totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%
          </p>
          <p className={`text-sm ${totalUnrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {formatCurrency(Math.abs(totalUnrealizedGain))}
          </p>
        </div>

        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            <span className={`text-sm ${theme.textMuted}`}>Holdings</span>
          </div>
          <p className={`text-2xl font-bold ${theme.textPrimary}`}>
            {holdings.length}
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-1`}>
            Diversified positions
          </p>
        </div>

        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className={`text-sm ${theme.textMuted}`}>Win Rate</span>
          </div>
          <p className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
            {winRate.toFixed(0)}%
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-1`}>
            {winners} of {holdings.length} positive
          </p>
        </div>
      </div>

      {/* Transparent Calculations */}
      {showCalculations && (
        <div className={`border-2 border-green-500 rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            100% Transparent Dashboard Calculations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`rounded p-4 ${theme.metricBg}`}>
              <p className="text-xs font-bold text-green-600 mb-2">TOTAL RETURN:</p>
              <p className={`text-xs ${theme.textSecondary}`}>
                Market Value: {formatCurrency(totalMarketValue)}<br/>
                - Cost Basis: {formatCurrency(totalCostBasis)}<br/>
                = Gain/Loss: {formatCurrency(totalUnrealizedGain)}<br/>
                Return %: ({totalUnrealizedGain.toFixed(0)} / {totalCostBasis.toFixed(0)}) × 100 = {totalReturnPercent.toFixed(1)}%
              </p>
            </div>
            <div className={`rounded p-4 ${theme.metricBg}`}>
              <p className="text-xs font-bold text-blue-600 mb-2">WIN RATE:</p>
              <p className={`text-xs ${theme.textSecondary}`}>
                Winners: {winners} positions<br/>
                Total: {holdings.length} positions<br/>
                Win Rate: ({winners} / {holdings.length}) × 100 = {winRate.toFixed(0)}%
              </p>
            </div>
            <div className={`rounded p-4 ${theme.metricBg}`}>
              <p className="text-xs font-bold text-purple-600 mb-2">CONCENTRATION:</p>
              <p className={`text-xs ${theme.textSecondary}`}>
                Top 1: {top1Concentration.toFixed(1)}%<br/>
                Top 3: {top3Concentration.toFixed(1)}%<br/>
                Top 5: {top5Concentration.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top 5 Holdings */}
        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <h4 className={`text-xl font-semibold mb-6 ${theme.textPrimary}`}>
            Top 5 Holdings
          </h4>
          <div className="space-y-4">
            {top5Holdings.map((holding, index) => (
              <div key={holding.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-green-600' :
                    index === 2 ? 'bg-purple-600' :
                    index === 3 ? 'bg-orange-600' :
                    'bg-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-semibold ${theme.textPrimary}`}>{holding.symbol}</p>
                    <p className={`text-sm ${theme.textSecondary}`}>{holding.shares.toFixed(0)} shares</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${theme.textPrimary}`}>
                    {formatCurrency(holding.marketValue)}
                  </p>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {((holding.marketValue / totalMarketValue) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concentration Analysis */}
        <div className={`rounded-lg p-6 ${theme.metricBg}`}>
          <h4 className={`text-xl font-semibold mb-6 ${theme.textPrimary}`}>
            Concentration Analysis
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={`${theme.textSecondary}`}>Top 5 Concentration:</span>
                <span className={`font-semibold ${
                  top5Concentration > 80 ? 'text-red-600' :
                  top5Concentration > 60 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {top5Concentration > 80 ? 'High Risk' :
                   top5Concentration > 60 ? 'Medium Risk' :
                   'Low Risk'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    top5Concentration > 80 ? 'bg-red-500' :
                    top5Concentration > 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(top5Concentration, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className={`${theme.textSecondary}`}>Top 1 Holding:</span>
                <span className={`font-semibold ${theme.textPrimary}`}>{top1Concentration.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className={`${theme.textSecondary}`}>Top 3 Holdings:</span>
                <span className={`font-semibold ${theme.textPrimary}`}>{top3Concentration.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className={`${theme.textSecondary}`}>Top 5 Holdings:</span>
                <span className={`font-semibold ${theme.textPrimary}`}>{top5Concentration.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <p className={`text-sm ${theme.textSecondary}`}>
                <span className="font-semibold">Recommendation:</span> {
                  top5Concentration > 80 ? 'Consider reducing concentration in top holdings to minimize single-position risk.' :
                  top5Concentration > 60 ? 'Portfolio shows moderate concentration. Monitor top positions closely.' :
                  'Portfolio is well-diversified with appropriate position sizing.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};