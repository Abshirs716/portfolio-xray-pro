import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Volume2, 
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';

const signalTypes = [
  {
    id: 'golden-cross',
    title: 'Golden Cross',
    icon: TrendingUp,
    type: 'BULLISH',
    difficulty: 'Beginner',
    description: 'When the 50-day moving average crosses above the 200-day moving average',
    explanation: `Think of moving averages as the "average mood" of a stock over time. 
    
The 50-day average shows recent sentiment (last 2 months), while the 200-day shows long-term sentiment (last 8-10 months).

When the 50-day crosses above the 200-day, it means:
• Recent buying pressure is stronger than long-term selling
• Institutional investors (big money) are likely buying
• The trend is shifting from bearish to bullish`,
    howToUse: [
      '✅ WAIT for the crossover to be confirmed (not just touching)',
      '✅ LOOK for increased volume during the crossover',
      '✅ CHECK that price is also above both moving averages',
      '❌ AVOID if the stock is in a strong downtrend overall'
    ],
    whyImportant: 'Golden Crosses have historically preceded major bull runs. The 2009 market bottom, the 2016 recovery, and many individual stock breakouts started with Golden Crosses.',
    riskLevel: 'Medium',
    successRate: '65-75%',
    timeframe: '3-6 months',
    example: 'MSFT in your portfolio just confirmed a Golden Cross. This suggests the stock could continue rising for the next 3-6 months.'
  },
  {
    id: 'rsi-overbought',
    title: 'RSI Overbought',
    icon: AlertTriangle,
    type: 'BEARISH',
    difficulty: 'Beginner',
    description: 'Relative Strength Index (RSI) above 70 indicates potential selling pressure',
    explanation: `RSI measures how "exhausted" a stock\'s buying power is on a scale of 0-100.

Think of it like a thermometer for buying fever:
• 0-30: Stock is "oversold" (too much selling, might bounce back)
• 30-70: Normal trading range
• 70-100: Stock is "overbought" (too much buying, might pull back)

When RSI hits 70+, it means buyers have been very aggressive recently and might be running out of steam.`,
    howToUse: [
      '✅ CONSIDER taking profits when RSI > 70',
      '✅ WAIT for RSI to start declining before selling',
      '✅ COMBINE with other signals (don\'t rely on RSI alone)',
      '❌ NEVER short a stock just because RSI is high'
    ],
    whyImportant: 'RSI helps you avoid buying at tops and selling at bottoms. It\'s particularly useful for timing profit-taking in strong uptrends.',
    riskLevel: 'Low',
    successRate: '60-70%',
    timeframe: '1-4 weeks',
    example: 'NVDA shows RSI at 78.5. This suggests the recent rally might pause or reverse in the short term.'
  },
  {
    id: 'macd-crossover',
    title: 'MACD Crossover',
    icon: Activity,
    type: 'VARIABLE',
    difficulty: 'Intermediate',
    description: 'Moving Average Convergence Divergence line crosses above or below the signal line',
    explanation: `MACD is like having two race cars (moving averages) and watching which one is winning.

The MACD line shows the relationship between 12-day and 26-day moving averages.
The Signal line is a 9-day average of the MACD line.

When MACD crosses above Signal = Bullish (buying momentum increasing)
When MACD crosses below Signal = Bearish (selling momentum increasing)

It\'s like watching the speedometer of market momentum.`,
    howToUse: [
      '✅ BUY when MACD crosses above signal line (bullish crossover)',
      '✅ SELL when MACD crosses below signal line (bearish crossover)',
      '✅ CONFIRM with volume and price action',
      '✅ LOOK for divergences (price up, MACD down = warning)'
    ],
    whyImportant: 'MACD shows momentum changes before they become obvious in price. It helps you get in early on trend changes.',
    riskLevel: 'Medium',
    successRate: '60-65%',
    timeframe: '2-8 weeks',
    example: 'TSLA has a bullish MACD crossover but declining volume, creating mixed signals that require caution.'
  },
  {
    id: 'volume-breakout',
    title: 'Volume Breakout',
    icon: Volume2,
    type: 'BULLISH',
    difficulty: 'Intermediate',
    description: 'Price breaks resistance with significantly higher than average volume',
    explanation: `Volume is like the fuel that powers price movements. Without volume, price moves are weak and often fail.

Normal volume = retail investors (like you and me)
High volume = institutional investors (pension funds, hedge funds)

When price breaks above a resistance level with 2-3x normal volume, it means:
• Big money is buying aggressively
• The breakout is "real" (not just a fake-out)
• More upside is likely as institutions continue buying`,
    howToUse: [
      '✅ IDENTIFY key resistance levels on charts',
      '✅ WAIT for price to break above resistance',
      '✅ CONFIRM with volume 150%+ above average',
      '✅ BUY on the breakout or on pullbacks to the old resistance'
    ],
    whyImportant: 'Volume breakouts have the highest success rate of all technical signals because they show institutional conviction.',
    riskLevel: 'Low-Medium',
    successRate: '75-85%',
    timeframe: '2-12 weeks',
    example: 'GOOGL broke $2,820 resistance with 200% above-average volume, indicating strong institutional buying.'
  }
];

export const TechnicalAnalysisGuide = () => {
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const selectedSignalData = signalTypes.find(s => s.id === selectedSignal);

  return (
    <Card className="backdrop-blur-md bg-card/60 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Technical Analysis Education
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs"
          >
            {showGuide ? 'Hide Guide' : 'Learn Signals'}
          </Button>
        </div>
      </CardHeader>

      {showGuide && (
        <CardContent>
          <div className="space-y-6">
            {/* Signal Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              {signalTypes.map((signal) => {
                const IconComponent = signal.icon;
                return (
                  <Button
                    key={signal.id}
                    variant={selectedSignal === signal.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSignal(signal.id)}
                    className="h-auto p-3 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium text-sm">{signal.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={signal.type === 'BULLISH' ? 'default' : signal.type === 'BEARISH' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {signal.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {signal.difficulty}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Detailed Explanation */}
            {selectedSignalData && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <selectedSignalData.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">{selectedSignalData.title}</h3>
                  <Badge 
                    variant={selectedSignalData.type === 'BULLISH' ? 'default' : selectedSignalData.type === 'BEARISH' ? 'destructive' : 'secondary'}
                  >
                    {selectedSignalData.type}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">Success Rate</p>
                    <p className="text-xs text-muted-foreground">{selectedSignalData.successRate}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <BarChart3 className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">Risk Level</p>
                    <p className="text-xs text-muted-foreground">{selectedSignalData.riskLevel}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <Activity className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium">Timeframe</p>
                    <p className="text-xs text-muted-foreground">{selectedSignalData.timeframe}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">What is it?</h4>
                    <p className="text-sm text-muted-foreground">{selectedSignalData.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Simple Explanation</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedSignalData.explanation}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">How to Use It</h4>
                    <div className="space-y-1">
                      {selectedSignalData.howToUse.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          {tip.startsWith('✅') ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-muted-foreground">{tip.slice(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Why It Matters</h4>
                    <p className="text-sm text-muted-foreground">{selectedSignalData.whyImportant}</p>
                  </div>

                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-primary">Real Example from Your Portfolio</h4>
                    <p className="text-sm text-muted-foreground">{selectedSignalData.example}</p>
                  </div>
                </div>
              </div>
            )}

            {!selectedSignalData && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a signal type above to learn more</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};