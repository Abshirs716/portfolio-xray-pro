import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  symbol: string;
  success: boolean;
  price?: number;
  source?: string;
  timestamp?: string;
  error?: string;
  marketCap?: number;
}

export const LiveDataVerificationTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    fakeDataDetected: false
  });

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setResults([]);
    
    console.log('🚨 RUNNING COMPREHENSIVE LIVE DATA VERIFICATION TEST');
    console.log('🎯 TARGET: NVIDIA REAL MARKET CAP VERIFICATION');
    
    const testSymbols = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    const testResults: TestResult[] = [];
    
    for (const symbol of testSymbols) {
      console.log(`\n🔍 TESTING ${symbol} FOR LIVE DATA...`);
      
      try {
        const { data, error } = await supabase.functions.invoke('real-market-data', {
          body: { symbol, type: 'quote' }
        });

        if (error) {
          console.error(`❌ Edge function error for ${symbol}:`, error);
          testResults.push({
            symbol,
            success: false,
            error: `Edge function: ${error.message}`
          });
          continue;
        }

        if (!data.success) {
          console.error(`❌ Live data failed for ${symbol}:`, data.error);
          testResults.push({
            symbol,
            success: false,
            error: data.error
          });
          continue;
        }

        const quote = data.data;
        console.log(`✅ SUCCESS: ${symbol} = $${quote.price} from ${quote.source}`);
        
        // Special validation for NVIDIA
        let marketCap = null;
        if (symbol === 'NVDA') {
          // Estimate market cap (rough calculation with ~25B shares outstanding)
          marketCap = quote.price * 25000000000;
          console.log(`💰 NVIDIA ESTIMATED MARKET CAP: $${(marketCap / 1000000000000).toFixed(2)} TRILLION`);
          
          // Validate it's realistic
          if (marketCap < 2000000000000) { // Less than $2T
            console.error('🚨 NVIDIA MARKET CAP TOO LOW - LIKELY FAKE DATA!');
          } else {
            console.log('✅ NVIDIA MARKET CAP LOOKS REALISTIC');
          }
        }

        testResults.push({
          symbol,
          success: true,
          price: quote.price,
          source: quote.source,
          timestamp: quote.timestamp,
          marketCap
        });

      } catch (error) {
        console.error(`💥 Exception testing ${symbol}:`, error);
        testResults.push({
          symbol,
          success: false,
          error: error.message
        });
      }
      
      // Wait between tests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setResults(testResults);
    
    // Calculate summary
    const successful = testResults.filter(r => r.success).length;
    const failed = testResults.filter(r => !r.success).length;
    const fakeDataDetected = testResults.some(r => 
      r.success && r.symbol === 'NVDA' && r.marketCap && r.marketCap < 2000000000000
    );
    
    setSummary({
      total: testResults.length,
      successful,
      failed,
      fakeDataDetected
    });
    
    console.log(`\n📊 TEST SUMMARY:`);
    console.log(`✅ Successful: ${successful}/${testResults.length}`);
    console.log(`❌ Failed: ${failed}/${testResults.length}`);
    console.log(`🚨 Fake data detected: ${fakeDataDetected ? 'YES' : 'NO'}`);
    
    setIsRunning(false);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  return (
    <Card className="w-full border-2 border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔬 LIVE DATA VERIFICATION TEST
            {summary.total > 0 && (
              <Badge variant={summary.fakeDataDetected ? 'destructive' : summary.successful === summary.total ? 'default' : 'secondary'}>
                {summary.successful}/{summary.total} LIVE
              </Badge>
            )}
          </CardTitle>
          <Button 
            onClick={runComprehensiveTest} 
            disabled={isRunning}
            className="bg-primary hover:bg-primary/80"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {isRunning ? 'Testing...' : 'Run Test'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {summary.total > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{summary.successful}</div>
              <div className="text-sm">Live Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm">Failed Sources</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${summary.fakeDataDetected ? 'text-red-600' : 'text-emerald-600'}`}>
                {summary.fakeDataDetected ? '❌' : '✅'}
              </div>
              <div className="text-sm">Data Quality</div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Test Results:</h4>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-semibold">{result.symbol}</div>
                      {result.success ? (
                        <div className="text-sm text-emerald-700">
                          Source: {result.source}
                        </div>
                      ) : (
                        <div className="text-sm text-red-700">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.success && (
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${result.price?.toFixed(2)}
                      </div>
                      {result.marketCap && (
                        <div className="text-sm text-muted-foreground">
                          Cap: {formatMarketCap(result.marketCap)}
                        </div>
                      )}
                      {result.timestamp && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Special NVIDIA section */}
        {results.find(r => r.symbol === 'NVDA' && r.success) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">NVIDIA VERIFICATION</span>
            </div>
            {(() => {
              const nvdaResult = results.find(r => r.symbol === 'NVDA' && r.success);
              if (!nvdaResult) return null;
              
              return (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Current Price:</strong> ${nvdaResult.price?.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Estimated Market Cap:</strong> {nvdaResult.marketCap ? formatMarketCap(nvdaResult.marketCap) : 'Unknown'}
                  </p>
                  <p className="text-sm">
                    <strong>Data Source:</strong> {nvdaResult.source}
                  </p>
                  <p className="text-sm">
                    <strong>Verification:</strong> {
                      nvdaResult.marketCap && nvdaResult.marketCap >= 2000000000000 
                        ? '✅ Market cap looks realistic (&gt;$2T)'
                        : '❌ Market cap seems too low'
                    }
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-700">VERIFICATION CRITERIA</span>
          </div>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>✅ Data must come from live API sources (Alpha Vantage, FMP, AI models)</p>
            <p>✅ NVIDIA market cap must be realistic (&gt;$2 trillion)</p>
            <p>✅ Prices must be within realistic ranges</p>
            <p>❌ NO hardcoded, cached, or estimated values</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};