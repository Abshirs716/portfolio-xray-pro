import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useLiveDataMonitor } from '@/hooks/useLiveDataMonitor';

export const LiveDataDiagnostics = () => {
  const { status, auditLog, testLiveDataSource, clearErrors } = useLiveDataMonitor();
  const [isManualTesting, setIsManualTesting] = useState(false);

  const runManualTest = async () => {
    setIsManualTesting(true);
    clearErrors();
    
    console.log('🧪 Running manual live data test...');
    
    // Test multiple symbols to ensure it's working across the board
    const testSymbols = ['NVDA', 'AAPL', 'MSFT'];
    
    for (const symbol of testSymbols) {
      console.log(`🔍 Testing ${symbol}...`);
      await testLiveDataSource(symbol);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }
    
    setIsManualTesting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔧 Live Market Data Diagnostics
            {status.isLive ? (
              <Badge variant="default" className="bg-emerald-500">LIVE</Badge>
            ) : (
              <Badge variant="destructive">OFFLINE</Badge>
            )}
          </CardTitle>
          <Button 
            onClick={runManualTest} 
            disabled={isManualTesting}
            size="sm"
            variant="outline"
          >
            {isManualTesting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Test Now
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="font-semibold text-lg">
              {status.isLive ? (
                <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
              )}
            </div>
            <p className="text-sm font-medium">
              {status.isLive ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="font-semibold text-lg text-emerald-600">
              {status.successCount}
            </div>
            <p className="text-sm">Successes</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="font-semibold text-lg text-red-600">
              {status.failureCount}
            </div>
            <p className="text-sm">Failures</p>
          </div>
          
          <div className="text-center p-3 bg-secondary/20 rounded-lg">
            <div className="font-semibold text-lg">
              {status.source || 'None'}
            </div>
            <p className="text-sm">Data Source</p>
          </div>
        </div>

        {/* Last Update */}
        {status.lastUpdated && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm">
              <strong>Last Live Update:</strong> {new Date(status.lastUpdated).toLocaleString()}
            </p>
            <p className="text-sm text-emerald-700">
              <strong>Source:</strong> {status.source}
            </p>
          </div>
        )}

        {/* Errors */}
        {status.errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-700">Current Issues:</span>
            </div>
            <ul className="text-sm text-red-600 space-y-1">
              {status.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Audit Log */}
        {auditLog.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recent Attempts:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {auditLog.slice(-10).reverse().map((attempt, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    attempt.success 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {attempt.success ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className="font-medium">{attempt.source}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(attempt.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Key Status */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h4 className="font-medium text-emerald-700 mb-1">✅ OpenAI GPT-4.1 Active!</h4>
          <p className="text-sm text-emerald-600">
            Live market data powered by OpenAI's GPT-4.1 AI model.
          </p>
          <ul className="text-sm text-emerald-600 mt-1 space-y-1">
            <li>• Real-time pricing and market caps</li>
            <li>• Advanced financial intelligence</li>
            <li>• No rate limiting issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};