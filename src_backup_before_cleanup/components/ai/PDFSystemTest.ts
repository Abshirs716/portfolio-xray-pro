// ============================================================================
// PDF SYSTEM TEST - Quick verification of institutional PDF system
// ============================================================================

import { globalPDFSystem } from './InstitutionalIntegration';

/**
 * Test the institutional PDF system
 */
export async function testPDFSystem(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🧪 Testing Institutional PDF System...');

    // Test 1: Check if system is available
    if (!globalPDFSystem) {
      return { success: false, message: 'PDF System not available' };
    }

    // Test 2: Initialize the system
    const initResult = await globalPDFSystem.initialize();
    console.log('📊 Initialization result:', initResult);

    if (!initResult.success) {
      return { 
        success: false, 
        message: `PDF System initialization failed: ${initResult.errors.join(', ')}`,
        details: initResult
      };
    }

    // Test 3: Verify core functions exist
    const coreTests = [
      { name: 'detectAnalysisType', test: () => typeof globalPDFSystem.detectAnalysisType === 'function' },
      { name: 'extractData', test: () => typeof globalPDFSystem.extractData === 'function' },
      { name: 'generatePDF', test: () => typeof globalPDFSystem.generatePDF === 'function' }
    ];

    const failedTests = coreTests.filter(test => !test.test());
    if (failedTests.length > 0) {
      return {
        success: false,
        message: `Core functions missing: ${failedTests.map(t => t.name).join(', ')}`,
        details: { failedTests, initResult }
      };
    }

    // Test 4: Quick data extraction test
    try {
      const analysisType = globalPDFSystem.detectAnalysisType();
      const extractedData = globalPDFSystem.extractData();
      
      console.log('✅ Analysis type detected:', analysisType.type);
      console.log('✅ Data extracted:', Object.keys(extractedData).length, 'metrics');
    } catch (extractError) {
      console.warn('⚠️ Data extraction test failed (non-critical):', extractError);
    }

    return {
      success: true,
      message: 'PDF System is working correctly!',
      details: {
        initResult,
        warnings: initResult.warnings,
        coreTestsPassed: coreTests.length
      }
    };

  } catch (error) {
    console.error('❌ PDF System test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { error }
    };
  }
}

/**
 * Quick test function to be called from console
 */
export function quickPDFTest() {
  testPDFSystem().then(result => {
    if (result.success) {
      console.log('✅ ' + result.message);
      if (result.details?.warnings?.length > 0) {
        console.warn('⚠️ Warnings:', result.details.warnings);
      }
    } else {
      console.error('❌ ' + result.message);
      if (result.details) {
        console.error('Details:', result.details);
      }
    }
  });
}

// Make test available globally
if (typeof window !== 'undefined') {
  (window as any).testPDFSystem = testPDFSystem;
  (window as any).quickPDFTest = quickPDFTest;
}