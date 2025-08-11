import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EdgeFunctionTester() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testFunction = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 Testing edge function directly...');
      
      const { data, error } = await supabase.functions.invoke('real-market-data', {
        body: { symbol: 'AAPL', type: 'quote' }
      });
      
      const result = {
        success: !error,
        data,
        error,
        timestamp: new Date().toISOString()
      };
      
      console.log('🔍 Edge function test result:', result);
      setResult(result);
      
    } catch (err) {
      console.error('❌ Edge function test failed:', err);
      setResult({
        success: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>🧪 Edge Function Direct Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testFunction} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? 'Testing...' : 'Test real-market-data Function'}
        </Button>
        
        {result && (
          <div className="space-y-2">
            <div className="font-semibold">
              Status: {result.success ? '✅ SUCCESS' : '❌ FAILED'}
            </div>
            <pre className="text-xs bg-muted p-2 rounded border overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}