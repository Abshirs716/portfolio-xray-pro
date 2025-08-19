// src/components/portfolio/PerformanceCharts.tsx - Professional Performance Charts with TRANSPARENCY
import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity, Eye, Calculator, Calendar, Target } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface PerformanceChartsProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

interface ChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
  change?: number;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ holdings, isDarkMode = false }) => {
  const [showCalculations, setShowCalculations] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'allocation' | 'performance' | 'risk'>('allocation');

  const totalValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + holding.costBasis, 0);
  const totalGain = totalValue - totalCost;

  // Generate mock historical performance data (in real app, would come from API)
  const generateHistoricalData = () => {
    const dates = [];
    const values = [];
    const benchmarkValues = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    
    for (let i = 0; i <= 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      
      // Mock portfolio performance with some volatility
      const baseValue = 100000 + (i * 2500); // Growing trend
      const volatility = Math.sin(i * 0.5) * 5000; // Some ups and downs
      values.push(baseValue + volatility);
      
      // Mock benchmark (S&P 500-like performance)
      const benchmarkBase = 100000 + (i * 2000);
      const benchmarkVolatility = Math.sin(i * 0.3) * 3000;
      benchmarkValues.push(benchmarkBase + benchmarkVolatility);
    }
    
    return { dates, values, benchmarkValues };
  };

  const historicalData = generateHistoricalData();

  // Calculate asset allocation data
  const assetAllocationData: ChartData[] = holdings
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 8) // Top 8 holdings
    .map((holding, index) => ({
      label: holding.symbol,
      value: holding.marketValue,
      percentage: (holding.marketValue / totalValue) * 100,
      color: [
        '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', 
        '#EF4444', '#06B6D4', '#84CC16', '#F97316'
      ][index],
      change: holding.unrealizedGainPercent
    }));

  // Add "Others" if there are more than 8 holdings
  if (holdings.length > 8) {
    const othersValue = holdings.slice(8).reduce((sum, h) => sum + h.marketValue, 0);
    const othersChange = holdings.slice(8).reduce((sum, h) => sum + h.unrealizedGainPercent, 0) / holdings.slice(8).length;
    
    assetAllocationData.push({
      label: 'Others',
      value: othersValue,
      percentage: (othersValue / totalValue) * 100,
      color: '#6B7280',
      change: othersChange
    });
  }

  // Performance metrics calculation
  const performanceMetrics = {
    portfolioReturn: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    benchmarkReturn: 15.2, // Mock S&P 500 return
    alpha: 0, // Will calculate below
    beta: 1.12,
    volatility: 15.3,
    sharpeRatio: 1.45,
    maxDrawdown: -12.3,
    winRate: (holdings.filter(h => h.unrealizedGain > 0).length / holdings.length) * 100
  };

  performanceMetrics.alpha = performanceMetrics.portfolioReturn - (performanceMetrics.benchmarkReturn * performanceMetrics.beta);

  // Risk distribution data
  const riskDistributionData: ChartData[] = [
    {
      label: 'Low Risk',
      value: assetAllocationData.filter(item => Math.abs(item.change || 0) < 5).reduce((sum, item) => sum + item.value, 0),
      percentage: 0,
      color: '#10B981'
    },
    {
      label: 'Medium Risk', 
      value: assetAllocationData.filter(item => Math.abs(item.change || 0) >= 5 && Math.abs(item.change || 0) < 15).reduce((sum, item) => sum + item.value, 0),
      percentage: 0,
      color: '#F59E0B'
    },
    {
      label: 'High Risk',
      value: assetAllocationData.filter(item => Math.abs(item.change || 0) >= 15).reduce((sum, item) => sum + item.value, 0),
      percentage: 0,
      color: '#EF4444'
    }
  ];

  // Calculate percentages for risk distribution
  riskDistributionData.forEach(item => {
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
  });

  // Theme classes
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    sectionBg: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200',
    metricBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
    tabActive: isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white',
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

  // Simple SVG Chart Components
  const PieChartSVG: React.FC<{ data: ChartData[]; size: number }> = ({ data, size }) => {
    let cumulativePercentage = 0;
    const radius = size / 2 - 20;
    const centerX = size / 2;
    const centerY = size / 2;

    return (
      <svg width={size} height={size} className="mx-auto">
        {data.map((segment, index) => {
          const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2;
          const endAngle = ((cumulativePercentage + segment.percentage) / 100) * 2 * Math.PI - Math.PI / 2;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = segment.percentage > 50 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          cumulativePercentage += segment.percentage;

          return (
            <path
              key={index}
              d={pathData}
              fill={segment.color}
              stroke={isDarkMode ? '#374151' : '#ffffff'}
              strokeWidth="2"
              className="hover:opacity-80 transition-opacity duration-200"
            />
          );
        })}
        
        {/* Center circle for donut effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill={isDarkMode ? '#1F2937' : '#ffffff'}
          stroke={isDarkMode ? '#374151' : '#E5E7EB'}
          strokeWidth="2"
        />
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className={`text-sm font-bold ${theme.textPrimary}`}
          fill="currentColor"
        >
          Total
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          className={`text-xs ${theme.textSecondary}`}
          fill="currentColor"
        >
          {formatCurrency(totalValue)}
        </text>
      </svg>
    );
  };

  const BarChartSVG: React.FC<{ data: ChartData[]; width: number; height: number }> = ({ data, width, height }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 80) / data.length - 10;
    const chartHeight = height - 60;

    return (
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={index}
            x1={60}
            y1={40 + chartHeight * ratio}
            x2={width - 20}
            y2={40 + chartHeight * ratio}
            stroke={isDarkMode ? '#374151' : '#E5E7EB'}
            strokeWidth="1"
          />
        ))}
        
        {/* Bars */}
        {data.map((bar, index) => {
          const barHeight = (bar.value / maxValue) * chartHeight;
          const x = 60 + index * (barWidth + 10);
          const y = 40 + chartHeight - barHeight;

          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={bar.color}
                className="hover:opacity-80 transition-opacity duration-200"
              />
              <text
                x={x + barWidth / 2}
                y={height - 20}
                textAnchor="middle"
                className={`text-xs ${theme.textSecondary}`}
                fill="currentColor"
              >
                {bar.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className={`text-xs font-bold ${theme.textPrimary}`}
                fill="currentColor"
              >
                {bar.percentage.toFixed(1)}%
              </text>
            </g>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <text
            key={index}
            x={50}
            y={40 + chartHeight * ratio + 5}
            textAnchor="end"
            className={`text-xs ${theme.textSecondary}`}
            fill="currentColor"
          >
            {formatCurrency(maxValue * (1 - ratio))}
          </text>
        ))}
      </svg>
    );
  };

  const LineChartSVG: React.FC<{ width: number; height: number }> = ({ width, height }) => {
    const chartWidth = width - 80;
    const chartHeight = height - 80;
    const maxValue = Math.max(...historicalData.values, ...historicalData.benchmarkValues);
    const minValue = Math.min(...historicalData.values, ...historicalData.benchmarkValues);
    const valueRange = maxValue - minValue;

    const getY = (value: number) => 40 + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    const getX = (index: number) => 60 + (index / (historicalData.values.length - 1)) * chartWidth;

    // Create path strings
    const portfolioPath = historicalData.values.map((value, index) => 
      `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(value)}`
    ).join(' ');

    const benchmarkPath = historicalData.benchmarkValues.map((value, index) => 
      `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(value)}`
    ).join(' ');

    return (
      <svg width={width} height={height} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={`h-${index}`}
            x1={60}
            y1={40 + chartHeight * ratio}
            x2={width - 20}
            y2={40 + chartHeight * ratio}
            stroke={isDarkMode ? '#374151' : '#E5E7EB'}
            strokeWidth="1"
          />
        ))}

        {/* Portfolio line */}
        <path
          d={portfolioPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          className="drop-shadow-sm"
        />

        {/* Benchmark line */}
        <path
          d={benchmarkPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Data points */}
        {historicalData.values.map((value, index) => (
          <circle
            key={`portfolio-${index}`}
            cx={getX(index)}
            cy={getY(value)}
            r="4"
            fill="#3B82F6"
            className="hover:r-6 transition-all duration-200"
          />
        ))}

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <text
            key={index}
            x={50}
            y={40 + chartHeight * ratio + 5}
            textAnchor="end"
            className={`text-xs ${theme.textSecondary}`}
            fill="currentColor"
          >
            {formatCurrency(maxValue - (ratio * valueRange))}
          </text>
        ))}

        {/* X-axis labels */}
        {historicalData.dates.map((date, index) => {
          if (index % 2 === 0) { // Show every other month
            return (
              <text
                key={index}
                x={getX(index)}
                y={height - 20}
                textAnchor="middle"
                className={`text-xs ${theme.textSecondary}`}
                fill="currentColor"
              >
                {date}
              </text>
            );
          }
          return null;
        })}

        {/* Legend */}
        <g transform={`translate(${width - 150}, 60)`}>
          <rect x="0" y="0" width="140" height="60" fill={isDarkMode ? '#1F2937' : '#ffffff'} stroke={isDarkMode ? '#374151' : '#E5E7EB'} strokeWidth="1" rx="5" />
          <line x1="10" y1="20" x2="30" y2="20" stroke="#3B82F6" strokeWidth="3" />
          <text x="35" y="25" className={`text-xs ${theme.textPrimary}`} fill="currentColor">Portfolio</text>
          <line x1="10" y1="40" x2="30" y2="40" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" />
          <text x="35" y="45" className={`text-xs ${theme.textPrimary}`} fill="currentColor">Benchmark</text>
        </g>
      </svg>
    );
  };

  return (
    <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.cardBg} mb-8`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary} flex items-center`}>
          <Activity className="w-7 h-7 mr-3 text-purple-600" />
          Performance Charts X-Ray™
        </h3>
        <button
          onClick={() => setShowCalculations(!showCalculations)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
            showCalculations 
              ? 'bg-purple-600 text-white' 
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showCalculations ? 'Hide' : 'Show'} Calculations
        </button>
      </div>

      {/* 100% TRANSPARENT CALCULATIONS */}
      {showCalculations && (
        <div className={`border-2 border-purple-500 rounded-lg p-6 mb-8 transition-all duration-300 ${
          isDarkMode ? 'bg-purple-900 border-purple-400' : 'bg-purple-50 border-purple-500'
        }`}>
          <h4 className={`text-lg font-bold mb-4 flex items-center transition-colors duration-300 ${theme.textPrimary}`}>
            <Calculator className="w-5 h-5 mr-2" />
            🔍 100% Transparent Chart Calculations
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Asset Allocation Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-purple-600 mb-2">🥧 PIE CHART CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Each slice = (Holding Value ÷ Total Value) × 360°</p>
              {assetAllocationData.slice(0, 3).map((item, index) => (
                <p key={index} className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                  {item.label}: {formatCurrency(item.value)} ÷ {formatCurrency(totalValue)} = {item.percentage.toFixed(1)}%
                </p>
              ))}
              <p className="text-xs font-bold text-purple-600 mt-1">
                Visual: {assetAllocationData[0]?.percentage.toFixed(1)}% = {(assetAllocationData[0]?.percentage * 3.6).toFixed(0)}° slice
              </p>
            </div>

            {/* Performance Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-blue-600 mb-2">📈 PERFORMANCE CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>(Current Value - Cost Basis) ÷ Cost Basis × 100</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Portfolio: {formatCurrency(totalValue)}</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Cost Basis: {formatCurrency(totalCost)}</p>
              <p className="text-xs font-bold text-blue-600 mt-1">
                Return: ({formatCurrency(totalValue)} - {formatCurrency(totalCost)}) ÷ {formatCurrency(totalCost)} = {performanceMetrics.portfolioReturn.toFixed(1)}%
              </p>
            </div>

            {/* Alpha Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-green-600 mb-2">🎯 ALPHA CALCULATION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Portfolio Return - (Benchmark × Beta)</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Portfolio Return: {performanceMetrics.portfolioReturn.toFixed(1)}%</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Benchmark Return: {performanceMetrics.benchmarkReturn}%</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Beta: {performanceMetrics.beta}</p>
              <p className="text-xs font-bold text-green-600 mt-1">
                Alpha: {performanceMetrics.portfolioReturn.toFixed(1)}% - ({performanceMetrics.benchmarkReturn}% × {performanceMetrics.beta}) = {performanceMetrics.alpha.toFixed(1)}%
              </p>
            </div>

            {/* Risk Distribution Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-orange-600 mb-2">⚠️ RISK DISTRIBUTION:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Holdings classified by volatility ranges</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Low Risk: |Return| &lt; 5%</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Medium Risk: 5% &le; |Return| &lt; 15%</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>High Risk: |Return| &ge; 15%</p>
              <p className="text-xs font-bold text-orange-600 mt-1">
                Classification complete: {riskDistributionData.length} risk categories
              </p>
            </div>

            {/* Chart Scaling Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-indigo-600 mb-2">📊 CHART SCALING:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Bar heights scaled to chart dimensions</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Max Value: {formatCurrency(Math.max(...assetAllocationData.map(d => d.value)))}</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Chart Height: 300px</p>
              <p className="text-xs font-bold text-indigo-600 mt-1">
                Scale Factor: 300px ÷ Max Value
              </p>
            </div>

            {/* Historical Data Calculation */}
            <div className={`rounded border p-4 transition-all duration-300 ${theme.calcBg}`}>
              <p className="text-xs font-bold text-teal-600 mb-2">📅 HISTORICAL DATA:</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>12-month performance trajectory</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Data Points: {historicalData.values.length}</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>Start Value: {formatCurrency(historicalData.values[0])}</p>
              <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>End Value: {formatCurrency(historicalData.values[historicalData.values.length - 1])}</p>
              <p className="text-xs font-bold text-teal-600 mt-1">
                12M Return: {(((historicalData.values[historicalData.values.length - 1] - historicalData.values[0]) / historicalData.values[0]) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart Type Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setSelectedChart('allocation')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedChart === 'allocation' ? theme.tabActive : theme.tabInactive
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Asset Allocation
          </button>
          <button
            onClick={() => setSelectedChart('performance')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedChart === 'performance' ? theme.tabActive : theme.tabInactive
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </button>
          <button
            onClick={() => setSelectedChart('risk')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedChart === 'risk' ? theme.tabActive : theme.tabInactive
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Risk Distribution
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            {selectedChart === 'allocation' && (
              <div>
                <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary} text-center`}>
                  Asset Allocation Distribution
                </h4>
                <PieChartSVG data={assetAllocationData} size={400} />
              </div>
            )}

            {selectedChart === 'performance' && (
              <div>
                <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary} text-center`}>
                  12-Month Performance vs Benchmark
                </h4>
                <LineChartSVG width={500} height={300} />
              </div>
            )}

            {selectedChart === 'risk' && (
              <div>
                <h4 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${theme.textPrimary} text-center`}>
                  Risk Distribution Analysis
                </h4>
                <BarChartSVG data={riskDistributionData} width={500} height={300} />
              </div>
            )}
          </div>
        </div>

        {/* Chart Legend & Metrics */}
        <div className="space-y-6">
          {/* Chart Legend */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>
              {selectedChart === 'allocation' ? 'Holdings Breakdown' :
               selectedChart === 'performance' ? 'Performance Metrics' :
               'Risk Categories'}
            </h4>
            
            {selectedChart === 'allocation' && (
              <div className="space-y-3">
                {assetAllocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className={`text-sm transition-colors duration-300 ${theme.textPrimary}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                        {item.percentage.toFixed(1)}%
                      </div>
                      <div className={`text-xs ${(item.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(item.change || 0) >= 0 ? '+' : ''}{(item.change || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedChart === 'performance' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Portfolio Return:</span>
                  <span className={`font-semibold ${performanceMetrics.portfolioReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {performanceMetrics.portfolioReturn >= 0 ? '+' : ''}{performanceMetrics.portfolioReturn.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Benchmark Return:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    +{performanceMetrics.benchmarkReturn}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Alpha:</span>
                  <span className={`font-semibold ${performanceMetrics.alpha >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {performanceMetrics.alpha >= 0 ? '+' : ''}{performanceMetrics.alpha.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Beta:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    {performanceMetrics.beta}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Sharpe Ratio:</span>
                  <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    {performanceMetrics.sharpeRatio}
                  </span>
                </div>
              </div>
            )}

            {selectedChart === 'risk' && (
              <div className="space-y-3">
                {riskDistributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className={`text-sm transition-colors duration-300 ${theme.textPrimary}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                        {item.percentage.toFixed(1)}%
                      </div>
                      <div className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                        {formatCurrency(item.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Insights */}
          <div className={`rounded-lg p-6 transition-all duration-300 ${theme.sectionBg}`}>
            <h4 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>
              Key Insights
            </h4>
            <div className="space-y-3 text-sm">
              {selectedChart === 'allocation' && (
                <>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Top holding represents {assetAllocationData[0]?.percentage.toFixed(1)}% of portfolio
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • {assetAllocationData.length} positions tracked
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Concentration risk: {assetAllocationData[0]?.percentage > 25 ? 'High' : assetAllocationData[0]?.percentage > 15 ? 'Medium' : 'Low'}
                  </p>
                </>
              )}
              
              {selectedChart === 'performance' && (
                <>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Portfolio {performanceMetrics.portfolioReturn > performanceMetrics.benchmarkReturn ? 'outperformed' : 'underperformed'} benchmark by {Math.abs(performanceMetrics.portfolioReturn - performanceMetrics.benchmarkReturn).toFixed(1)}%
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Alpha of {performanceMetrics.alpha.toFixed(1)}% shows {performanceMetrics.alpha > 0 ? 'excess' : 'negative'} returns
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Beta {performanceMetrics.beta > 1 ? 'above' : 'below'} market average
                  </p>
                </>
              )}
              
              {selectedChart === 'risk' && (
                <>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • {riskDistributionData[2]?.percentage.toFixed(0)}% in high-risk assets
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • {riskDistributionData[0]?.percentage.toFixed(0)}% in low-risk assets
                  </p>
                  <p className={`transition-colors duration-300 ${theme.textSecondary}`}>
                    • Risk profile: {riskDistributionData[2]?.percentage > 50 ? 'Aggressive' : riskDistributionData[0]?.percentage > 50 ? 'Conservative' : 'Balanced'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};