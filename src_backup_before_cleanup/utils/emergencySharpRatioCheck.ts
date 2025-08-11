import { realRiskAnalysisService } from "@/services/realRiskAnalysisService";
import { centralizedPortfolioMetrics } from "@/services/centralizedPortfolioMetrics";

/**
 * Force run diagnostic check to verify Sharpe ratio consistency fix is working
 */
export const verifySharpRatioConsistencyFix = async () => {
  console.log('🚨 EMERGENCY SHARPE RATIO CONSISTENCY CHECK');
  console.log('===========================================');
  
  try {
    // Get the master risk metrics that should be used everywhere
    const masterRiskMetrics = await realRiskAnalysisService.getRealRiskMetrics();
    
    console.log('✅ MASTER RISK METRICS (realRiskAnalysisService):');
    console.log(`📊 Sharpe Ratio: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
    console.log(`📈 Volatility: ${masterRiskMetrics.volatility.toFixed(1)}%`);
    console.log(`💀 Max Drawdown: ${(masterRiskMetrics.maxDrawdown * 100).toFixed(1)}%`);
    console.log(`💰 VaR: ${masterRiskMetrics.valueAtRisk.toFixed(1)}`);
    console.log(`🔄 Is Real Data: ${masterRiskMetrics.isRealData}`);
    
    // Check portfolio metrics for YTD return
    const portfolioMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics('default');
    console.log('\n💼 Portfolio Performance Metrics:');
    console.log(`📈 YTD Return: ${(portfolioMetrics.yearToDateReturn * 100).toFixed(1)}%`);
    console.log(`📊 Portfolio Sharpe Ratio: ${portfolioMetrics.sharpeRatio.toFixed(3)}`);
    
    // Consistency check
    const sharpeRatioDiff = Math.abs(masterRiskMetrics.sharpeRatio - portfolioMetrics.sharpeRatio);
    
    console.log('\n🔍 CONSISTENCY ANALYSIS:');
    console.log(`🎯 Expected Sharpe Ratio: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
    console.log(`📋 Dashboard Market Overview should show: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
    console.log(`📋 RiskMetrics Component should show: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
    console.log(`📋 Risk-Adjusted Performance should show: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
    
    if (sharpeRatioDiff < 0.01) {
      console.log('✅ SHARPE RATIO CONSISTENCY: PERFECT MATCH!');
    } else {
      console.log('⚠️ SHARPE RATIO INCONSISTENCY DETECTED:');
      console.log(`   • Risk Service: ${masterRiskMetrics.sharpeRatio.toFixed(3)}`);
      console.log(`   • Portfolio Service: ${portfolioMetrics.sharpeRatio.toFixed(3)}`);
      console.log(`   • Difference: ${sharpeRatioDiff.toFixed(3)}`);
    }
    
    // Check for problematic values
    const issues = [];
    
    if (Math.abs(masterRiskMetrics.sharpeRatio - 0.15) < 0.01) {
      issues.push('❌ CRITICAL: Sharpe ratio is 0.15 (extremely poor value)');
    }
    
    if (Math.abs(masterRiskMetrics.sharpeRatio - 0.75) < 0.01) {
      issues.push('⚠️ WARNING: Sharpe ratio is 0.75 (may be fallback value)');
    }
    
    if (masterRiskMetrics.maxDrawdown > 1.0) {
      issues.push('❌ CRITICAL: Max drawdown over 100% (impossible value)');
    }
    
    if (masterRiskMetrics.volatility > 100) {
      issues.push('❌ CRITICAL: Volatility over 100% (unrealistic)');
    }
    
    console.log('\n🚨 ISSUE DETECTION:');
    if (issues.length === 0) {
      console.log('✅ NO CRITICAL ISSUES DETECTED');
      console.log('✅ All values appear reasonable and consistent');
    } else {
      console.log('❌ CRITICAL ISSUES FOUND:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    console.log('\n📋 FINAL STATUS:');
    if (issues.length === 0 && sharpeRatioDiff < 0.01) {
      console.log('🎉 CONSISTENCY FIX: SUCCESS!');
      console.log('✅ All components should now show consistent values');
    } else {
      console.log('❌ CONSISTENCY FIX: STILL HAS ISSUES');
      console.log('🔧 Further debugging needed');
    }
    
    return {
      success: issues.length === 0 && sharpeRatioDiff < 0.01,
      masterSharpeRatio: masterRiskMetrics.sharpeRatio,
      portfolioSharpeRatio: portfolioMetrics.sharpeRatio,
      issues,
      allMetrics: {
        risk: masterRiskMetrics,
        portfolio: portfolioMetrics
      }
    };
    
  } catch (error) {
    console.error('❌ EMERGENCY CHECK FAILED:', error);
    return {
      success: false,
      error: error.message
    };
  }
};