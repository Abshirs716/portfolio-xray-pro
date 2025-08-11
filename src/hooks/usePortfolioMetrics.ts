import { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { centralizedPortfolioMetrics } from '@/services/centralizedPortfolioMetrics';

interface PortfolioMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export const usePortfolioMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { portfolio } = usePortfolio();
  
  const [metrics, setMetrics] = useState<PortfolioMetric[]>([
    { title: "Portfolio Value", value: "$0", change: "0%", trend: "neutral" },
    { title: "Daily Change", value: "$0", change: "0%", trend: "neutral" },
    { title: "Monthly Return", value: "0%", change: "0%", trend: "neutral" },
    { title: "AI Confidence", value: "0%", change: "High", trend: "neutral" },
    { title: "Risk Score", value: "0/10", change: "Medium", trend: "neutral" }
  ]);

  useEffect(() => {
    const loadCentralizedMetrics = async () => {
      if (!portfolio?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('🔄 Loading centralized portfolio metrics for:', portfolio.id);
        
        // Get metrics from centralized service
        const portfolioMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics(portfolio.id);
        
        // Update portfolio history
        await centralizedPortfolioMetrics.updatePortfolioHistory(portfolio.id, portfolioMetrics);
        
        console.log('✅ Centralized portfolio metrics loaded:', portfolioMetrics);
        
        // Format metrics for display
        const formattedMetrics: PortfolioMetric[] = [
          { 
            title: "Portfolio Value", 
            value: `$${portfolioMetrics.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, 
            change: `${portfolioMetrics.dailyChangePercent >= 0 ? '+' : ''}${portfolioMetrics.dailyChangePercent.toFixed(2)}%`, 
            trend: portfolioMetrics.dailyChangePercent > 0 ? "up" : portfolioMetrics.dailyChangePercent < 0 ? "down" : "neutral" 
          },
          { 
            title: "Daily Change", 
            value: `${portfolioMetrics.dailyChange >= 0 ? '+' : ''}$${Math.abs(portfolioMetrics.dailyChange).toLocaleString('en-US', { maximumFractionDigits: 2 })}`, 
            change: `${portfolioMetrics.dailyChangePercent >= 0 ? '+' : ''}${portfolioMetrics.dailyChangePercent.toFixed(2)}%`, 
            trend: portfolioMetrics.dailyChangePercent > 0 ? "up" : portfolioMetrics.dailyChangePercent < 0 ? "down" : "neutral" 
          },
          { 
            title: "Monthly Return", 
            value: `${portfolioMetrics.monthlyReturn >= 0 ? '+' : ''}${portfolioMetrics.monthlyReturn.toFixed(2)}%`, 
            change: `${Math.abs(portfolioMetrics.monthlyReturn).toFixed(1)}% ${portfolioMetrics.monthlyReturn >= 0 ? 'gain' : 'loss'}`, 
            trend: portfolioMetrics.monthlyReturn > 0 ? "up" : portfolioMetrics.monthlyReturn < 0 ? "down" : "neutral" 
          },
          { 
            title: "AI Confidence", 
            value: `${portfolioMetrics.aiConfidence.toFixed(0)}%`, 
            change: portfolioMetrics.aiConfidence > 85 ? "Very High" : portfolioMetrics.aiConfidence > 75 ? "High" : "Medium", 
            trend: portfolioMetrics.aiConfidence > 80 ? "up" : portfolioMetrics.aiConfidence > 60 ? "neutral" : "down" 
          },
          { 
            title: "Risk Score", 
            value: `${portfolioMetrics.riskScore.toFixed(1)}/10`, 
            change: portfolioMetrics.riskScore < 3 ? "Low Risk" : portfolioMetrics.riskScore < 6 ? "Medium Risk" : "High Risk", 
            trend: portfolioMetrics.riskScore < 4 ? "up" : portfolioMetrics.riskScore < 7 ? "neutral" : "down" 
          }
        ];
        
        setMetrics(formattedMetrics);
        
        // Diagnostic logging
        console.log('📊 CENTRALIZED METRICS DIAGNOSTIC:');
        console.log('Portfolio Value:', formattedMetrics[0].value, formattedMetrics[0].change);
        console.log('Daily Change:', formattedMetrics[1].value, formattedMetrics[1].change);
        console.log('Monthly Return:', formattedMetrics[2].value, formattedMetrics[2].change);
        console.log('AI Confidence:', formattedMetrics[3].value, formattedMetrics[3].change);
        
      } catch (error) {
        console.error('❌ Failed to load centralized portfolio metrics:', error);
        
        // 🚨 NO FALLBACKS - NO FAKE DATA ALLOWED
        console.error('❌ NO FALLBACKS - Cannot load metrics without real data');
        setMetrics([
          {
            title: "Portfolio Value",
            value: "Data Unavailable", 
            change: "Upload CSV", 
            trend: "neutral" as const
          },
          {
            title: "Daily Change",
            value: "Data Unavailable", 
            change: "Upload CSV", 
            trend: "neutral" as const
          },
          {
            title: "Monthly Return",
            value: "Data Unavailable", 
            change: "Upload CSV",
            trend: "neutral" as const
          },
          {
            title: "AI Confidence",
            value: "Data Unavailable",
            change: "Upload CSV",
            trend: "neutral" as const
          },
          {
            title: "Risk Score",
            value: "Data Unavailable",
            change: "Upload CSV",
            trend: "neutral" as const
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load metrics when portfolio changes
    if (portfolio?.id) {
      loadCentralizedMetrics();
    }
  }, [portfolio?.id]);

  return { metrics, portfolio, isLoading };
};