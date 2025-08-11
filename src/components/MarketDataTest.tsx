import React, { useEffect, useState } from 'react';
import { workingMarketDataService } from '@/services/marketData/workingMarketDataService';

export function MarketDataTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);

  useEffect(() => {
    // Test the connection
    workingMarketDataService.testConnection().then(result => {
      setTestResult(result);
      console.log('Connection test:', result);
    });

    // Test getting data
    workingMarketDataService.getMarketData('NVDA').then(data => {
      setMarketData(data);
      console.log('Market data test:', data);
    });
  }, []);

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-bold mb-4">Market Data Test</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Connection Test:</h4>
        <pre className="text-xs bg-background p-2 rounded border">
          {JSON.stringify(testResult, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">NVDA Data:</h4>
        <pre className="text-xs bg-background p-2 rounded border">
          {JSON.stringify(marketData, null, 2)}
        </pre>
      </div>
    </div>
  );
}