/**
 * DATA VERIFICATION SYSTEM
 * 🚨 EMERGENCY: Detect and block ALL fake portfolio data
 */

export class DataVerification {
  private static readonly FAKE_VALUES = [
    26555397, 26555396.98, 25000000, 1033954.78,
    '26,555,397', '26,555,396.98', '25,000,000', '1,033,954.78',
    'SOPHISTICATED_PORTFOLIO', 'DEMO_PORTFOLIO', 'mockPortfolio'
  ];

  /**
   * 🚨 EMERGENCY CHECK: Scan entire DOM for fake values
   */
  static scanDOMForFakeData(): { hasFakeData: boolean; fakeValues: string[] } {
    const bodyText = document.body.innerText;
    const foundFakes: string[] = [];

    this.FAKE_VALUES.forEach(fakeValue => {
      if (bodyText.includes(String(fakeValue))) {
        foundFakes.push(String(fakeValue));
        console.error('❌ FAKE DATA DETECTED IN DOM:', fakeValue);
      }
    });

    return {
      hasFakeData: foundFakes.length > 0,
      fakeValues: foundFakes
    };
  }

  /**
   * 🚨 EMERGENCY CHECK: Verify portfolio data is real
   */
  static verifyPortfolioData(portfolio: any): { isReal: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for fake total values
    if (portfolio?.totalValue === 26555397 || portfolio?.totalValue === 26555396.98) {
      issues.push('FAKE DEMO VALUE: $26,555,397');
    }

    if (portfolio?.totalValue === 25000000) {
      issues.push('FAKE DEMO VALUE: $25,000,000');
    }

    if (portfolio?.totalValue === 1033954.78) {
      issues.push('FAKE DEMO VALUE: $1,033,954.78');
    }

    // Check for unrealistic values
    if (portfolio?.totalValue && portfolio.totalValue > 30000000) {
      issues.push('SUSPICIOUS VALUE: Portfolio > $30M');
    }

    // Check for impossible daily changes
    if (portfolio?.dailyChangePercent && Math.abs(portfolio.dailyChangePercent) > 15) {
      issues.push(`IMPOSSIBLE DAILY CHANGE: ${portfolio.dailyChangePercent}%`);
    }

    // Check for fake daily change amounts
    if (portfolio?.dailyChange && Math.abs(portfolio.dailyChange) > 1000000) {
      issues.push(`IMPOSSIBLE DAILY AMOUNT: $${portfolio.dailyChange}`);
    }

    return {
      isReal: issues.length === 0,
      issues
    };
  }

  /**
   * 🚨 EMERGENCY: Start continuous monitoring
   */
  static startContinuousMonitoring(): () => void {
    console.log('🔍 Starting FAKE DATA monitoring...');

    const monitor = () => {
      const domCheck = this.scanDOMForFakeData();
      
      if (domCheck.hasFakeData) {
        console.error('🚨 FAKE DATA ALERT!', domCheck.fakeValues);
        
        // Create visible alert
        const alert = document.createElement('div');
        alert.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: red;
          color: white;
          padding: 20px;
          z-index: 9999;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
        `;
        alert.innerHTML = `🚨 FAKE DATA DETECTED: ${domCheck.fakeValues.join(', ')} - FIX IMMEDIATELY!`;
        document.body.prepend(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => alert.remove(), 5000);
      }
    };

    const interval = setInterval(monitor, 2000); // Check every 2 seconds
    
    return () => {
      clearInterval(interval);
      console.log('🔍 Stopped FAKE DATA monitoring');
    };
  }

  /**
   * 🚨 EMERGENCY: Block component render if using fake data
   */
  static validateBeforeRender(componentName: string, data: any): boolean {
    const validation = this.verifyPortfolioData(data);
    
    if (!validation.isReal) {
      console.error(`❌ BLOCKING ${componentName} - FAKE DATA:`, validation.issues);
      return false;
    }

    console.log(`✅ ${componentName} - Real data verified`);
    return true;
  }
}