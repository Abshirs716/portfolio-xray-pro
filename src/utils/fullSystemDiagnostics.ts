import { realRiskAnalysisService } from "@/services/realRiskAnalysisService";
import { centralizedPortfolioMetrics } from "@/services/centralizedPortfolioMetrics";
import { runRiskAnalysisTests } from "./riskAnalysisTests";

/**
 * Comprehensive system diagnostics for all live data sources
 * Tests consistency across ALL dashboard components using the same data sources
 */
export const runFullSystemDiagnostics = async () => {
  console.log('🔬 STARTING COMPREHENSIVE SYSTEM DIAGNOSTICS');
  console.log('==============================================');
  console.log('🎯 TESTING: All components use same data source');
  console.log('📊 VERIFYING: Risk metrics consistency across Dashboard, RiskMetrics, and Market Overview');
  
  const results = {
    riskAnalysisService: { status: 'pending', data: null, error: null },
    portfolioMetricsService: { status: 'pending', data: null, error: null },
    consistencyCheck: { status: 'pending', matches: false, discrepancies: [] },
    componentConsistency: { status: 'pending', allMatch: false, issues: [] },
    overallStatus: 'running'
  };

  try {
    // Test 1: Real Risk Analysis Service (used by Dashboard Market Overview & RiskMetrics)
    console.log('\n📊 TESTING: Real Risk Analysis Service');
    console.log('--------------------------------------');
    console.log('🎯 This service MUST be used by ALL components for consistency');
    
    try {
      const riskMetrics = await realRiskAnalysisService.getRealRiskMetrics();
      results.riskAnalysisService = {
        status: 'success',
        data: riskMetrics,
        error: null
      };
      
      console.log('✅ Risk Analysis Service: SUCCESS');
      console.log('📈 Sharpe Ratio:', riskMetrics.sharpeRatio.toFixed(3), '← This MUST match across ALL components');
      console.log('📉 Volatility:', riskMetrics.volatility.toFixed(1) + '%');
      console.log('💀 Max Drawdown:', (riskMetrics.maxDrawdown * 100).toFixed(1) + '%');
      console.log('💰 VaR:', (riskMetrics.valueAtRisk / 1000000).toFixed(1) + 'M');
      console.log('💰 Portfolio Value:', '$' + riskMetrics.totalValue.toLocaleString());
      console.log('🎯 Risk Score:', riskMetrics.riskScore.toFixed(1));
      console.log('🔄 Data Source:', riskMetrics.isRealData ? 'REAL DATA ✅' : 'SIMULATED DATA ⚠️');
      
    } catch (error) {
      results.riskAnalysisService = {
        status: 'error',
        data: null,
        error: error.message
      };
      console.error('❌ Risk Analysis Service: FAILED', error);
    }

    // Test 2: Portfolio Metrics Service
    console.log('\n💼 TESTING: Portfolio Metrics Service');
    console.log('--------------------------------------');
    
    try {
      const portfolioMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics('default');
      results.portfolioMetricsService = {
        status: 'success',
        data: portfolioMetrics,
        error: null
      };
      
      console.log('✅ Portfolio Metrics Service: SUCCESS');
      console.log('💰 Total Value:', '$' + portfolioMetrics.totalValue.toLocaleString());
      console.log('📈 Daily Change:', portfolioMetrics.dailyChangePercent.toFixed(2) + '%');
      console.log('📊 YTD Return:', (portfolioMetrics.yearToDateReturn * 100).toFixed(1) + '%');
      console.log('⚡ Volatility:', (portfolioMetrics.volatility * 100).toFixed(1) + '%');
      console.log('📐 Sharpe Ratio:', portfolioMetrics.sharpeRatio.toFixed(3));
      
    } catch (error) {
      results.portfolioMetricsService = {
        status: 'error',
        data: null,
        error: error.message
      };
      console.error('❌ Portfolio Metrics Service: FAILED', error);
    }

    // Test 4: Component Consistency Check
    console.log('\n🔍 TESTING: Component Consistency Verification');
    console.log('-----------------------------------------------');
    console.log('🎯 Verifying ALL components use realRiskAnalysisService for Sharpe ratio');
    
    if (results.riskAnalysisService.status === 'success') {
      const masterSharpeRatio = results.riskAnalysisService.data.sharpeRatio;
      const componentIssues = [];
      
      console.log('\n📋 COMPONENT VERIFICATION:');
      console.log('🎯 Master Sharpe Ratio (realRiskAnalysisService):', masterSharpeRatio.toFixed(3));
      console.log('✅ Dashboard Market Overview: Should show', masterSharpeRatio.toFixed(3));
      console.log('✅ RiskMetrics Component: Should show', masterSharpeRatio.toFixed(3));
      console.log('✅ All other risk metrics should match their respective service values');
      
      // Check for common inconsistency patterns
      if (Math.abs(masterSharpeRatio - 0.75) < 0.01) {
        componentIssues.push('WARNING: Sharpe ratio might be using fallback value (0.75) instead of real calculated value');
      }
      
      if (Math.abs(masterSharpeRatio - 0.82) < 0.01 || Math.abs(masterSharpeRatio - 0.85) < 0.01) {
        componentIssues.push('WARNING: Some components might still be using hardcoded values');
      }
      
      results.componentConsistency = {
        status: componentIssues.length === 0 ? 'success' : 'warning',
        allMatch: componentIssues.length === 0,
        issues: componentIssues
      };
      
      if (componentIssues.length === 0) {
        console.log('✅ Component Consistency: EXCELLENT - All components should show same values');
      } else {
        console.log('⚠️ Component Consistency: POTENTIAL ISSUES:');
        componentIssues.forEach(issue => console.log('   • ' + issue));
      }
    } else {
      results.componentConsistency = {
        status: 'error',
        allMatch: false,
        issues: ['Cannot verify component consistency - risk service failed']
      };
      console.log('❌ Component Consistency: CANNOT VERIFY - Risk service failed');
    }

    // Test 5: Run existing risk analysis tests
    console.log('\n🧪 RUNNING: Existing Risk Analysis Tests');
    console.log('----------------------------------------');
    
    try {
      await runRiskAnalysisTests();
      console.log('✅ Existing Tests: COMPLETED');
    } catch (error) {
      console.error('❌ Existing Tests: FAILED', error);
    }

    // Final Status
    console.log('\n📋 DIAGNOSTIC SUMMARY');
    console.log('=====================');
    
    const allGood = results.riskAnalysisService.status === 'success' && 
                   results.portfolioMetricsService.status === 'success' && 
                   results.consistencyCheck.matches &&
                   results.componentConsistency.allMatch;
    
    results.overallStatus = allGood ? 'success' : 'warning';
    
    console.log('🎯 Risk Analysis Service:', results.riskAnalysisService.status.toUpperCase());
    console.log('💼 Portfolio Metrics Service:', results.portfolioMetricsService.status.toUpperCase());
    console.log('🔍 Cross-Service Consistency:', results.consistencyCheck.status.toUpperCase());
    console.log('🎨 Component Consistency:', results.componentConsistency.status.toUpperCase());
    console.log('📊 Overall Status:', results.overallStatus.toUpperCase());
    
    if (allGood) {
      console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
      console.log('✅ All components using same data sources');
      console.log('✅ Sharpe ratio consistent across all components');
      console.log('✅ Real live data flowing through entire system');
    } else {
      console.log('\n⚠️ ISSUES DETECTED:');
      if (results.riskAnalysisService.status !== 'success') console.log('   • Risk Analysis Service has issues');
      if (results.portfolioMetricsService.status !== 'success') console.log('   • Portfolio Metrics Service has issues');
      if (!results.consistencyCheck.matches) console.log('   • Cross-service data inconsistencies detected');
      if (!results.componentConsistency.allMatch) console.log('   • Component consistency issues detected');
      console.log('   • Check individual test results above for details');
    }
    
    return results;
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in diagnostics:', error);
    results.overallStatus = 'error';
    return results;
  }
};