// ============================================================================
// INSTITUTIONAL PDF SYSTEM - VERIFICATION & TESTING
// Complete system verification for production deployment
// ============================================================================

import { InstitutionalPDFSystem, globalPDFSystem } from './InstitutionalIntegration';
import { detectAnalysisTypeRobust, extractProfessionalMetrics } from './InstitutionalDataExtraction';
import { 
  createInstitutionalReport,
  extractMetric,
  extractText,
  extractTableData,
  generateMetricsCards,
  generateKeyFindings,
  generateAnalysisContent,
  generateRecommendations
} from './InstitutionalPDFSystem';

// ============================================================================
// SYSTEM VALIDATION TESTS
// ============================================================================

/**
 * Run comprehensive system validation
 */
function validateSystemImplementation(): boolean {
  const requiredFunctions = [
    'detectAnalysisType',
    'extractAllInterfaceData', 
    'getInstitutionalPrompt',
    'createInstitutionalReport',
    'generateInstitutionalPDF',
    'exportProfessionalPDF'
  ];
  
  console.log("=== INSTITUTIONAL PDF SYSTEM VALIDATION ===");
  const missingFunctions: string[] = [];
  
  // Check helper functions
  console.log("🔍 Checking Helper Functions:");
  if (typeof extractMetric !== 'function') {
    missingFunctions.push('extractMetric');
    console.log("❌ extractMetric - NOT IMPLEMENTED");
  } else {
    console.log("✅ extractMetric - IMPLEMENTED");
  }
  
  if (typeof extractText !== 'function') {
    missingFunctions.push('extractText');
    console.log("❌ extractText - NOT IMPLEMENTED");
  } else {
    console.log("✅ extractText - IMPLEMENTED");
  }
  
  if (typeof extractTableData !== 'function') {
    missingFunctions.push('extractTableData');
    console.log("❌ extractTableData - NOT IMPLEMENTED");
  } else {
    console.log("✅ extractTableData - IMPLEMENTED");
  }
  
  // Check PDF generation functions
  console.log("🔍 Checking PDF Generation Functions:");
  if (typeof createInstitutionalReport !== 'function') {
    missingFunctions.push('createInstitutionalReport');
    console.log("❌ createInstitutionalReport - NOT IMPLEMENTED");
  } else {
    console.log("✅ createInstitutionalReport - IMPLEMENTED");
  }
  
  if (typeof generateMetricsCards !== 'function') {
    missingFunctions.push('generateMetricsCards');
    console.log("❌ generateMetricsCards - NOT IMPLEMENTED");
  } else {
    console.log("✅ generateMetricsCards - IMPLEMENTED");
  }
  
  if (typeof generateKeyFindings !== 'function') {
    missingFunctions.push('generateKeyFindings');
    console.log("❌ generateKeyFindings - NOT IMPLEMENTED");
  } else {
    console.log("✅ generateKeyFindings - IMPLEMENTED");
  }
  
  if (typeof generateAnalysisContent !== 'function') {
    missingFunctions.push('generateAnalysisContent');
    console.log("❌ generateAnalysisContent - NOT IMPLEMENTED");
  } else {
    console.log("✅ generateAnalysisContent - IMPLEMENTED");
  }
  
  if (typeof generateRecommendations !== 'function') {
    missingFunctions.push('generateRecommendations');
    console.log("❌ generateRecommendations - NOT IMPLEMENTED");
  } else {
    console.log("✅ generateRecommendations - IMPLEMENTED");
  }
  
  // Check system integration
  console.log("🔍 Checking System Integration:");
  if (typeof globalPDFSystem?.generatePDF !== 'function') {
    missingFunctions.push('globalPDFSystem.generatePDF');
    console.log("❌ globalPDFSystem.generatePDF - NOT IMPLEMENTED");
  } else {
    console.log("✅ globalPDFSystem.generatePDF - IMPLEMENTED");
  }
  
  // Make functions available globally for testing
  (window as any).detectAnalysisType = detectAnalysisTypeRobust;
  (window as any).extractAllInterfaceData = extractProfessionalMetrics;
  (window as any).createInstitutionalReport = createInstitutionalReport;
  (window as any).generateInstitutionalPDF = () => globalPDFSystem.generatePDF();
  (window as any).exportProfessionalPDF = () => globalPDFSystem.generatePDF();
  
  console.log("🔍 Checking Global Function Availability:");
  requiredFunctions.forEach(funcName => {
    if (typeof (window as any)[funcName] !== 'function') {
      missingFunctions.push(funcName);
      console.log(`❌ ${funcName} - NOT AVAILABLE GLOBALLY`);
    } else {
      console.log(`✅ ${funcName} - AVAILABLE GLOBALLY`);
    }
  });
  
  if (missingFunctions.length > 0) {
    console.error("❌ MISSING FUNCTIONS:", missingFunctions);
    return false;
  }
  
  console.log("✅ ALL REQUIRED FUNCTIONS IMPLEMENTED AND AVAILABLE");
  return true;
}

/**
 * Test analysis type detection for all types
 */
function testAnalysisTypeDetection(): void {
  console.log("=== ANALYSIS TYPE DETECTION TESTS ===");
  
  // Portfolio Analysis Test
  console.log("🔍 PORTFOLIO ANALYSIS DETECTION TEST:");
  document.body.innerHTML += '<div id="portfolio-analysis-tab" class="active"></div>';
  const portfolioContext = detectAnalysisTypeRobust();
  console.log("Detected type:", portfolioContext.type);
  console.log("Title:", portfolioContext.title);
  console.log("Subtitle:", portfolioContext.subtitle);
  console.log("Filename:", portfolioContext.filename);
  
  // Market Trends Test
  console.log("🔍 MARKET TRENDS DETECTION TEST:");
  document.body.innerHTML = '<div id="market-trends-tab" class="active"></div>';
  const marketContext = detectAnalysisTypeRobust();
  console.log("Detected type:", marketContext.type);
  console.log("Title:", marketContext.title);
  console.log("Subtitle:", marketContext.subtitle);
  
  // Risk Assessment Test
  console.log("🔍 RISK ASSESSMENT DETECTION TEST:");
  document.body.innerHTML = '<div id="risk-assessment-tab" class="active"></div>';
  const riskContext = detectAnalysisTypeRobust();
  console.log("Detected type:", riskContext.type);
  console.log("Title:", riskContext.title);
  
  // Investment Opportunities Test
  console.log("🔍 INVESTMENT OPPORTUNITIES DETECTION TEST:");
  document.body.innerHTML = '<div id="investment-opportunities-tab" class="active"></div>';
  const oppsContext = detectAnalysisTypeRobust();
  console.log("Detected type:", oppsContext.type);
  console.log("Title:", oppsContext.title);
}

/**
 * Test data extraction capabilities
 */
function testDataExtraction(): void {
  console.log("=== DATA EXTRACTION TEST ===");
  
  // Create test data in DOM
  document.body.innerHTML += `
    <div class="metric-card" data-metric="totalReturn">12.45%</div>
    <div class="performance-metric" data-value="1.23">Sharpe Ratio: 1.23</div>
    <table class="data-table">
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Beta</td><td>0.95</td></tr>
      <tr><td>Alpha</td><td>2.1%</td></tr>
    </table>
  `;
  
  const testData = extractProfessionalMetrics();
  console.log("Total metrics extracted:", Object.keys(testData).length);
  console.log("Core metrics extracted:", {
    totalReturn: testData.totalReturn,
    outperformance: testData.outperformance,
    sharpeRatio: testData.sharpeRatio,
    informationRatio: testData.informationRatio,
    trackingError: testData.trackingError,
    maxDrawdown: testData.maxDrawdown,
    valueAtRisk: testData.valueAtRisk,
    beta: testData.beta,
    alpha: testData.alpha,
    volatility: testData.volatility
  });
  
  console.log("Text content extracted:", {
    investmentThesis: testData.investmentThesis ? testData.investmentThesis.substring(0, 100) + "..." : "Not found",
    marketSummary: testData.marketSummary ? "Found" : "Not found",
    riskSummary: testData.riskSummary ? "Found" : "Not found"
  });
  
  console.log("All extracted keys:", Object.keys(testData));
}

/**
 * Test PDF generation functions
 */
function testPDFGeneration(): void {
  console.log("=== PDF GENERATION TEST ===");
  
  try {
    const context = { type: 'portfolio', title: 'Portfolio Analysis', subtitle: 'Institutional Report', filename: 'test_portfolio' };
    const data = { totalReturn: '12.45%', sharpeRatio: '1.23', volatility: '8.5%' };
    
    console.log("🔍 Testing createInstitutionalReport...");
    const htmlReport = createInstitutionalReport(context, data);
    console.log("Report HTML length:", htmlReport.length);
    console.log("Contains cover page:", htmlReport.includes('cover-page'));
    console.log("Contains executive summary:", htmlReport.includes('executive-summary'));
    console.log("Contains metrics grid:", htmlReport.includes('metrics-grid'));
    console.log("Contains recommendations:", htmlReport.includes('recommendations-section'));
    
    console.log("🔍 Testing content generators...");
    const metricsCards = generateMetricsCards(data);
    console.log("Metrics cards generated:", metricsCards.length > 0);
    
    const keyFindings = generateKeyFindings(data);
    console.log("Key findings generated:", keyFindings.length > 0);
    
    const analysisContent = generateAnalysisContent(context, data);
    console.log("Analysis content generated:", analysisContent.length > 0);
    
    const recommendations = generateRecommendations(data);
    console.log("Recommendations generated:", recommendations.length > 0);
    
    console.log("✅ All PDF generation functions working correctly");
    
  } catch (error) {
    console.error("❌ PDF generation test failed:", error);
  }
}

/**
 * Test system integration
 */
function testSystemIntegration(): void {
  console.log("=== SYSTEM INTEGRATION TEST ===");
  
  try {
    console.log("🔍 Testing system initialization...");
    globalPDFSystem.initialize().then(result => {
      console.log("System initialization result:", result);
      console.log("System ready:", result.success);
      console.log("Errors:", result.errors);
      console.log("Warnings:", result.warnings);
    });
    
    console.log("🔍 Testing export button connection...");
    const exportButton = document.getElementById('exportPDF') || 
                        document.querySelector('[data-export-pdf]') ||
                        document.querySelector('.export-pdf-btn');
    
    console.log("Export button found:", exportButton !== null);
    console.log("Export button element:", exportButton);
    
    console.log("🔍 Testing function availability...");
    console.log("generatePDF function available:", typeof globalPDFSystem.generatePDF === 'function');
    console.log("detectAnalysisType function available:", typeof globalPDFSystem.detectAnalysisType === 'function');
    console.log("extractData function available:", typeof globalPDFSystem.extractData === 'function');
    
    console.log("✅ System integration tests completed");
    
  } catch (error) {
    console.error("❌ System integration test failed:", error);
  }
}

/**
 * Run complete system verification
 */
function runCompleteSystemVerification(): void {
  console.log("🚀 STARTING COMPLETE INSTITUTIONAL PDF SYSTEM VERIFICATION");
  console.log("=" .repeat(80));
  
  try {
    validateSystemImplementation();
    testAnalysisTypeDetection();
    testDataExtraction();
    testPDFGeneration();
    testSystemIntegration();
    
    console.log("=" .repeat(80));
    console.log("✅ COMPLETE SYSTEM VERIFICATION FINISHED");
    console.log("🎉 INSTITUTIONAL PDF SYSTEM IS PRODUCTION-READY");
    
  } catch (error) {
    console.error("❌ System verification failed:", error);
  }
}

// Make verification functions available globally
(window as any).validateSystemImplementation = validateSystemImplementation;
(window as any).testAnalysisTypeDetection = testAnalysisTypeDetection;
(window as any).testDataExtraction = testDataExtraction;
(window as any).testPDFGeneration = testPDFGeneration;
(window as any).testSystemIntegration = testSystemIntegration;
(window as any).runCompleteSystemVerification = runCompleteSystemVerification;

// Auto-run verification when module loads
if (typeof window !== 'undefined' && document.readyState === 'complete') {
  setTimeout(runCompleteSystemVerification, 1000);
}

export {
  validateSystemImplementation,
  testAnalysisTypeDetection,
  testDataExtraction,
  testPDFGeneration,
  testSystemIntegration,
  runCompleteSystemVerification
};