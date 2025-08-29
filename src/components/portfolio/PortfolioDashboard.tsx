// src/components/portfolio/PortfolioDashboard.tsx - Portfolio Dashboard with REAL Sector Data
import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, Target, Award, Activity, Eye, Calculator } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface PortfolioDashboardProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ holdings, isDarkMode = false }) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'sectors' | 'performance'>('overview');
  const [showCalculations, setShowCalculations] = useState(false);

  // Calculate portfolio metrics with detailed calculations
  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
  const totalCost = holdings.reduce((sum, holding) => {
    const positionCost = holding.totalCost || holding.cost_basis || (holding.costBasis * holding.shares);
    return sum + positionCost;
  }, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  // Calculate top holdings
  const sortedHoldings = [...holdings].sort((a, b) => b.marketValue - a.marketValue);
  const topHoldings = sortedHoldings.slice(0, 5);

  // Calculate winners and losers
  const winnersAndLosers = holdings.map(h => ({
    ...h,
    unrealizedGain: h.unrealizedGain || (h.marketValue - (h.totalCost || h.cost_basis || h.costBasis * h.shares)),
    unrealizedGainPercent: h.unrealizedGainPercent || ((h.totalCost || h.cost_basis || h.costBasis * h.shares) > 0 ? 
      ((h.marketValue - (h.totalCost || h.cost_basis || h.costBasis * h.shares)) / (h.totalCost || h.cost_basis || h.costBasis * h.shares)) * 100 : 0)
  }));
  
  const winners = winnersAndLosers.filter(h => h.unrealizedGain > 0).sort((a, b) => b.unrealizedGainPercent - a.unrealizedGainPercent).slice(0, 3);
  const losers = winnersAndLosers.filter(h => h.unrealizedGain < 0).sort((a, b) => a.unrealizedGainPercent - b.unrealizedGainPercent).slice(0, 3);

  // REAL SECTOR ALLOCATION FROM ACTUAL DATA
  const calculateSectorAllocation = () => {
    const sectorMap = new Map<string, number>();
    
    holdings.forEach(holding => {
      // Get sector from holding, default to "Other" if not specified
      const sector = holding.sector || 'Other';
      const currentValue = sectorMap.get(sector) || 0;
      sectorMap.set(sector, currentValue + holding.marketValue);
    });

    // Convert to array and sort by value
    const sectors = Array.from(sectorMap.entries())
      .map(([sector, value]) => ({
        sector,
        value,
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    // Assign colors to sectors
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-gray-500'
    ];

    return sectors.map((s, index) => ({
      ...s,
      color: colors[index % colors.length]
    }));
  };

  const sectorData = calculateSectorAllocation();

  // Calculate concentration risk with full transparency
  const concentrationCalculations = {
    top1Value: topHoldings[0]?.marketValue || 0,
    top3Value: topHoldings.slice(0, 3).reduce((sum, h) => sum + h.marketValue, 0),
    top5Value: topHoldings.reduce((sum, h) => sum + h.marketValue, 0),
    top1Percent: totalValue > 0 ? ((topHoldings[0]?.marketValue || 0) / totalValue) * 100 : 0,
    top3Percent: totalValue > 0 ? (topHoldings.slice(0, 3).reduce((sum, h) => sum + h.marketValue, 0) / totalValue) * 100 : 0,
    top5Percent: totalValue > 0 ? (topHoldings.reduce((sum, h) => sum + h.marketValue, 0) / totalValue) * 100 : 0
  };

  const concentrationRisk = () => {
    const concentration = concentrationCalculations.top5Percent;
    
    if (concentration > 60) return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (concentration > 40) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const concentrationLevel = concentrationRisk();

  // Performance metrics with calculations
  const performanceCalculations = {
    totalPositions: holdings.length,
    winningPositions: winners.length,
    losingPositions: losers.length,
    avgReturn: totalGainPercent,
    winRate: holdings.length > 0 ? (winners.length / holdings.length) * 100 : 0,
    avgWinner: winners.length > 0 ? winners.reduce((sum, w) => sum + w.unrealizedGainPercent, 0) / winners.length : 0,
    avgLoser: losers.length > 0 ? losers.reduce((sum, l) => sum + l.unrealizedGainPercent, 0) / losers.length : 0,
    winLossRatio: losers.length > 0 && winners.length > 0 ? 
      (winners.reduce((sum, w) => sum + Math.abs(w.unrealizedGainPercent), 0) / winners.length) /
      (losers.reduce((sum, l) => sum + Math.abs(l.unrealizedGainPercent), 0) / losers.length) : 0
  };

  // Theme classes
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    sectionBg: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200',
    metricBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
    tabActive: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white',
    tabInactive: isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    calcBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
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
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.cardBg} mb-8`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} flex items-center`}>
          <BarChart3 className="w-7 h-7 mr-3 text-green-600" />
          Portfolio Dashboard
        </h3>
        <div className="flex items-center space-x-4">
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
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedView === 'overview' ? theme.tabActive : theme.tabInactive
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('sectors')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedView === 'sectors' ? theme.tabActive : theme.tabInactive
              }`}
            >
              Sectors
            </button>
            <button
              onClick={() => setSelectedView('performance')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedView === 'performance' ? theme.tabActive : theme.tabInactive
              }`}
            >
              Performance
            </button>
          </div>
        </div>
      </div>

      {/* 100% TRANSPARENT CALCULATIONS */}
      {showCalculations && (
        <div className={`border-2 border-green-500 rounded-lg p-6 mb-8 transition-all duration-300 ${
          isDarkMode ? 'bg-green-900 border-green-400' : 'bg-green-50 border-green-500'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-300 ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            100% Transparent Portfolio Calculations
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Portfolio Value Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-green-600 mb-2">PORTFOLIO VALUE CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Sum of all holding market values</p>
              {holdings.slice(0, 3).map((holding, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {holding.symbol}: {holding.shares} × ${holding.price} = {formatCurrency(holding.marketValue)}
                </p>
              ))}
              {holdings.length > 3 && <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>+ {holdings.length - 3} more positions...</p>}
              <p className="text-xs font-bold text-green-600 mt-1">Total: {formatCurrency(totalValue)}</p>
            </div>

            {/* Sector Breakdown Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-orange-600 mb-2">SECTOR ALLOCATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Grouped by sector classification</p>
              {sectorData.slice(0, 3).map((sector, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {sector.sector}: {formatCurrency(sector.value)} ({sector.percentage.toFixed(1)}%)
                </p>
              ))}
              <p className="text-xs font-bold text-orange-600 mt-1">{sectorData.length} sectors total</p>
            </div>

            {/* Return Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-red-600 mb-2">RETURN CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>(Current Value - Total Cost) ÷ Total Cost × 100</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Current Value: {formatCurrency(totalValue)}</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Total Cost: {formatCurrency(totalCost)}</p>
              <p className="text-xs font-bold text-red-600 mt-1">
                Return: ({formatCurrency(totalValue)} - {formatCurrency(totalCost)}) ÷ {formatCurrency(totalCost)} = {totalGainPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className={`rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Portfolio Value</span>
          </div>
          <div className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} mb-1`}>
            {formatCurrency(totalValue)}
          </div>
          <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
            Cost: {formatCurrency(totalCost)}
          </div>
        </div>

        <div className={`rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-3">
            {totalGain >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
            <span className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Total Return</span>
          </div>
          <div className={`text-2xl font-bold mb-1 ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
          </div>
          <div className={`text-sm ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalGain)}
          </div>
        </div>

        <div className={`rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-3">
            <Target className="w-6 h-6 text-blue-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Holdings</span>
          </div>
          <div className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} mb-1`}>
            {holdings.length}
          </div>
          <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
            Diversified positions
          </div>
        </div>

        <div className={`rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${theme.metricBg}`}>
          <div className="flex items-center justify-between mb-3">
            <Award className="w-6 h-6 text-purple-600" />
            <span className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Win Rate</span>
          </div>
          <div className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} mb-1`}>
            {performanceCalculations.winRate.toFixed(0)}%
          </div>
          <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
            {winners.length} of {holdings.length} positive
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Holdings */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
              Top 5 Holdings
            </h4>
            <div className="space-y-4">
              {topHoldings.map((holding, index) => {
                const percentage = (holding.marketValue / totalValue) * 100;
                return (
                  <div key={holding.symbol} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'][index]
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-semibold text-lg transition-colors duration-300 ${theme.textPrimary}`}>
                          {holding.symbol}
                        </div>
                        <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                          {holding.shares.toLocaleString()} shares
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-lg transition-colors duration-300 ${theme.textPrimary}`}>
                        {formatCurrency(holding.marketValue)}
                      </div>
                      <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concentration Risk */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
              Concentration Analysis
            </h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className={`text-lg transition-colors duration-300 ${theme.textSecondary}`}>Top 5 Concentration:</span>
                <span className={`font-semibold px-3 py-2 rounded text-lg ${concentrationLevel.bgColor} ${concentrationLevel.color}`}>
                  {concentrationLevel.level} Risk
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Top 1 Holding:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    {concentrationCalculations.top1Percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Top 3 Holdings:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    {concentrationCalculations.top3Percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Top 5 Holdings:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    {concentrationCalculations.top5Percent.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded border transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                  <strong>Recommendation:</strong> {concentrationLevel.level === 'High' ? 
                    'Consider reducing concentration in top holdings to minimize single-position risk.' :
                    concentrationLevel.level === 'Medium' ?
                    'Moderate concentration. Monitor position sizes relative to portfolio.' :
                    'Well-diversified portfolio with appropriate position sizing.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'sectors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sector Allocation */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
              Sector Allocation
            </h4>
            <div className="space-y-4">
              {sectorData.map((sector, index) => (
                <div key={sector.sector} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-4">
                    <div className={`w-5 h-5 rounded ${sector.color}`}></div>
                    <span className={`text-lg transition-colors duration-300 ${theme.textPrimary}`}>
                      {sector.sector}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className={`transition-colors duration-300 ${theme.textSecondary}`}>
                      {formatCurrency(sector.value)}
                    </span>
                    <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary} w-16 text-right text-lg`}>
                      {sector.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Diversification Chart */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
              Diversification Analysis
            </h4>
            
            {/* Visual bar chart */}
            <div className="space-y-4 mb-6">
              {sectorData.map((sector, index) => (
                <div key={sector.sector} className="flex items-center space-x-3">
                  <div className={`w-24 text-sm transition-colors duration-300 ${theme.textSecondary} text-right truncate`}>
                    {sector.sector}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div 
                      className={`${sector.color} h-6 rounded-full transition-all duration-500`}
                      style={{ width: `${sector.percentage}%` }}
                    >
                      <span className="absolute right-2 top-1 text-xs text-white font-semibold">
                        {sector.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`p-4 rounded border transition-all duration-300 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                <strong>Diversification Score:</strong> {sectorData.length > 5 ? 'Excellent' : sectorData.length > 3 ? 'Good' : 'Needs Improvement'} - 
                Portfolio is spread across {sectorData.length} sectors with largest allocation at {Math.max(...sectorData.map(s => s.percentage)).toFixed(1)}%.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Winners */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary} flex items-center`}>
              <TrendingUp className="w-6 h-6 mr-3 text-green-600" />
              Top Performers
            </h4>
            <div className="space-y-4">
              {winners.length > 0 ? winners.map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between p-4 rounded bg-green-50 dark:bg-green-900/20">
                  <div>
                    <div className={`font-semibold text-lg transition-colors duration-300 ${theme.textPrimary}`}>
                      {holding.symbol}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      {formatCurrency(holding.marketValue)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold text-lg">
                      +{holding.unrealizedGainPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">
                      {formatCurrency(holding.unrealizedGain)}
                    </div>
                  </div>
                </div>
              )) : (
                <p className={`text-center py-8 transition-colors duration-300 ${theme.textMuted}`}>
                  No winning positions
                </p>
              )}
            </div>
          </div>

          {/* Losers */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary} flex items-center`}>
              <TrendingDown className="w-6 h-6 mr-3 text-red-600" />
              Underperformers
            </h4>
            <div className="space-y-4">
              {losers.length > 0 ? losers.map((holding, index) => (
                <div key={holding.symbol} className="flex items-center justify-between p-4 rounded bg-red-50 dark:bg-red-900/20">
                  <div>
                    <div className={`font-semibold text-lg transition-colors duration-300 ${theme.textPrimary}`}>
                      {holding.symbol}
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      {formatCurrency(holding.marketValue)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600 font-semibold text-lg">
                      {holding.unrealizedGainPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-red-600">
                      {formatCurrency(holding.unrealizedGain)}
                    </div>
                  </div>
                </div>
              )) : (
                <p className={`text-center py-8 transition-colors duration-300 ${theme.textMuted}`}>
                  No losing positions
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className={`mt-10 rounded-lg p-6 transition-all duration-300 ${
        isDarkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'
      }`}>
        <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
          Portfolio Performance Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              performanceCalculations.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {performanceCalculations.avgReturn >= 0 ? '+' : ''}{performanceCalculations.avgReturn.toFixed(1)}%
            </div>
            <div className={`text-sm mt-1 transition-colors duration-300 ${theme.textSecondary}`}>Average Return</div>
          </div>
          <div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary}`}>
              {performanceCalculations.winRate.toFixed(0)}%
            </div>
            <div className={`text-sm mt-1 transition-colors duration-300 ${theme.textSecondary}`}>Win Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {winners.length > 0 ? '+' : ''}{performanceCalculations.avgWinner.toFixed(1)}%
            </div>
            <div className={`text-sm mt-1 transition-colors duration-300 ${theme.textSecondary}`}>Avg Winner</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {performanceCalculations.avgLoser.toFixed(1)}%
            </div>
            <div className={`text-sm mt-1 transition-colors duration-300 ${theme.textSecondary}`}>Avg Loser</div>
          </div>
        </div>
      </div>
    </div>
  );
};