import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const TestMarketData = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testNVIDIA = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol: 'NVDA', type: 'quote' }
      });
      
      const result = {
        timestamp: new Date().toLocaleTimeString(),
        success: !error,
        data: data?.data,
        error: error?.message
      };
      
      setResults(prev => [result, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('Test failed:', err);
    }
    setLoading(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>🧪 NVIDIA Market Cap Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testNVIDIA} disabled={loading} className="mb-4">
          {loading ? 'Testing...' : 'Test NVIDIA Data'}
        </Button>
        
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="p-3 border rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                </span>
                <span className="text-sm text-muted-foreground">{result.timestamp}</span>
              </div>
              {result.data && (
                <div className="mt-2 text-sm">
                  <div><strong>Price:</strong> ${result.data.price}</div>
                  <div><strong>Market Cap:</strong> ${(result.data.marketCap / 1e12).toFixed(2)}T</div>
                  <div><strong>Source:</strong> {result.data.source}</div>
                </div>
              )}
              {result.error && (
                <div className="mt-2 text-sm text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};