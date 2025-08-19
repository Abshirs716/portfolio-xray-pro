// src/components/portfolio/SectorAnalysis.tsx - Professional Sector Analysis with TRANSPARENCY
import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, TrendingDown, AlertTriangle, Target, Eye, Calculator, Info } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface SectorAnalysisProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

interface SectorData {
  sector: string;
  value: number;
  percentage: number;
  holdings: Holding[];
  avgReturn: number;
  risk: 'Low' | 'Medium' | 'High';
  recommendedAllocation: number;
  color: string;
  description: string;
}

export const SectorAnalysis: React.FC<SectorAnalysisProps> = ({ holdings, isDarkMode = false }) => {
  const [showCalculations, setShowCalculations] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);

  // Enhanced sector mapping with real stock classifications
  const sectorMapping: { [key: string]: string } = {
    'AAPL': 'Technology',
    'MSFT': 'Technology', 
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Discretionary',
    'TSLA': 'Consumer Discretionary',
    'NVDA': 'Technology',
    'META': 'Technology',
    'JNJ': 'Healthcare',
    'V': 'Financial Services',
    'WMT': 'Consumer Staples',
    'JPM': 'Financial Services',
    'PG': 'Consumer Staples',
    'UNH': 'Healthcare',
    'HD': 'Consumer Discretionary',
    'MA': 'Financial Services',
    'NFLX': 'Communication Services',
    'DIS': 'Communication Services',
    'BAC': 'Financial Services',
    'ADBE': 'Technology',
    'CRM': 'Technology'
  };

  // Calculate actual sector allocations
  const calculateSectorData = (): SectorData[] => {
    const sectorMap = new Map<string, { value: number; holdings: Holding[]; returns: number[] }>();

    holdings.forEach(holding => {
      const sector = sectorMapping[holding.symbol] || 'Other';
      const existing = sectorMap.get(sector) || { value: 0, holdings: [], returns: [] };
      
      existing.value += holding.marketValue;
      existing.holdings.push(holding);
      existing.returns.push(holding.unrealizedGainPercent);
      
      sectorMap.set(sector, existing);
    });

    const sectorColors = {
      'Technology': 'bg-blue-500',
      'Healthcare': 'bg-green-500',
      'Financial Services': 'bg-purple-500',
      'Consumer Discretionary': 'bg-yellow-500',
      'Consumer Staples': 'bg-orange-500',
      'Communication Services': 'bg-red-500',
      'Other': 'bg-gray-500'
    };

    const sectorDescriptions = {
      'Technology': 'Companies developing technology products and services',
      'Healthcare': 'Medical, pharmaceutical, and biotechnology companies',
      'Financial Services': 'Banks, insurance, investment services',
      'Consumer Discretionary': 'Non-essential consumer goods and services',
      'Consumer Staples': 'Essential consumer goods and services',
      'Communication Services': 'Telecom, media, and entertainment companies',
      'Other': 'Miscellaneous sectors and unclassified holdings'
    };

    const recommendedAllocations = {
      'Technology': 25,
      'Healthcare': 15,
      'Financial Services': 15,
      'Consumer Discretionary': 15,
      'Consumer Staples': 10,
      'Communication Services': 10,
      'Other': 10
    };

    return Array.from(sectorMap.entries()).map(([sector, data]) => {
      const percentage = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
      const avgReturn = data.returns.length > 0 ? data.returns.reduce((sum, ret) => sum + ret, 0) / data.returns.length : 0;
      
      let risk: 'Low' | 'Medium' | 'High' = 'Medium';
      if (sector === 'Consumer Staples' || sector === 'Healthcare') risk = 'Low';
      if (sector === 'Technology' || sector === 'Consumer Discretionary') risk = 'High';

      return {
        sector,
        value: data.value,
        percentage,
        holdings: data.holdings,
        avgReturn,
        risk,
        recommendedAllocation: recommendedAllocations[sector] || 10,
        color: sectorColors[sector] || 'bg-gray-500',
        description: sectorDescriptions[sector] || 'Sector classification pending'
      };
    }).sort((a, b) => b.value - a.value);
  };

  const sectorData = calculateSectorData();

  // Calculate diversification score
  const calculateDiversificationScore = () => {
    const numSectors = sectorData.length;
    const maxConcentration = Math.max(...sectorData.map(s => s.percentage));
    const herfindahlIndex = sectorData.reduce((sum, sector) => sum + Math.pow(sector.percentage / 100, 2), 0);
    
    let score = 85; // Base score
    
    // Penalize concentration
    if (maxConcentration > 50) score -= 30;
    else if (maxConcentration > 35) score -= 15;
    else if (maxConcentration > 25) score -= 5;
    
    // Reward diversification
    if (numSectors >= 6) score += 10;
    else if (numSectors >= 4) score += 5;
    else if (numSectors < 3) score -= 20;
    
    // Herfindahl-Hirschman Index penalty
    if (herfindahlIndex > 0.25) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const diversificationScore = calculateDiversificationScore();

  // Theme classes
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    sectionBg: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200',
    metricBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
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

  const getDiversificationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.cardBg} mb-8`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} flex items-center`}>
          <PieChart className="w-7 h-7 mr-3 text-indigo-600" />
          Sector Analysis X-Ray™
        </h3>
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
            showCalculations 
              ? 'bg-indigo-600 text-white' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showCalculations ? 'Hide' : 'Show'} Calculations
        </button>
      </div>

      {/* Diversification Score */}
      <div className={`rounded-lg p-6 mb-8 transition-all duration-300 ${
        isDarkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-50 to-purple-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>
          Portfolio Diversification Score
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`text-4xl font-bold ${getDiversificationColor(diversificationScore)}`}>
              {diversificationScore}
            </div>
            <div>
              <div className={`font-semibold px-3 py-1 rounded-full text-sm ${
                diversificationScore >= 80 ? 'bg-green-100 text-green-700' :
                diversificationScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {diversificationScore >= 80 ? 'Excellent' : diversificationScore >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
              <div className={`text-xs mt-1 transition-colors duration-300 ${theme.textMuted}`}>
                Based on sector spread and concentration
              </div>
            </div>
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                diversificationScore >= 80 ? 'bg-green-500' :
                diversificationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${diversificationScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 100% TRANSPARENT CALCULATIONS */}
      {showCalculations && (
        <div className={`border-2 border-indigo-500 rounded-lg p-6 mb-8 transition-all duration-300 ${
          isDarkMode ? 'bg-indigo-900 border-indigo-400' : 'bg-indigo-50 border-indigo-500'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-300 ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            🔍 100% Transparent Sector Calculations
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Sector Allocation Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-indigo-600 mb-2">🎯 SECTOR ALLOCATION CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Holdings grouped by sector classification</p>
              {sectorData.slice(0, 3).map((sector, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {sector.sector}: {formatCurrency(sector.value)} ÷ {formatCurrency(totalValue)} = {sector.percentage.toFixed(1)}%
                </p>
              ))}
              <p className="text-xs font-bold text-indigo-600 mt-1">
                Total: {sectorData.length} sectors identified
              </p>
            </div>

            {/* Diversification Score Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-purple-600 mb-2">📊 DIVERSIFICATION SCORE:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Base Score: 85 points</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Sectors: {sectorData.length} (+{sectorData.length >= 6 ? 10 : sectorData.length >= 4 ? 5 : 0} pts)</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Max Concentration: {Math.max(...sectorData.map(s => s.percentage)).toFixed(1)}%</p>
              <p className="text-xs font-bold text-purple-600 mt-1">
                Final Score: {diversificationScore}/100
              </p>
            </div>

            {/* Sector Risk Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-orange-600 mb-2">⚠️ SECTOR RISK ASSESSMENT:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Technology/Discretionary: High Risk</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Healthcare/Staples: Low Risk</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Financial/Other: Medium Risk</p>
              <p className="text-xs font-bold text-orange-600 mt-1">
                Portfolio Risk: {sectorData.filter(s => s.risk === 'High').reduce((sum, s) => sum + s.percentage, 0).toFixed(0)}% High Risk
              </p>
            </div>

            {/* Sector Returns Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-green-600 mb-2">📈 SECTOR PERFORMANCE:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Average returns by sector classification</p>
              {sectorData.slice(0, 2).map((sector, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {sector.sector}: {sector.avgReturn >= 0 ? '+' : ''}{sector.avgReturn.toFixed(1)}%
                </p>
              ))}
              <p className="text-xs font-bold text-green-600 mt-1">
                Best: {sectorData.find(s => s.avgReturn === Math.max(...sectorData.map(d => d.avgReturn)))?.sector}
              </p>
            </div>

            {/* Recommended vs Actual */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-blue-600 mb-2">🎯 ALLOCATION COMPARISON:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Actual vs Recommended allocations</p>
              {sectorData.slice(0, 2).map((sector, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {sector.sector}: {sector.percentage.toFixed(0)}% vs {sector.recommendedAllocation}%
                </p>
              ))}
              <p className="text-xs font-bold text-blue-600 mt-1">
                Deviation analysis complete
              </p>
            </div>

            {/* Holdings Classification */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-teal-600 mb-2">🔍 HOLDINGS CLASSIFICATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Symbol-to-sector mapping algorithm</p>
              {holdings.slice(0, 3).map((holding, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {holding.symbol} → {sectorMapping[holding.symbol] || 'Other'}
                </p>
              ))}
              <p className="text-xs font-bold text-teal-600 mt-1">
                {holdings.length} holdings classified
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Current Allocation */}
        <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
          <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
            Current Sector Allocation
          </h4>
          <div className="space-y-4">
            {sectorData.map((sector, index) => (
              <div 
                key={sector.sector} 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedSector === sector.sector ? 'bg-indigo-100 dark:bg-indigo-900' : ''
                } p-3 rounded-lg`}
                onClick={() => setSelectedSector(selectedSector === sector.sector ? null : sector.sector)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${sector.color}`}></div>
                    <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                      {sector.sector}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getRiskColor(sector.risk)}`}>
                      {sector.risk}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                      {sector.percentage.toFixed(1)}%
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      {formatCurrency(sector.value)}
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`${sector.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(sector.percentage, 100)}%` }}
                  ></div>
                </div>

                {/* Sector details when selected */}
                {selectedSector === sector.sector && (
                  <div className="mt-4 space-y-2">
                    <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      {sector.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Holdings:</span>
                      <span className={`transition-colors duration-300 ${theme.textPrimary}`}>{sector.holdings.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Avg Return:</span>
                      <span className={`${sector.avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sector.avgReturn >= 0 ? '+' : ''}{sector.avgReturn.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Recommended:</span>
                      <span className={`transition-colors duration-300 ${theme.textPrimary}`}>{sector.recommendedAllocation}%</span>
                    </div>
                    <div className="mt-2">
                      <p className={`text-xs transition-colors duration-300 ${theme.textMuted}`}>
                        Holdings: {sector.holdings.map(h => h.symbol).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
          <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary}`}>
            Professional Recommendations
          </h4>
          <div className="space-y-4">
            {sectorData.map((sector) => {
              const deviation = sector.percentage - sector.recommendedAllocation;
              const isOverweight = deviation > 5;
              const isUnderweight = deviation < -5;
              
              if (!isOverweight && !isUnderweight) return null;

              return (
                <div key={sector.sector} className={`p-4 rounded-lg border transition-all duration-300 ${
                  isOverweight 
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700' 
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {isOverweight ? (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      )}
                      <span className={`font-semibold ${isOverweight ? 'text-red-700' : 'text-blue-700'}`}>
                        {sector.sector}
                      </span>
                    </div>
                    <span className={`text-sm ${isOverweight ? 'text-red-600' : 'text-blue-600'}`}>
                      {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                    </span>
                  </div>
                  <p className={`text-sm ${isOverweight ? 'text-red-600' : 'text-blue-600'}`}>
                    {isOverweight 
                      ? `Consider reducing ${sector.sector} allocation from ${sector.percentage.toFixed(1)}% to ~${sector.recommendedAllocation}%`
                      : `Consider increasing ${sector.sector} allocation from ${sector.percentage.toFixed(1)}% to ~${sector.recommendedAllocation}%`
                    }
                  </p>
                </div>
              );
            })}

            {sectorData.every(s => Math.abs(s.percentage - s.recommendedAllocation) <= 5) && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700">Well Balanced</span>
                </div>
                <p className="text-sm text-green-600">
                  Your portfolio allocation is well-balanced across sectors. Consider maintaining current allocation ratios.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sector Performance Summary */}
      <div className={`rounded-lg p-6 transition-all duration-300 ${
        isDarkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-purple-50 to-indigo-50'
      }`}>
        <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>
          Sector Performance Overview
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold transition-colors duration-300 ${theme.textPrimary}`}>
              {sectorData.length}
            </div>
            <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>Total Sectors</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${getDiversificationColor(diversificationScore)}`}>
              {diversificationScore}/100
            </div>
            <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>Diversification</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {sectorData.find(s => s.avgReturn === Math.max(...sectorData.map(d => d.avgReturn)))?.sector || 'N/A'}
            </div>
            <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>Best Sector</div>
          </div>
          <div>
            <div className={`text-lg font-bold transition-colors duration-300 ${theme.textPrimary}`}>
              {Math.max(...sectorData.map(s => s.percentage)).toFixed(0)}%
            </div>
            <div className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>Max Allocation</div>
          </div>
        </div>
      </div>
    </div>
  );
};