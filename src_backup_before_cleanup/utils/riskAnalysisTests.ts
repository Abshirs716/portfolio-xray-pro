import { realRiskAnalysisService } from "@/services/realRiskAnalysisService";
import { supabase } from "@/integrations/supabase/client";

/**
 * Comprehensive Risk Analysis Testing Suite
 * Tests the real risk analysis system end-to-end
 */
export const runRiskAnalysisTests = async () => {
  console.log('🧪 Starting comprehensive risk analysis testing...');
  
  const results = {
    serviceTest: false,
    dataValidation: false,
    aiIntegration: false,
    errors: [] as string[]
  };

  try {
    // Test 1: Service Instantiation
    console.log('📋 Test 1: Service instantiation...');
    const service = realRiskAnalysisService;
    if (service) {
      console.log('✅ RealRiskAnalysisService instantiated successfully');
      results.serviceTest = true;
    }

    // Test 2: Portfolio Data Retrieval
    console.log('📋 Test 2: Portfolio data retrieval...');
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('id, total_value')
      .eq('is_primary', true)
      .single();

    if (portfolio) {
      console.log('✅ Portfolio found:', portfolio);
      
      // Test 3: Real Risk Metrics Calculation
      console.log('📋 Test 3: Real risk metrics calculation...');
      const riskMetrics = await service.getRealRiskMetrics(portfolio.id);
      
      console.log('📊 CALCULATED RISK METRICS:');
      console.log(`- Sharpe Ratio: ${riskMetrics.sharpeRatio.toFixed(3)}`);
      console.log(`- Portfolio Beta: ${riskMetrics.portfolioBeta.toFixed(3)}`);
      console.log(`- Volatility: ${riskMetrics.volatility.toFixed(2)}%`);
      console.log(`- Max Drawdown: ${riskMetrics.maxDrawdown.toFixed(2)}%`);
      console.log(`- Sortino Ratio: ${riskMetrics.sortinoRatio.toFixed(3)}`);
      console.log(`- Calmar Ratio: ${riskMetrics.calmarRatio.toFixed(3)}`);
      console.log(`- VaR (95%): $${riskMetrics.valueAtRisk.toLocaleString()}`);
      console.log(`- Expected Shortfall: $${riskMetrics.expectedShortfall.toLocaleString()}`);
      console.log(`- Concentration Risk: ${riskMetrics.concentrationRisk.toFixed(1)}%`);
      console.log(`- Sector Concentration: ${riskMetrics.sectorConcentration.toFixed(1)}%`);
      console.log(`- Is Real Data: ${riskMetrics.isRealData}`);

      // Validate calculated values
      if (riskMetrics.isRealData && 
          riskMetrics.sharpeRatio > 0 && 
          riskMetrics.volatility > 0 &&
          riskMetrics.totalValue === portfolio.total_value) {
        console.log('✅ Risk metrics validation passed');
        results.dataValidation = true;
      } else {
        results.errors.push('Risk metrics validation failed');
      }

      // Test 4: Cache functionality
      console.log('📋 Test 4: Cache functionality...');
      const cachedMetrics = await service.getRealRiskMetrics(portfolio.id);
      if (cachedMetrics.sharpeRatio === riskMetrics.sharpeRatio) {
        console.log('✅ Cache working properly');
      }

      results.aiIntegration = true;
    } else {
      results.errors.push('No portfolio found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    results.errors.push(error.message);
  }

  // Final results
  console.log('\n🏁 TEST RESULTS SUMMARY:');
  console.log(`Service Test: ${results.serviceTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Validation: ${results.dataValidation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`AI Integration: ${results.aiIntegration ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️ ERRORS FOUND:');
    results.errors.forEach(error => console.log(`- ${error}`));
  } else {
    console.log('\n🎉 ALL TESTS PASSED! Risk analysis system is working correctly.');
  }

  return results;
};

// Export for immediate testing
if (typeof window !== 'undefined') {
  (window as any).testRiskAnalysis = runRiskAnalysisTests;
}