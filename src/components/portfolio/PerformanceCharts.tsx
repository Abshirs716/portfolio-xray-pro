import React from 'react';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';

interface PerformanceChartsProps {
  holdings: any[];
  isDarkMode?: boolean;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ holdings, isDarkMode = false }) => {
  const theme = {
    bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  // Calculate real metrics from holdings
  const totalValue = holdings.reduce((sum, h) => sum + (h.marketValue || 0), 0);
  const topHolding = holdings[0];
  const avgPrice = holdings.reduce((sum, h) => sum + (h.currentPrice || 0), 0) / holdings.length;

  return (
    <div className={`rounded-xl shadow-lg p-6 border ${theme.bg} ${theme.border}`}>
      <h3 className={`text-lg font-semibold mb-6 ${theme.text}`}>Performance Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className={`p-4 rounded-lg border ${theme.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textSecondary}`}>Portfolio Value</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className={`text-2xl font-bold ${theme.text}`}>
            ${totalValue.toLocaleString()}
          </p>
          <p className={`text-xs ${theme.textSecondary} mt-1`}>
            Across {holdings.length} holdings
          </p>
        </div>

        {/* Top Holding */}
        <div className={`p-4 rounded-lg border ${theme.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textSecondary}`}>Top Holding</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${theme.text}`}>
            {topHolding?.symbol || 'N/A'}
          </p>
          <p className={`text-xs ${theme.textSecondary} mt-1`}>
            ${topHolding?.marketValue?.toLocaleString() || 0}
          </p>
        </div>

        {/* Average Price */}
        <div className={`p-4 rounded-lg border ${theme.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${theme.textSecondary}`}>Avg Price</span>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <p className={`text-2xl font-bold ${theme.text}`}>
            ${avgPrice.toFixed(2)}
          </p>
          <p className={`text-xs ${theme.textSecondary} mt-1`}>
            Per share average
          </p>
        </div>
      </div>

      {/* Holdings Bar Chart */}
      <div className="mt-6">
        <h4 className={`text-sm font-semibold mb-3 ${theme.text}`}>Holdings Distribution</h4>
        <div className="space-y-2">
          {holdings.slice(0, 5).map((holding, idx) => {
            const percentage = (holding.marketValue / totalValue) * 100;
            return (
              <div key={idx} className="flex items-center gap-3">
                <span className={`text-xs w-16 ${theme.textSecondary}`}>{holding.symbol}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.abs(percentage)}%` }}
                  />
                  <span className={`absolute inset-0 flex items-center px-2 text-xs font-medium ${percentage > 20 ? 'text-white' : theme.text}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <span className={`text-xs w-20 text-right ${theme.textSecondary}`}>
                  ${holding.marketValue.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
