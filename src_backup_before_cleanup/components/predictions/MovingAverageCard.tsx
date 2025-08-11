import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { analyzeMovingAverages, testMovingAverages } from '@/services/technicalAnalysis/movingAverages';

export const MovingAverageCard = () => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real price data for demonstration
    const generatePriceData = () => {
      const basePrice = 185; // AAPL-like price
      return Array(200).fill(0).map((_, i) => {
        const trend = i * 0.05; // Slight upward trend
        const volatility = Math.sin(i / 10) * 5 + Math.random() * 2;
        return basePrice + trend + volatility;
      });
    };

    // Run analysis
    setTimeout(() => {
      const prices = generatePriceData();
      const result = analyzeMovingAverages('AAPL', prices);
      setAnalysis(result);
      setIsLoading(false);
      
      // Run tests
      testMovingAverages();
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-md bg-card/60 border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCrossoverIcon = (type: string) => {
    if (type === 'GOLDEN_CROSS') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (type === 'DEATH_CROSS') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Activity className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className="backdrop-blur-md bg-card/60 border-border/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Moving Average Analysis</CardTitle>
          <Badge variant={analysis?.crossoverType === 'GOLDEN_CROSS' ? 'default' : 'secondary'}>
            {analysis?.symbol}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Crossover Status */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              {getCrossoverIcon(analysis?.crossoverType)}
              <div>
                <p className="font-medium">
                  {analysis?.crossoverType === 'GOLDEN_CROSS' ? 'Golden Cross Detected!' :
                   analysis?.crossoverType === 'DEATH_CROSS' ? 'Death Cross Warning!' :
                   'No Crossover'}
                </p>
                <p className="text-xs text-muted-foreground">
                  SMA(50): ${analysis?.shortMA.value} | SMA(200): ${analysis?.longMA.value}
                </p>
              </div>
            </div>
          </div>

          {/* Prediction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prediction</span>
              <Badge variant={analysis?.prediction.direction === 'BULLISH' ? 'default' : 'secondary'}>
                {analysis?.prediction.direction}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-muted/20 rounded">
                <p className="text-xs text-muted-foreground">Expected Move</p>
                <p className="font-medium">{analysis?.prediction.expectedMove.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="font-medium">{analysis?.prediction.confidence.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};