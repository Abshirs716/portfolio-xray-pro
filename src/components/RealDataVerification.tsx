import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface RealPortfolioData {
  totalTransactions: number;
  uniqueSymbols: string[];
  totalInvested: number;
  totalDividends: number;
  isRealData: boolean;
}

/**
 * 🔍 Real Data Verification Component
 * 
 * Verifies and displays that the system is using REAL uploaded transaction data
 */
export const RealDataVerification = () => {
  const { user } = useAuth();
  const [realData, setRealData] = useState<RealPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRealPortfolioData = async () => {
      if (!user) return;

      try {
        console.log('🔍 Verifying REAL uploaded data for user:', user.id);
        
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select(`
            type,
            symbol,
            amount,
            transaction_date
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('❌ Error fetching real data:', error);
          return;
        }

        if (!transactions || transactions.length === 0) {
          console.log('⚠️ No real transactions found - user needs to upload data');
          setRealData({
            totalTransactions: 0,
            uniqueSymbols: [],
            totalInvested: 0,
            totalDividends: 0,
            isRealData: false
          });
          return;
        }

        // Calculate metrics from REAL data
        const uniqueSymbols = [...new Set(transactions
          .filter(t => t.symbol)
          .map(t => t.symbol!))]
          .sort();

        const totalInvested = transactions
          .filter(t => t.type === 'buy' || t.type === 'sell')
          .reduce((sum, t) => {
            return t.type === 'buy' ? sum + t.amount : sum - t.amount;
          }, 0);

        const totalDividends = transactions
          .filter(t => t.type === 'dividend')
          .reduce((sum, t) => sum + t.amount, 0);

        const realPortfolioData = {
          totalTransactions: transactions.length,
          uniqueSymbols,
          totalInvested,
          totalDividends,
          isRealData: true
        };

        console.log('✅ REAL Data Verified:', realPortfolioData);
        setRealData(realPortfolioData);

      } catch (error) {
        console.error('❌ Error verifying real data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRealPortfolioData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Verifying Data Source...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  if (!realData || !realData.isRealData) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            No Real Data Found
          </CardTitle>
          <CardDescription>
            Please upload your transaction file to see your real portfolio data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="destructive">Using Demo Data</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          ✅ Using Your Real Data
        </CardTitle>
        <CardDescription>
          System is using your uploaded transaction data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {realData.totalTransactions}
            </div>
            <div className="text-sm text-muted-foreground">
              Real Transactions
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {realData.uniqueSymbols.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Unique Stocks
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              ${Math.abs(realData.totalInvested).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Invested
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              ${realData.totalDividends.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Dividends
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Your Real Holdings:</h4>
          <div className="flex flex-wrap gap-1">
            {realData.uniqueSymbols.map(symbol => (
              <Badge key={symbol} variant="secondary">
                {symbol}
              </Badge>
            ))}
          </div>
        </div>

        <Badge variant="default" className="bg-green-100 text-green-800">
          ✅ Real Data Verified
        </Badge>
      </CardContent>
    </Card>
  );
};

export default RealDataVerification;