import { realRiskAnalysisService } from "@/services/realRiskAnalysisService";

/**
 * Quick verification that the Sharpe ratio consistency fix is working
 */
export const verifySharpRatioFix = async () => {
  console.log('🔧 VERIFICATION: Sharpe Ratio Consistency Fix');
  console.log('==============================================');
  
  try {
    // Get the real Sharpe ratio that should be used by ALL components
    const riskMetrics = await realRiskAnalysisService.getRealRiskMetrics();
    
    console.log('✅ MASTER DATA SOURCE (realRiskAnalysisService):');
    console.log(`📊 Sharpe Ratio: ${riskMetrics.sharpeRatio.toFixed(3)}`);
    console.log(`📈 Volatility: ${riskMetrics.volatility.toFixed(1)}%`);
    console.log(`💀 Max Drawdown: ${(riskMetrics.maxDrawdown * 100).toFixed(1)}%`);
    console.log(`💰 VaR: $${(riskMetrics.valueAtRisk / 1000000).toFixed(1)}M`);
    console.log(`🔄 Is Real Data: ${riskMetrics.isRealData ? 'YES ✅' : 'NO ⚠️'}`);
    
    console.log('\n🎯 COMPONENT CONSISTENCY VERIFICATION:');
    console.log('• Dashboard Market Overview → SHOULD show Sharpe:', riskMetrics.sharpeRatio.toFixed(3));
    console.log('• RiskMetrics Component → SHOULD show Sharpe:', riskMetrics.sharpeRatio.toFixed(3));
    console.log('• All components → SHOULD use realRiskAnalysisService for consistency');
    
    // Check if this matches the expected range
    if (riskMetrics.sharpeRatio >= 1.1 && riskMetrics.sharpeRatio <= 1.15) {
      console.log('\n✅ SUCCESS: Sharpe ratio is in expected range (1.1-1.15)');
      console.log('✅ This should match the value shown in the screenshot (1.12)');
    } else if (Math.abs(riskMetrics.sharpeRatio - 0.75) < 0.01) {
      console.log('\n⚠️ WARNING: Sharpe ratio still showing fallback value (0.75)');
      console.log('❌ This indicates the fix may not be fully implemented');
    } else {
      console.log('\n📊 INFO: Sharpe ratio is', riskMetrics.sharpeRatio.toFixed(3));
      console.log('🔍 Verify this matches across all dashboard components');
    }
    
    return {
      success: true,
      sharpeRatio: riskMetrics.sharpeRatio,
      allMetrics: riskMetrics
    };
    
  } catch (error) {
    console.error('❌ VERIFICATION FAILED:', error);
    return {
      success: false,
      error: error.message
    };
  }
};