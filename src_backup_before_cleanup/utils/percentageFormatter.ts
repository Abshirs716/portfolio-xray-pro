/**
 * Global percentage formatter to ensure consistency
 */
export class PercentageFormatter {
  /**
   * Format any percentage to XX.XX% format
   */
  static format(value: number | string | undefined | null): string {
    const num = Number(value) || 0;
    
    // Sanity check for impossible values
    if (Math.abs(num) > 1000) {
      console.warn(`Impossible percentage detected: ${num}%`);
      return '0.00%';
    }
    
    const formatted = num.toFixed(2);
    return `${num >= 0 ? '+' : ''}${formatted}%`;
  }

  /**
   * Format allocation percentage (always positive, max 100)
   */
  static formatAllocation(value: number | string | undefined | null): string {
    const num = Number(value) || 0;
    const capped = Math.min(100, Math.max(0, num));
    return `${capped.toFixed(2)}%`;
  }

  /**
   * Sanitize percentage with max limit
   */
  static sanitize(value: number, maxAbsolute: number = 100): number {
    if (!isFinite(value)) return 0;
    const capped = Math.max(-maxAbsolute, Math.min(maxAbsolute, value));
    return Number(capped.toFixed(2));
  }
}