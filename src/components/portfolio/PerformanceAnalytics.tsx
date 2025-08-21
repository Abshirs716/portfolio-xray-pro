import React from 'react';

interface PerformanceAnalyticsProps {
  holdings: any[];
  analytics?: any;
  isDarkMode?: boolean;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ holdings, analytics, isDarkMode = false }) => {
  const theme = {
    bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  // Use real data from backend analytics
  const totalValue = analytics?.total_value || holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const holdingsCount = analytics?.holdings || holdings.length;
  
  // Calculate actual percentages from holdings
  const positiveHoldings = holdings.filter(h => h.marketValue > 0);
  const negativeHoldings = holdings.filter(h => h.marketValue < 0);
  const winRate = positiveHoldings.length / holdings.length * 100;
  
  const avgWinner = positiveHoldings.length > 0 
    ? positiveHoldings.reduce((sum, h) => sum + h.unrealizedGainPercent, 0) / positiveHoldings.length
    : 0;
    
  const avgLoser = negativeHoldings.length > 0
    ? negativeHoldings.reduce((sum, h) => sum + h.unrealizedGainPercent, 0) / negativeHoldings.length
    : 0;

  return (
    <div className={`rounded-xl shadow-lg p-8 border ${theme.bg} ${theme.border}`}>
      <h2 className={`text-2xl font-bold text-center mb-8 ${theme.text}`}>
        Portfolio Performance Summary
      </h2>
      
      <div className="grid grid-cols-4 gap-8">
        <div className="text-center">
          <p className={`text-3xl font-bold ${avgWinner > 0 ? 'text-green-600' : 'text-red-600'}`}>
            +{avgWinner.toFixed(1)}%
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-2`}>Average Return</p>
        </div>
        
        <div className="text-center">
          <p className={`text-3xl font-bold ${theme.text}`}>
            {winRate.toFixed(0)}%
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-2`}>Win Rate</p>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">
            +{Math.abs(avgWinner).toFixed(1)}%
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-2`}>Avg Winner</p>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600">
            {avgLoser.toFixed(1)}%
          </p>
          <p className={`text-sm ${theme.textSecondary} mt-2`}>Avg Loser</p>
        </div>
      </div>
    </div>
  );
};