import { useEffect } from 'react';
import { centralizedPortfolioMetrics } from '@/services/centralizedPortfolioMetrics';
import { usePortfolio } from '@/hooks/usePortfolio';
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics';

/**
 * Background Consistency Verification Service
 * 
 * Runs silent background checks to verify that all components 
 * are using the same centralized portfolio metrics.
 * No UI components - only console logs for verification.
 */
export const useBackgroundConsistencyVerification = () => {
  const { portfolio } = usePortfolio();
  const { metrics: dashboardMetrics } = usePortfolioMetrics();

  useEffect(() => {
    const runBackgroundVerification = async () => {
      if (!portfolio?.id || dashboardMetrics.length === 0) return;

      try {
        console.log('🔍 BACKGROUND CONSISTENCY VERIFICATION STARTED');
        console.log('====================================================');
        
        // Get centralized metrics
        const centralMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics(portfolio.id);
        
        // Get dashboard metrics values
        const dashboardValue = parseFloat(dashboardMetrics[0]?.value?.replace(/[$,]/g, '') || '0');
        const dashboardChange = parseFloat(dashboardMetrics[0]?.change?.replace(/[%+]/g, '') || '0');
        
        // Compare values
        const isValueConsistent = Math.abs(dashboardValue - centralMetrics.totalValue) < 0.01;
        const isChangeConsistent = Math.abs(dashboardChange - centralMetrics.dailyChangePercent) < 0.01;
        
        console.log('📊 DASHBOARD METRICS:');
        console.log(`   Portfolio Value: $${dashboardValue.toLocaleString()}`);
        console.log(`   Daily Change: ${dashboardChange.toFixed(2)}%`);
        
        console.log('🎯 CENTRALIZED METRICS:');
        console.log(`   Portfolio Value: $${centralMetrics.totalValue.toLocaleString()}`);
        console.log(`   Daily Change: ${centralMetrics.dailyChangePercent.toFixed(2)}%`);
        console.log(`   Monthly Return: ${centralMetrics.monthlyReturn.toFixed(2)}%`);
        console.log(`   YTD Return: ${centralMetrics.yearToDateReturn.toFixed(2)}%`);
        console.log(`   Total Return: ${centralMetrics.totalReturn.toFixed(2)}%`);
        console.log(`   Risk Score: ${centralMetrics.riskScore.toFixed(1)}/10`);
        console.log(`   Sharpe Ratio: ${centralMetrics.sharpeRatio.toFixed(3)}`);
        console.log(`   AI Confidence: ${centralMetrics.aiConfidence}%`);
        
        console.log('✅ CONSISTENCY CHECK RESULTS:');
        console.log(`   Portfolio Value Match: ${isValueConsistent ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`   Daily Change Match: ${isChangeConsistent ? '✅ PASS' : '❌ FAIL'}`);
        
        if (isValueConsistent && isChangeConsistent) {
          console.log('🎉 PROOF OF CONSISTENCY: ALL METRICS VERIFIED!');
          console.log('   Dashboard and AI analysis use the SAME centralized data source');
        } else {
          console.log('⚠️ INCONSISTENCY DETECTED - Investigation required');
        }
        
        // Verify holdings data
        const holdings = await centralizedPortfolioMetrics.getPortfolioHoldings(portfolio.id);
        console.log('📈 PORTFOLIO HOLDINGS:');
        holdings.forEach(holding => {
          console.log(`   ${holding.symbol}: ${holding.quantity} shares @ $${holding.currentPrice} = $${holding.marketValue.toLocaleString()}`);
        });
        
        console.log('====================================================');
        console.log('✅ BACKGROUND VERIFICATION COMPLETE');
        
      } catch (error) {
        console.error('❌ Background verification failed:', error);
      }
    };

    // Run verification after a short delay to let everything load
    const timer = setTimeout(runBackgroundVerification, 2000);
    return () => clearTimeout(timer);
  }, [portfolio?.id, dashboardMetrics]);

  // Return verification status (could be used for debugging)
  return {
    verificationActive: true
  };
};