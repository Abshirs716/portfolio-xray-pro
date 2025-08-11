// This service ensures all percentages are properly formatted
export class DebugOverrideService {
  static formatPercentage(value: any, decimals: number = 2): string {
    const num = Number(value) || 0;
    return num.toFixed(decimals);
  }

  static sanitizePercentage(value: any, max: number = 100): number {
    const num = Number(value) || 0;
    const capped = Math.max(-max, Math.min(max, num));
    return Number(capped.toFixed(2));
  }

  static formatCurrency(value: any): string {
    const num = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  static validatePortfolioData(data: any): any {
    return {
      ...data,
      yearToDateChangePercent: this.sanitizePercentage(data.yearToDateChangePercent, 100),
      dailyChangePercent: this.sanitizePercentage(data.dailyChangePercent, 10),
      weeklyChangePercent: this.sanitizePercentage(data.weeklyChangePercent, 20),
      monthlyChangePercent: this.sanitizePercentage(data.monthlyChangePercent, 30),
      holdings: data.holdings?.map((h: any) => ({
        ...h,
        weight: Number(this.formatPercentage(h.weight, 2)),
        dailyChangePercent: this.sanitizePercentage(h.dailyChangePercent, 10),
        totalReturnPercent: this.sanitizePercentage(h.totalReturnPercent, 500)
      }))
    };
  }
}