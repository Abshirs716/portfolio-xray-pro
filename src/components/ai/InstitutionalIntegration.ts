// ============================================================================
// INSTITUTIONAL PDF SYSTEM - COMPLETE INTEGRATION
// Professional system integration with robust error handling
// ============================================================================

import { detectAnalysisTypeRobust, extractProfessionalMetrics, getAnalysisContext } from './InstitutionalDataExtraction';
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

// Import html2pdf properly as an npm package
import html2pdf from 'html2pdf.js';

// ============================================================================
// MAIN INSTITUTIONAL PDF SYSTEM CLASS
// ============================================================================

/**
 * Complete institutional-grade PDF generation system
 * Designed for Goldman Sachs/BlackRock quality standards
 */
class InstitutionalPDFSystem {
  private initialized: boolean = false;
  private errorHandlers: Array<(error: Error) => void> = [];
  private validationRules: Array<() => boolean> = [];

  constructor() {
    this.setupValidationRules();
    this.setupErrorHandlers();
  }

  /**
   * Initialize the complete PDF system
   */
  async initialize(): Promise<{ success: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      console.log('🚀 Initializing Institutional PDF Generation System...');

      // Check system requirements
      const validation = this.validateSystemRequirements();
      if (!validation.isValid) {
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
      }

      // Initialize components
      this.initializeComponents();

      // Setup global error handling
      this.setupGlobalErrorHandlers();

      // Connect export functionality
      const connectionResult = this.connectExportButton();
      if (!connectionResult.success) {
        warnings.push(...connectionResult.warnings);
      }

      // Register health monitoring
      this.startHealthMonitoring();

      this.initialized = errors.length === 0;

      if (this.initialized) {
        console.log('✅ Institutional PDF System initialized successfully');
      } else {
        console.error('❌ PDF System initialization failed:', errors);
      }

      return { success: this.initialized, errors, warnings };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      errors.push(errorMessage);
      console.error('❌ Critical initialization error:', error);
      return { success: false, errors, warnings };
    }
  }

  /**
   * Detect current analysis type with robust fallbacks
   */
  detectAnalysisType(): any {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return detectAnalysisTypeRobust();
  }

  /**
   * Extract comprehensive data from interface
   */
  extractData(): any {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }
    return extractProfessionalMetrics();
  }

  /**
   * Generate professional PDF report
   */
  async generatePDF(): Promise<void> {
    if (!this.initialized) {
      throw new Error('System not initialized. Call initialize() first.');
    }

    let loadingIndicator: HTMLElement | null = null;

    try {
      console.log('🔄 Starting institutional PDF generation...');

      // Show loading indicator
      loadingIndicator = this.showLoadingIndicator();

      // Get analysis context and data
      const context = this.detectAnalysisType();
      const data = this.extractData();

      console.log('📊 Analysis context obtained:', context.type);
      console.log('📈 Professional metrics extracted:', Object.keys(data).length, 'metrics');

      // Generate institutional report
      const reportHTML = createInstitutionalReport(context, data);
      console.log('📄 Institutional report generated');

      // Configure PDF options for professional output
      const pdfOptions = this.getPDFConfiguration(context);

      // Create and process PDF
      await this.createPDFFromHTML(reportHTML, pdfOptions);

      console.log('✅ PDF generated successfully:', pdfOptions.filename);
      this.showSuccessMessage('Professional PDF report generated successfully!');

    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      this.handlePDFGenerationError(error);
    } finally {
      if (loadingIndicator) {
        this.hideLoadingIndicator(loadingIndicator);
      }
    }
  }

  /**
   * Validate complete system output
   */
  validateOutput(htmlContent: string): boolean {
    const validationChecks = [
      () => htmlContent.length > 10000, // Minimum content length
      () => htmlContent.includes('executive-summary'), // Has executive summary
      () => htmlContent.includes('metrics-grid'), // Has metrics
      () => htmlContent.includes('recommendations-section'), // Has recommendations
      () => htmlContent.includes('institutional'), // Professional terminology
      () => htmlContent.includes('cover-page'), // Has cover page
    ];

    const passedChecks = validationChecks.filter(check => {
      try {
        return check();
      } catch {
        return false;
      }
    }).length;

    const success = passedChecks >= validationChecks.length * 0.8; // 80% pass rate
    console.log(`📊 PDF Quality Validation: ${passedChecks}/${validationChecks.length} checks passed`);
    
    return success;
  }

  // Private implementation methods
  private setupValidationRules(): void {
    this.validationRules = [
      () => !!html2pdf,
      () => typeof document !== 'undefined',
      () => !!document.createElement,
      () => !!window.URL && !!window.Blob
    ];
  }

  private setupErrorHandlers(): void {
    this.errorHandlers = [
      (error) => console.error('PDF System Error:', error),
      (error) => this.reportErrorToMonitoring(error)
    ];
  }

  private validateSystemRequirements(): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check essential requirements
    if (!html2pdf) {
      errors.push('html2pdf.js library not available');
    }

    if (!document.createElement) {
      errors.push('DOM creation capabilities not available');
    }

    if (!window.URL || !window.Blob) {
      errors.push('Browser blob/URL features not supported');
    }

    // Check data availability
    const hasMetrics = document.querySelectorAll('.metric-card, [data-metric], .performance-metric').length > 0;
    if (!hasMetrics) {
      warnings.push('Limited metric data available - PDF will use professional defaults');
    }

    // Check performance constraints
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 2) {
      warnings.push('Low device memory - PDF generation may be slower');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private initializeComponents(): void {
    // Set up performance monitoring
    if (window.performance?.mark) {
      window.performance.mark('institutional-pdf-system-init');
    }

    // Initialize global functions for testing and debugging
    (window as any).institutionalPDFSystem = this;
    (window as any).detectAnalysisType = detectAnalysisTypeRobust;
    (window as any).extractProfessionalMetrics = extractProfessionalMetrics;
    (window as any).createInstitutionalReport = createInstitutionalReport;
    (window as any).generateProfessionalPDF = () => this.generatePDF();

    console.log('🔧 Institutional PDF system components initialized');
  }

  private setupGlobalErrorHandlers(): void {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Unhandled promise rejection in PDF system:', event.reason);
      if (event.reason && String(event.reason).includes('pdf')) {
        this.handlePDFGenerationError(event.reason);
        event.preventDefault();
      }
    });

    window.addEventListener('error', (event) => {
      if (event.error && String(event.error).includes('pdf')) {
        console.error('🚨 PDF system error:', event.error);
        this.handlePDFGenerationError(event.error);
      }
    });
  }

  private connectExportButton(): { success: boolean; warnings: string[] } {
    const warnings: string[] = [];

    try {
      const buttonSelectors = [
        '#exportPDF',
        '[data-export-pdf]',
        '.export-pdf-btn',
        '.pdf-export'
      ];

      let exportButton: HTMLElement | null = null;

      for (const selector of buttonSelectors) {
        exportButton = document.querySelector(selector);
        if (exportButton) {
          console.log(`✅ Export button found with selector: ${selector}`);
          break;
        }
      }

      if (!exportButton) {
        exportButton = this.createExportButton();
        warnings.push('Export button not found - created dynamic button');
      }

      if (exportButton) {
        const newButton = exportButton.cloneNode(true) as HTMLElement;
        exportButton.parentNode?.replaceChild(newButton, exportButton);
        
        newButton.addEventListener('click', async (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          try {
            await this.generatePDF();
          } catch (error) {
            this.handlePDFGenerationError(error);
          }
        });

        console.log('✅ Export button connected successfully');
        return { success: true, warnings };
      }

      warnings.push('Could not establish export button connection');
      return { success: false, warnings };

    } catch (error) {
      console.error('❌ Error connecting export button:', error);
      warnings.push(`Export button connection error: ${error}`);
      return { success: false, warnings };
    }
  }

  private startHealthMonitoring(): void {
    setInterval(() => {
      const validation = this.validateSystemRequirements();
      if (!validation.isValid) {
        console.warn('⚠️ System validation failed:', validation.errors);
      }
    }, 30000);
  }

  private getPDFConfiguration(context: any): any {
    return {
      margin: 0.5,
      filename: `${context.filename}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
  }

  private async createPDFFromHTML(htmlContent: string, options: any): Promise<void> {
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '8.5in';
    tempContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(tempContainer);

    try {
      await html2pdf()
        .set(options)
        .from(tempContainer)
        .save();
    } finally {
      document.body.removeChild(tempContainer);
    }
  }

  private showLoadingIndicator(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = 'pdf-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-family: Inter, sans-serif;
    `;

    const spinner = document.createElement('div');
    spinner.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div style="font-size: 18px; font-weight: 600;">Generating Professional PDF Report...</div>
        <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">This may take a few moments</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    return overlay;
  }

  private hideLoadingIndicator(indicator: HTMLElement): void {
    if (indicator?.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  private showSuccessMessage(message: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      font-family: Inter, sans-serif;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  private handlePDFGenerationError(error: any): void {
    console.error('📄 PDF Generation Error Details:', error);

    let userMessage = 'PDF generation failed. ';
    
    if (error instanceof Error) {
      if (error.message.includes('html2pdf')) {
        userMessage += 'PDF library error. Please refresh the page and try again.';
      } else if (error.message.includes('memory') || error.message.includes('canvas')) {
        userMessage += 'Insufficient memory for PDF generation. Try closing other browser tabs.';
      } else {
        userMessage += 'An unexpected error occurred. Please contact support.';
      }
    } else {
      userMessage += 'Unknown error occurred during PDF generation.';
    }

    this.showErrorMessage(userMessage);
    this.reportErrorToMonitoring(error);
  }

  private showErrorMessage(message: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      font-family: Inter, sans-serif;
      max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  private reportErrorToMonitoring(error: any): void {
    try {
      const errorReport = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userAgent: navigator.userAgent,
        url: window.location.href,
        component: 'InstitutionalPDFSystem'
      };

      console.log('📊 Error report generated:', errorReport);
    } catch (monitoringError) {
      console.warn('⚠️ Could not report error to monitoring:', monitoringError);
    }
  }

  private createExportButton(): HTMLElement {
    const button = document.createElement('button');
    button.id = 'exportPDF';
    button.className = 'export-pdf-btn';
    button.textContent = 'Export PDF';
    button.style.cssText = `
      display: none !important;
      visibility: hidden !important;
      background: linear-gradient(135deg, #0a2472, #1e40af);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(10, 36, 114, 0.3);
    `;

    const locations = ['.analysis-controls', '.export-controls', 'header', 'nav', 'main'];
    
    for (const location of locations) {
      const container = document.querySelector(location);
      if (container) {
        container.appendChild(button);
        break;
      }
    }

    if (!button.parentNode) {
      button.style.position = 'fixed';
      button.style.top = '20px';
      button.style.right = '20px';
      button.style.zIndex = '9999';
      document.body.appendChild(button);
    }

    return button;
  }
}

// Global system instance
const globalPDFSystem = new InstitutionalPDFSystem();

// ============================================================================
// 4. INTEGRATION CODE - COMPLETE IMPLEMENTATION
// ============================================================================

/**
 * Initialize the complete PDF generation system
 */
function initializePDFSystem(): { success: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    console.log('🚀 Initializing Institutional PDF Generation System...');

    // Check for required dependencies
    if (!html2pdf) {
      errors.push('html2pdf.js library not loaded');
    }

    // Validate DOM environment
    if (typeof document === 'undefined') {
      errors.push('DOM environment not available');
    }

    // Check for required permissions
    if (!checkBrowserCapabilities()) {
      warnings.push('Some browser features may not be fully supported');
    }

    // Initialize system components
    initializeSystemComponents();

    // Connect export functionality
    const buttonConnectionResult = connectExportButton();
    if (!buttonConnectionResult.success) {
      warnings.push(...buttonConnectionResult.warnings);
    }

    // Set up global error handlers
    setupGlobalErrorHandlers();

    // Register system validation
    registerSystemValidation();

    if (errors.length === 0) {
      console.log('✅ PDF System initialized successfully');
      return { success: true, errors, warnings };
    } else {
      console.error('❌ PDF System initialization failed:', errors);
      return { success: false, errors, warnings };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    errors.push(errorMessage);
    console.error('❌ Critical initialization error:', error);
    return { success: false, errors, warnings };
  }
}

/**
 * Connect export button with comprehensive error handling
 */
function connectExportButton(): { success: boolean; warnings: string[] } {
  const warnings: string[] = [];

  try {
    // Multiple button selector strategies
    const buttonSelectors = [
      '#exportPDF',
      '[data-export-pdf]',
      '.export-pdf-btn',
      '.pdf-export',
      '[data-action="export-pdf"]',
      'button[title*="Export PDF"]',
      'button[aria-label*="Export PDF"]'
    ];

    let exportButton: HTMLElement | null = null;

    // Find export button using multiple strategies
    for (const selector of buttonSelectors) {
      exportButton = document.querySelector(selector);
      if (exportButton) {
        console.log(`✅ Export button found with selector: ${selector}`);
        break;
      }
    }

    if (!exportButton) {
      // Create export button if not found
      exportButton = createExportButton();
      warnings.push('Export button not found - created dynamic button');
    }

    // Connect the export function
    if (exportButton) {
      // Remove existing listeners
      const newButton = exportButton.cloneNode(true) as HTMLElement;
      exportButton.parentNode?.replaceChild(newButton, exportButton);
      
      // Add new listener with error handling
      newButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        try {
          await exportProfessionalPDF();
        } catch (error) {
          handlePDFGenerationError(error);
        }
      });

      // Add visual feedback
      newButton.addEventListener('mouseenter', () => {
        newButton.style.transform = 'scale(1.05)';
        newButton.style.transition = 'transform 0.2s ease';
      });

      newButton.addEventListener('mouseleave', () => {
        newButton.style.transform = 'scale(1)';
      });

      console.log('✅ Export button connected successfully');
      return { success: true, warnings };
    }

    warnings.push('Could not establish export button connection');
    return { success: false, warnings };

  } catch (error) {
    console.error('❌ Error connecting export button:', error);
    warnings.push(`Export button connection error: ${error}`);
    return { success: false, warnings };
  }
}

/**
 * Main export function that orchestrates the entire PDF generation process
 */
async function exportProfessionalPDF(): Promise<void> {
  let loadingIndicator: HTMLElement | null = null;

  try {
    console.log('🔄 Starting professional PDF export...');

    // Show loading indicator
    loadingIndicator = showLoadingIndicator();

    // Validate system requirements
    const validation = validateSystemRequirements();
    if (!validation.isValid) {
      throw new Error(`System validation failed: ${validation.errors.join(', ')}`);
    }

    // Get analysis context and data
    const context = getAnalysisContext();
    console.log('📊 Analysis context obtained:', context.type);

    // Extract professional metrics
    const data = extractProfessionalMetrics();
    console.log('📈 Professional metrics extracted:', Object.keys(data).length, 'metrics');

    // Generate institutional report HTML
    const reportHTML = createInstitutionalReport(context, data);
    console.log('📄 Institutional report generated');

    // Configure PDF options
    const pdfOptions = {
      margin: 0.5,
      filename: `${context.filename}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    // Create temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = reportHTML;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '8.5in';
    tempContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(tempContainer);

    try {
      // Generate PDF using html2pdf
      await html2pdf()
        .set(pdfOptions)
        .from(tempContainer)
        .save();

      console.log('✅ PDF exported successfully:', pdfOptions.filename);
      showSuccessMessage('PDF exported successfully!');

    } finally {
      // Clean up temporary container
      document.body.removeChild(tempContainer);
    }

  } catch (error) {
    console.error('❌ PDF export failed:', error);
    handlePDFGenerationError(error);
  } finally {
    // Hide loading indicator
    if (loadingIndicator) {
      hideLoadingIndicator(loadingIndicator);
    }
  }
}

// ============================================================================
// 5. ERROR HANDLING AND VALIDATION - COMPLETE IMPLEMENTATION
// ============================================================================

/**
 * Validate system requirements for PDF generation
 */
function validateSystemRequirements(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check html2pdf availability
    if (!html2pdf) {
      errors.push('html2pdf.js library not available');
    }

    // Check DOM capabilities
    if (!document.createElement) {
      errors.push('DOM creation capabilities not available');
    }

    // Check browser features
    if (!window.URL || !window.Blob) {
      errors.push('Browser blob/URL features not supported');
    }

    // Check for required data
    const hasMetrics = document.querySelectorAll('.metric-card, [data-metric], .performance-metric').length > 0;
    if (!hasMetrics) {
      warnings.push('Limited metric data available - PDF will use defaults');
    }

    // Check memory constraints
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 2) {
      warnings.push('Low device memory - PDF generation may be slower');
    }

    // Validate network connectivity for fonts
    if (!navigator.onLine) {
      warnings.push('Offline mode - external fonts may not load');
    }

    console.log(`🔍 System validation completed - Errors: ${errors.length}, Warnings: ${warnings.length}`);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };

  } catch (error) {
    errors.push(`Validation error: ${error}`);
    return { isValid: false, errors, warnings };
  }
}

/**
 * Handle PDF generation errors with user-friendly messages
 */
function handlePDFGenerationError(error: any): void {
  console.error('📄 PDF Generation Error Details:', error);

  let userMessage = 'PDF generation failed. ';
  let technicalDetails = '';

  if (error instanceof Error) {
    technicalDetails = error.message;

    // Provide specific guidance for common errors
    if (error.message.includes('html2pdf')) {
      userMessage += 'PDF library error. Please refresh the page and try again.';
    } else if (error.message.includes('memory') || error.message.includes('canvas')) {
      userMessage += 'Insufficient memory for PDF generation. Try closing other browser tabs.';
    } else if (error.message.includes('network') || error.message.includes('CORS')) {
      userMessage += 'Network error. Please check your internet connection.';
    } else if (error.message.includes('timeout')) {
      userMessage += 'PDF generation timed out. The report may be too large.';
    } else {
      userMessage += 'An unexpected error occurred. Please contact support.';
    }
  } else {
    userMessage += 'Unknown error occurred during PDF generation.';
    technicalDetails = String(error);
  }

  // Show user-friendly error message
  showErrorMessage(userMessage);

  // Log technical details for debugging
  console.group('🔧 Technical Error Details');
  console.error('Error Type:', typeof error);
  console.error('Error Message:', technicalDetails);
  console.error('Stack Trace:', error instanceof Error ? error.stack : 'Not available');
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();

  // Report error to monitoring system (if available)
  reportErrorToMonitoring(error, userMessage);
}

// ============================================================================
// HELPER FUNCTIONS FOR INTEGRATION
// ============================================================================

/**
 * Initialize system components
 */
function initializeSystemComponents(): void {
  // Set up performance monitoring
  if (window.performance && window.performance.mark) {
    window.performance.mark('pdf-system-init-start');
  }

  // Initialize global variables on window object for testing
  (window as any).detectAnalysisType = detectAnalysisTypeRobust;
  (window as any).extractAllInterfaceData = extractProfessionalMetrics;
  (window as any).getInstitutionalPrompt = getInstitutionalPrompt;
  (window as any).createInstitutionalReport = createInstitutionalReport;
  (window as any).generateProfessionalPDF = exportProfessionalPDF;
  (window as any).exportProfessionalPDF = exportProfessionalPDF;

  console.log('🔧 System components initialized');
}

/**
 * Set up global error handlers
 */
function setupGlobalErrorHandlers(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection in PDF system:', event.reason);
    if (event.reason && String(event.reason).includes('pdf')) {
      handlePDFGenerationError(event.reason);
      event.preventDefault();
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    if (event.error && String(event.error).includes('pdf')) {
      console.error('🚨 PDF system error:', event.error);
      handlePDFGenerationError(event.error);
    }
  });
}

/**
 * Register system validation for periodic health checks
 */
function registerSystemValidation(): void {
  // Validate system health every 30 seconds
  setInterval(() => {
    const validation = validateSystemRequirements();
    if (!validation.isValid) {
      console.warn('⚠️ System validation failed:', validation.errors);
    }
  }, 30000);
}

/**
 * Check browser capabilities
 */
function checkBrowserCapabilities(): boolean {
  const requiredFeatures = [
    'querySelector' in document,
    'addEventListener' in window,
    'JSON' in window,
    'Promise' in window,
    'fetch' in window || 'XMLHttpRequest' in window
  ];

  return requiredFeatures.every(feature => feature);
}

/**
 * Create export button if not found
 */
function createExportButton(): HTMLElement {
  const button = document.createElement('button');
  button.id = 'exportPDF';
  button.className = 'export-pdf-btn';
  button.textContent = 'Export PDF';
  button.style.cssText = `
    display: none !important;
    visibility: hidden !important;
    background: linear-gradient(135deg, #0a2472, #1e40af);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(10, 36, 114, 0.3);
  `;

  // Add to page (try multiple locations)
  const locations = [
    '.analysis-controls',
    '.export-controls',
    '.pdf-controls',
    '.action-buttons',
    'header',
    'nav',
    'main'
  ];

  for (const location of locations) {
    const container = document.querySelector(location);
    if (container) {
      container.appendChild(button);
      break;
    }
  }

  // Fallback: add to body
  if (!button.parentNode) {
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    document.body.appendChild(button);
  }

  return button;
}

/**
 * Show loading indicator
 */
function showLoadingIndicator(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'pdf-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    color: white;
    font-family: Inter, sans-serif;
  `;

  const spinner = document.createElement('div');
  spinner.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
      <div style="font-size: 18px; font-weight: 600;">Generating Professional PDF Report...</div>
      <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">This may take a few moments</div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;

  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator(indicator: HTMLElement): void {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

/**
 * Show success message
 */
function showSuccessMessage(message: string): void {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #22c55e;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    font-family: Inter, sans-serif;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

/**
 * Show error message
 */
function showErrorMessage(message: string): void {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    font-family: Inter, sans-serif;
    max-width: 400px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

/**
 * Report error to monitoring system
 */
function reportErrorToMonitoring(error: any, userMessage: string): void {
  try {
    // This would integrate with your monitoring service
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userMessage,
      userAgent: navigator.userAgent,
      url: window.location.href,
      component: 'InstitutionalPDFSystem'
    };

    console.log('📊 Error report generated:', errorReport);
    
    // Send to monitoring service (implement based on your monitoring solution)
    // Example: sendToMonitoring(errorReport);
  } catch (monitoringError) {
    console.warn('⚠️ Could not report error to monitoring:', monitoringError);
  }
}

/**
 * Get institutional prompt (placeholder - should be imported from prompts service)
 */
function getInstitutionalPrompt(type: string): string {
  // This is a placeholder - in real implementation, this would be imported
  const prompts: Record<string, string> = {
    portfolio: 'Generate comprehensive portfolio analysis with risk-adjusted returns, asset allocation insights, and strategic recommendations...',
    market: 'Analyze current market trends, sector performance, and forward-looking opportunities with institutional-grade assessment...',
    risk: 'Conduct thorough risk assessment including VaR analysis, stress testing, and risk mitigation strategies...',
    opportunities: 'Identify strategic investment opportunities with detailed analysis of risk-return profiles and implementation strategies...'
  };
  
  return prompts[type] || prompts.portfolio;
}

// ============================================================================
// MAIN INITIALIZATION AND DEPLOYMENT FUNCTIONS
// ============================================================================

/**
 * Initialize the complete institutional PDF system
 * Call this function to set up the entire system
 */
async function initializeInstitutionalPDFSystem(): Promise<void> {
  try {
    console.log('🚀 Initializing Complete Institutional PDF System...');
    
    // Initialize the main system
    const result = await globalPDFSystem.initialize();
    
    if (result.success) {
      console.log('✅ Institutional PDF System ready for production use');
      
      // Make system available globally for easy access
      (window as any).institutionalPDF = globalPDFSystem;
      (window as any).generateInstitutionalPDF = () => globalPDFSystem.generatePDF();
      
      // Auto-initialize if DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('📄 PDF System auto-connected to DOM');
        });
      }
      
    } else {
      console.error('❌ System initialization failed:', result.errors);
      if (result.warnings.length > 0) {
        console.warn('⚠️ System warnings:', result.warnings);
      }
    }
    
  } catch (error) {
    console.error('❌ Critical system initialization error:', error);
  }
}

/**
 * Quick setup function for immediate use
 */
function setupInstitutionalPDF(): void {
  // Initialize system when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInstitutionalPDFSystem);
  } else {
    initializeInstitutionalPDFSystem();
  }
}

// Auto-initialize if this module is loaded
if (typeof window !== 'undefined') {
  setupInstitutionalPDF();
}

export {
  InstitutionalPDFSystem,
  globalPDFSystem,
  initializeInstitutionalPDFSystem,
  setupInstitutionalPDF,
  initializePDFSystem,
  connectExportButton,
  exportProfessionalPDF,
  validateSystemRequirements,
  handlePDFGenerationError
};