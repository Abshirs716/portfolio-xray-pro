import { supabase } from '@/integrations/supabase/client';

/**
 * ❌ DISABLED SAMPLE DATA SERVICE
 * 
 * This service is DISABLED to ensure only REAL user uploaded data is used.
 * All methods throw errors to prevent accidental use of fake data.
 */

export class SampleDataService {
  /**
   * ❌ DISABLED - Use real uploaded transactions only
   */
  static async createSampleTransactions(portfolioId: string, userId: string) {
    throw new Error('🚨 SAMPLE DATA DISABLED - Use real uploaded transactions only!');
  }

  /**
   * This method is still available for real portfolio calculations
   */
  static async updatePortfolioValue(portfolioId: string) {
    // Get all REAL transactions for this portfolio
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('portfolio_id', portfolioId);

    if (error) {
      console.error('Error fetching REAL transactions:', error);
      return;
    }

    console.log(`📊 Calculating value from ${transactions?.length || 0} REAL transactions`);

    // Calculate total from REAL transactions only
    let totalValue = 0;
    transactions?.forEach(transaction => {
      if (transaction.type === 'buy') {
        totalValue += transaction.amount;
      } else if (transaction.type === 'sell') {
        totalValue -= transaction.amount;
      } else if (transaction.type === 'dividend') {
        totalValue += transaction.amount;
      }
    });

    console.log(`💰 REAL portfolio cost basis: $${totalValue.toLocaleString()}`);

    // Update portfolio total value with REAL calculated value
    const { error: updateError } = await supabase
      .from('portfolios')
      .update({ total_value: totalValue })
      .eq('id', portfolioId);

    if (updateError) {
      console.error('Error updating portfolio value:', updateError);
    }

    return totalValue;
  }
}

export default SampleDataService;