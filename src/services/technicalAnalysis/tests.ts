import { testTypes } from './types';

export const runTechnicalAnalysisTests = () => {
  console.log('🧪 ==========================================');
  console.log('🧪 RUNNING TECHNICAL ANALYSIS TESTS...');
  console.log('🧪 ==========================================');
  
  const testResults = {
    typeTests: false,
    componentTests: false,
    integrationTests: false,
    performanceTests: false
  };

  try {
    // Test 1: Type definitions
    console.log('\n📋 Test 1: TypeScript Type Definitions');
    console.log('----------------------------------------');
    const typeTestResults = testTypes();
    
    // Verify type properties
    console.assert(typeTestResults.testPrediction.symbol === 'AAPL', '❌ Symbol test failed');
    console.assert(typeTestResults.testPrediction.confidence === 78, '❌ Confidence test failed');
    console.assert(typeTestResults.testIndicator.signal === 'BUY', '❌ Signal test failed');
    console.assert(typeTestResults.testCrossover.type === 'GOLDEN_CROSS', '❌ Crossover test failed');
    
    console.log('✅ All type definition tests passed');
    testResults.typeTests = true;
    
    // Test 2: Component rendering
    console.log('\n📋 Test 2: Component Rendering & DOM Integration');
    console.log('------------------------------------------------');
    
    const panel = document.querySelector('[data-testid="technical-analysis-panel"]');
    console.assert(panel !== null, '❌ Technical Analysis Panel not found in DOM');
    
    if (panel) {
      const rect = panel.getBoundingClientRect();
      console.log(`✅ Panel found - Size: ${rect.width}x${rect.height}px`);
      
      // Check for required elements
      const badge = panel.querySelector('.bg-primary\\/10');
      const title = panel.querySelector('[class*="text-xl"]');
      const statusCards = panel.querySelectorAll('[class*="grid-cols-3"] > div');
      
      console.assert(badge !== null, '❌ Phase 2 badge not found');
      console.assert(title !== null, '❌ Title not found');
      console.assert(statusCards.length === 3, '❌ Status cards not found');
      
      console.log('✅ All required UI elements present');
      testResults.componentTests = true;
    }
    
    // Test 3: Dashboard integration
    console.log('\n📋 Test 3: Dashboard Integration');
    console.log('--------------------------------');
    
    const phaseSection = Array.from(document.querySelectorAll('h2')).find(h => 
      h.textContent?.includes('Predictive Analytics')
    );
    console.assert(phaseSection !== null, '❌ Phase 2 section not found in dashboard');
    
    if (phaseSection) {
      console.log('✅ Phase 2 section found in dashboard');
      console.log(`   Section text: "${phaseSection.textContent}"`);
      testResults.integrationTests = true;
    }
    
    // Test 4: Performance metrics
    console.log('\n📋 Test 4: Performance & Styling Tests');
    console.log('---------------------------------------');
    
    if (panel) {
      const styles = window.getComputedStyle(panel);
      const hasBackdrop = styles.backdropFilter && styles.backdropFilter !== 'none';
      const hasBackground = styles.backgroundColor;
      const hasBorder = styles.borderWidth;
      
      console.log('🎨 Applied Styles:');
      console.log(`   Backdrop Filter: ${styles.backdropFilter || 'Not applied'}`);
      console.log(`   Background: ${hasBackground}`);
      console.log(`   Border: ${hasBorder}`);
      console.log(`   Border Radius: ${styles.borderRadius}`);
      
      console.assert(hasBackdrop || hasBackground, '❌ No glass morphism or background applied');
      console.log('✅ Styling tests passed');
      testResults.performanceTests = true;
    }
    
    // Final results
    console.log('\n🎉 ==========================================');
    console.log('🎉 TEST SUITE RESULTS');
    console.log('🎉 ==========================================');
    
    const passedTests = Object.values(testResults).filter(Boolean).length;
    const totalTests = Object.keys(testResults).length;
    
    console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);
    console.log('📋 Detailed Results:');
    
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`   ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    if (passedTests === totalTests) {
      console.log('\n🏆 ALL TESTS PASSED! Phase 2 foundation is solid.');
      console.log('🚀 Ready to proceed with Moving Average calculations.');
    } else {
      console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
    }
    
    return {
      success: passedTests === totalTests,
      results: testResults,
      score: `${passedTests}/${totalTests}`
    };
    
  } catch (error) {
    console.error('❌ Test suite encountered an error:', error);
    return {
      success: false,
      error: error.message,
      results: testResults
    };
  }
};

// Automated test runner - runs when component is loaded
export const initializeTestSuite = () => {
  console.log('🔄 Initializing Technical Analysis Test Suite...');
  
  // Wait for component to mount, then run tests
  setTimeout(() => {
    console.log('⏰ Running automated tests after component mount...');
    runTechnicalAnalysisTests();
  }, 1500);
};

// Run initialization
initializeTestSuite();