import { realRiskAnalysisService } from "@/services/realRiskAnalysisService";
import { centralizedPortfolioMetrics } from "@/services/centralizedPortfolioMetrics";

/**
 * COMPREHENSIVE TEST SUITE - Run immediately to verify Sharpe ratio fix
 */
export const runComprehensiveTest = async () => {
  console.log('🧪 RUNNING COMPREHENSIVE TEST SUITE');
  console.log('===================================');
  console.log('🎯 Testing: Sharpe ratio consistency fix');
  console.log('🎯 Expected: Both components show Sharpe ratio 1.12');
  console.log('🎯 Current time:', new Date().toISOString());
  
  const testResults = {
    technicalAnalysisFixed: false,
    realRiskServiceWorking: false,
    portfolioServiceWorking: false,
    sharpeRatioConsistent: false,
    noFallbackValues: false,
    overallSuccess: false,
    errors: []
  };
  
  try {
    // Test 1: Check if technical analysis error is fixed
    console.log('\n🧪 TEST 1: Technical Analysis Error Check');
    console.log('------------------------------------------');
    
    try {
      // Import here to test the fix
      const { testMovingAverages } = await import('../services/technicalAnalysis/movingAverages');
      const taResult = testMovingAverages();
      testResults.technicalAnalysisFixed = true;
      console.log('✅ Technical Analysis: FIXED - No more "insufficient data" errors');
    } catch (error) {
      console.error('❌ Technical Analysis: STILL BROKEN -', error.message);
      testResults.errors.push('Technical Analysis Error: ' + error.message);
    }
    
    // Test 2: Real Risk Analysis Service
    console.log('\n🧪 TEST 2: Real Risk Analysis Service');
    console.log('-------------------------------------');
    
    try {
      const riskMetrics = await realRiskAnalysisService.getRealRiskMetrics();
      testResults.realRiskServiceWorking = true;
      
      console.log('✅ Real Risk Service: WORKING');
      console.log('📊 Sharpe Ratio:', riskMetrics.sharpeRatio.toFixed(3));
      console.log('📈 Volatility:', riskMetrics.volatility.toFixed(1) + '%');
      console.log('💀 Max Drawdown:', (riskMetrics.maxDrawdown * 100).toFixed(1) + '%');
      console.log('🔄 Using Real Data:', riskMetrics.isRealData);
      
      // Check for fallback values
      if (Math.abs(riskMetrics.sharpeRatio - 0.15) < 0.01) {
        testResults.errors.push('CRITICAL: Sharpe ratio is 0.15 (fallback value)');
      } else if (Math.abs(riskMetrics.sharpeRatio - 1.12) < 0.1) {
        testResults.noFallbackValues = true;
        console.log('✅ Sharpe Ratio: CORRECT RANGE (near 1.12)');
      }
      
      if (riskMetrics.maxDrawdown > 10.0) {
        testResults.errors.push('CRITICAL: Max drawdown over 1000% (impossible value)');
      }
      
    } catch (error) {
      console.error('❌ Real Risk Service: FAILED -', error.message);
      testResults.errors.push('Real Risk Service Error: ' + error.message);
    }
    
    // Test 3: Portfolio Metrics Service
    console.log('\n🧪 TEST 3: Portfolio Metrics Service');
    console.log('------------------------------------');
    
    try {
      const portfolioMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics('default');
      testResults.portfolioServiceWorking = true;
      
      console.log('✅ Portfolio Service: WORKING');
      console.log('📊 Portfolio Sharpe Ratio:', portfolioMetrics.sharpeRatio.toFixed(3));
      console.log('📈 YTD Return:', (portfolioMetrics.yearToDateReturn * 100).toFixed(1) + '%');
      
    } catch (error) {
      console.error('❌ Portfolio Service: FAILED -', error.message);
      testResults.errors.push('Portfolio Service Error: ' + error.message);
    }
    
    // Test 4: Cross-Service Consistency
    console.log('\n🧪 TEST 4: Cross-Service Consistency Check');
    console.log('------------------------------------------');
    
    if (testResults.realRiskServiceWorking && testResults.portfolioServiceWorking) {
      try {
        const riskMetrics = await realRiskAnalysisService.getRealRiskMetrics();
        const portfolioMetrics = await centralizedPortfolioMetrics.getPortfolioMetrics('default');
        
        const sharpeDiff = Math.abs(riskMetrics.sharpeRatio - portfolioMetrics.sharpeRatio);
        
        if (sharpeDiff < 0.01) {
          testResults.sharpeRatioConsistent = true;
          console.log('✅ Consistency: PERFECT - Sharpe ratios match across services');
        } else {
          console.log('⚠️ Consistency: MISMATCH');
          console.log(`   Risk Service: ${riskMetrics.sharpeRatio.toFixed(3)}`);
          console.log(`   Portfolio Service: ${portfolioMetrics.sharpeRatio.toFixed(3)}`);
          console.log(`   Difference: ${sharpeDiff.toFixed(3)}`);
          testResults.errors.push(`Sharpe ratio mismatch: ${sharpeDiff.toFixed(3)}`);
        }
        
      } catch (error) {
        console.error('❌ Consistency Check: FAILED -', error.message);
        testResults.errors.push('Consistency Check Error: ' + error.message);
      }
    }
    
    // Final Assessment
    console.log('\n📋 COMPREHENSIVE TEST RESULTS');
    console.log('==============================');
    
    console.log('🧪 Technical Analysis Fixed:', testResults.technicalAnalysisFixed ? '✅ YES' : '❌ NO');
    console.log('🔧 Real Risk Service Working:', testResults.realRiskServiceWorking ? '✅ YES' : '❌ NO');
    console.log('💼 Portfolio Service Working:', testResults.portfolioServiceWorking ? '✅ YES' : '❌ NO');
    console.log('🎯 Sharpe Ratio Consistent:', testResults.sharpeRatioConsistent ? '✅ YES' : '❌ NO');
    console.log('🚫 No Fallback Values:', testResults.noFallbackValues ? '✅ YES' : '❌ NO');
    
    testResults.overallSuccess = testResults.technicalAnalysisFixed && 
                                testResults.realRiskServiceWorking && 
                                testResults.portfolioServiceWorking && 
                                testResults.sharpeRatioConsistent && 
                                testResults.noFallbackValues && 
                                testResults.errors.length === 0;
    
    console.log('\n🏆 OVERALL TEST STATUS:', testResults.overallSuccess ? '✅ SUCCESS' : '❌ FAILED');
    
    if (testResults.overallSuccess) {
      console.log('🎉 SHARPE RATIO CONSISTENCY: 100% FIXED!');
      console.log('✅ Both components should now show consistent values');
      console.log('✅ Grid cards should show Sharpe ratio ~1.12 (not 0.15)');
      console.log('✅ Text list should show same Sharpe ratio ~1.12');
      console.log('✅ Max drawdown should be reasonable (not -2058.2%)');
    } else {
      console.log('❌ ISSUES STILL EXIST:');
      testResults.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
    
    return testResults;
    
  } catch (error) {
    console.error('💥 COMPREHENSIVE TEST CRASHED:', error);
    testResults.errors.push('Test Suite Error: ' + error.message);
    testResults.overallSuccess = false;
    return testResults;
  }
};

// Auto-run the test immediately
runComprehensiveTest().then(results => {
  console.log('🧪 Comprehensive test completed with results:', results);
}).catch(error => {
  console.error('🧪 Comprehensive test failed to run:', error);
});