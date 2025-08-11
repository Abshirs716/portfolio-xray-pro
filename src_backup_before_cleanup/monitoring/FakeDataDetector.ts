/**
 * 🔥 FAKE DATA DETECTOR - RUNTIME MONITORING SYSTEM
 * 
 * This system continuously monitors the application for fake data patterns
 * and alerts developers when fake data is detected.
 */

export interface FakeDataAlert {
  timestamp: string;
  type: 'DOM_CONTENT' | 'API_RESPONSE' | 'COMPONENT_PROP' | 'CONSOLE_LOG';
  pattern: string;
  content: string;
  location: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class FakeDataDetector {
  private alerts: FakeDataAlert[] = [];
  private isMonitoring = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Patterns that indicate fake data
  private readonly FAKE_DATA_PATTERNS = [
    // NVIDIA specific patterns
    { pattern: /\$1\.0B.*NVDA/gi, severity: 'HIGH' as const, description: 'NVIDIA $1B market cap' },
    { pattern: /\$3\.000T.*NVDA/gi, severity: 'MEDIUM' as const, description: 'NVIDIA exactly $3T (suspicious)' },
    
    // General fake patterns
    { pattern: /market cap:.*000000000000\b/gi, severity: 'HIGH' as const, description: 'Market cap with too many zeros' },
    { pattern: /\(fallback\)/gi, severity: 'HIGH' as const, description: 'Fallback data indicator' },
    { pattern: /\(hardcoded\)/gi, severity: 'HIGH' as const, description: 'Hardcoded data indicator' },
    { pattern: /\(simulated\)/gi, severity: 'HIGH' as const, description: 'Simulated data indicator' },
    { pattern: /\(approximation\)/gi, severity: 'MEDIUM' as const, description: 'Approximated data' },
    { pattern: /\(estimated\)/gi, severity: 'MEDIUM' as const, description: 'Estimated data' },
    { pattern: /placeholder/gi, severity: 'HIGH' as const, description: 'Placeholder data' },
    
    // Suspicious round numbers
    { pattern: /\$100\.00.*NVDA/gi, severity: 'HIGH' as const, description: 'Suspiciously round NVIDIA price' },
    { pattern: /\$150\.00.*AAPL/gi, severity: 'MEDIUM' as const, description: 'Suspiciously round Apple price' },
    
    // Source indicators
    { pattern: /source:\s*["']fallback["']/gi, severity: 'HIGH' as const, description: 'Fallback source' },
    { pattern: /source:\s*["']mock["']/gi, severity: 'HIGH' as const, description: 'Mock source' },
    { pattern: /source:\s*["']test["']/gi, severity: 'HIGH' as const, description: 'Test source' },
  ];

  static startMonitoring(): FakeDataDetector {
    const detector = new FakeDataDetector();
    detector.start();
    return detector;
  }

  start(): void {
    if (this.isMonitoring) {
      console.log('🔍 Fake data detector already running');
      return;
    }

    console.log('🔍 Starting fake data detection monitoring...');
    this.isMonitoring = true;

    // Monitor DOM changes
    this.monitorDOM();
    
    // Monitor console output
    this.monitorConsole();
    
    // Monitor network responses (if possible)
    this.monitorNetwork();
    
    // Periodic comprehensive scan
    this.intervalId = setInterval(() => {
      this.performComprehensiveScan();
    }, 10000); // Every 10 seconds
  }

  stop(): void {
    if (!this.isMonitoring) return;

    console.log('🔍 Stopping fake data detection monitoring');
    this.isMonitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private monitorDOM(): void {
    if (typeof document === 'undefined') return;

    // Monitor DOM mutations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanElement(node as Element);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial scan
    this.scanElement(document.body);
  }

  private scanElement(element: Element): void {
    const text = element.textContent || '';
    
    this.FAKE_DATA_PATTERNS.forEach(({ pattern, severity, description }) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          this.recordAlert({
            type: 'DOM_CONTENT',
            pattern: pattern.toString(),
            content: match,
            location: this.getElementLocation(element),
            severity
          });
        });
      }
    });
  }

  private monitorConsole(): void {
    if (typeof console === 'undefined') return;

    // Intercept console.log, console.warn, console.error
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args: any[]) => {
      this.scanConsoleOutput('log', args);
      originalLog.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      this.scanConsoleOutput('warn', args);
      originalWarn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      this.scanConsoleOutput('error', args);
      originalError.apply(console, args);
    };
  }

  private scanConsoleOutput(level: string, args: any[]): void {
    const text = args.join(' ');
    
    this.FAKE_DATA_PATTERNS.forEach(({ pattern, severity, description }) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          this.recordAlert({
            type: 'CONSOLE_LOG',
            pattern: pattern.toString(),
            content: match,
            location: `console.${level}`,
            severity
          });
        });
      }
    });
  }

  private monitorNetwork(): void {
    if (typeof window === 'undefined' || !window.fetch) return;

    // Intercept fetch responses
    const originalFetch = window.fetch;
    
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const response = await originalFetch(...args);
      
      // Clone response to read without consuming
      const clonedResponse = response.clone();
      
      try {
        const text = await clonedResponse.text();
        this.scanNetworkResponse(args[0].toString(), text);
      } catch (error) {
        // Ignore JSON parsing errors
      }
      
      return response;
    };
  }

  private scanNetworkResponse(url: string, responseText: string): void {
    this.FAKE_DATA_PATTERNS.forEach(({ pattern, severity, description }) => {
      const matches = responseText.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          this.recordAlert({
            type: 'API_RESPONSE',
            pattern: pattern.toString(),
            content: match,
            location: url,
            severity
          });
        });
      }
    });
  }

  private performComprehensiveScan(): void {
    if (typeof document === 'undefined') return;

    // Scan entire page content
    const bodyText = document.body.innerText;
    
    this.FAKE_DATA_PATTERNS.forEach(({ pattern, severity, description }) => {
      const matches = bodyText.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          this.recordAlert({
            type: 'DOM_CONTENT',
            pattern: pattern.toString(),
            content: match,
            location: 'document.body (comprehensive scan)',
            severity
          });
        });
      }
    });
  }

  private recordAlert(alert: Omit<FakeDataAlert, 'timestamp'>): void {
    const fullAlert: FakeDataAlert = {
      ...alert,
      timestamp: new Date().toISOString()
    };

    this.alerts.push(fullAlert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log the alert
    const logLevel = alert.severity === 'HIGH' ? 'error' : alert.severity === 'MEDIUM' ? 'warn' : 'log';
    console[logLevel](`🚨 FAKE DATA DETECTED [${alert.severity}]:`, {
      pattern: alert.pattern,
      content: alert.content,
      location: alert.location,
      type: alert.type
    });

    // Show alert in development
    if (alert.severity === 'HIGH' && this.isDevelopment()) {
      this.showDevelopmentAlert(fullAlert);
    }

    // Store in localStorage for debugging
    this.storeAlert(fullAlert);
  }

  private getElementLocation(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.replace(/\s+/g, '.')}` : '';
    const id = element.id ? `#${element.id}` : '';
    
    return `${tagName}${id}${className}`;
  }

  private isDevelopment(): boolean {
    return typeof window !== 'undefined' && 
           (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            process.env.NODE_ENV === 'development');
  }

  private showDevelopmentAlert(alert: FakeDataAlert): void {
    if (typeof window === 'undefined') return;

    // Only show alerts for high severity issues to avoid spam
    if (alert.severity === 'HIGH') {
      setTimeout(() => {
        window.alert(`🚨 FAKE DATA DETECTED!\n\nPattern: ${alert.pattern}\nContent: ${alert.content}\nLocation: ${alert.location}`);
      }, 100);
    }
  }

  private storeAlert(alert: FakeDataAlert): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const storedAlerts = JSON.parse(localStorage.getItem('fakeDataAlerts') || '[]');
      storedAlerts.push(alert);
      
      // Keep only last 50 alerts in storage
      const recentAlerts = storedAlerts.slice(-50);
      localStorage.setItem('fakeDataAlerts', JSON.stringify(recentAlerts));
    } catch (error) {
      console.error('Failed to store fake data alert:', error);
    }
  }

  getAlerts(): FakeDataAlert[] {
    return [...this.alerts];
  }

  getHighPriorityAlerts(): FakeDataAlert[] {
    return this.alerts.filter(alert => alert.severity === 'HIGH');
  }

  clearAlerts(): void {
    this.alerts = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fakeDataAlerts');
    }
  }

  getStoredAlerts(): FakeDataAlert[] {
    if (typeof localStorage === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('fakeDataAlerts') || '[]');
    } catch {
      return [];
    }
  }
}

// Global instance
export const fakeDataDetector = FakeDataDetector.startMonitoring();
