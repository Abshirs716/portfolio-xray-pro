import React from 'react';
import { TrendingUp, PieChart, Shield, AlertCircle } from 'lucide-react';

interface AnalyticsDisplayProps {
  analytics: any;
  isDarkMode?: boolean;
}

export const AnalyticsDisplay: React.FC<AnalyticsDisplayProps> = ({ analytics, isDarkMode = false }) => {
  if (!analytics) return null;

  const theme = {
    bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Value */}
      <div className={`p-6 rounded-lg shadow-lg border ${theme.bg} ${theme.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${theme.textSecondary}`}>Total Value</p>
            <p className={`text-2xl font-bold ${theme.text}`}>
              ${analytics.total_value?.toLocaleString() || '0'}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>

      {/* Concentration */}
      <div className={`p-6 rounded-lg shadow-lg border ${theme.bg} ${theme.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${theme.textSecondary}`}>Top 3 Concentration</p>
            <p className={`text-2xl font-bold ${theme.text}`}>
              {((analytics.top3_weight || 0) * 100).toFixed(1)}%
            </p>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              Top holding: {((analytics.top1_weight || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <PieChart className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      {/* Diversification */}
      <div className={`p-6 rounded-lg shadow-lg border ${theme.bg} ${theme.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${theme.textSecondary}`}>Diversification Score</p>
            <p className={`text-2xl font-bold ${theme.text}`}>
              {((analytics.diversification_score || 0) * 100).toFixed(0)}%
            </p>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              {analytics.holdings || 0} holdings
            </p>
          </div>
          <Shield className="w-8 h-8 text-purple-500" />
        </div>
      </div>

      {/* Transparency */}
      <div className={`p-6 rounded-lg shadow-lg border ${theme.bg} ${theme.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${theme.textSecondary}`}>Data Quality</p>
            <p className={`text-2xl font-bold ${theme.text}`}>
              {analytics.transparency?.score?.toFixed(0) || 0}%
            </p>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              Priced: {((analytics.transparency?.priced_ratio || 0) * 100).toFixed(0)}%
            </p>
          </div>
          <AlertCircle className="w-8 h-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
};
