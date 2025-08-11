import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  BarChart3,
  Zap,
  AlertTriangle,
  DollarSign,
  Timer,
  Users,
  LineChart,
  Volume2,
  PieChart,
  Lightbulb
} from 'lucide-react';

interface TechnicalConcept {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToLearn: string;
  explanation: string;
  whatItMeans: string;
  howToUse: string[];
  whyImportant: string;
  practicalTips: string[];
  realWorldExample: string;
  professionalTip: string;
}

const technicalConcepts: TechnicalConcept[] = [
  {
    id: 'introduction',
    title: 'Introduction to Technical Analysis',
    icon: BookOpen,
    difficulty: 'beginner',
    timeToLearn: '15 minutes',
    explanation: 'Technical analysis is like reading the emotions and psychology of the market through price charts. Instead of looking at company financials, you study price patterns to predict where stocks might go next.',
    whatItMeans: 'You\'re learning to "read the market\'s mind" by studying how prices move, when people buy and sell, and what patterns repeat over time.',
    howToUse: [
      'Start by learning to read basic price charts (candlesticks, line charts)',
      'Identify trends: is the stock going up, down, or sideways?',
      'Look for patterns that repeat (like support and resistance levels)',
      'Use multiple timeframes: daily, weekly, monthly views'
    ],
    whyImportant: 'Technical analysis helps you time your entries and exits better. Even the best companies can have bad timing for buying. This helps you buy low and sell high.',
    practicalTips: [
      'Start with simple line charts before moving to candlesticks',
      'Practice on paper first before risking real money',
      'Focus on major trends rather than daily noise',
      'Combine with fundamental analysis for best results'
    ],
    realWorldExample: 'In March 2020, even great companies like Apple dropped 30%. Technical analysis would have warned you to wait for the bounce at $240 before buying.',
    professionalTip: 'Professional traders use technical analysis for timing, not for picking stocks. They might love a company fundamentally but wait for the right technical setup to buy.'
  },
  {
    id: 'chart-patterns',
    title: 'Chart Patterns & Formations',
    icon: LineChart,
    difficulty: 'intermediate',
    timeToLearn: '25 minutes',
    explanation: 'Chart patterns are like footprints that show what buyers and sellers are thinking. These shapes on charts repeat because human psychology repeats.',
    whatItMeans: 'When you see certain patterns forming, they often lead to predictable price movements because they represent the same emotions (fear, greed) playing out again.',
    howToUse: [
      'Head & Shoulders: Look for three peaks, middle one highest (bearish reversal)',
      'Triangles: Price squeezes into smaller ranges before breakout',
      'Double Top/Bottom: Price tests same level twice and fails',
      'Flags: Brief pauses in strong trends before continuation'
    ],
    whyImportant: 'These patterns give you early warning signals about trend changes, often before news breaks or fundamentals catch up.',
    practicalTips: [
      'Wait for pattern completion and volume confirmation',
      'Measure pattern height to estimate price targets',
      'False breakouts are common - wait for follow-through',
      'Practice identifying patterns on historical charts first'
    ],
    realWorldExample: 'Tesla formed a perfect head and shoulders pattern in late 2021 at $1,200, signaling the drop to $700. Pattern traders sold early and avoided the crash.',
    professionalTip: 'Institutional traders use pattern recognition algorithms. The most reliable patterns are those that take weeks or months to form, not hours.'
  },
  {
    id: 'support-resistance',
    title: 'Support & Resistance Levels',
    icon: BarChart3,
    difficulty: 'beginner',
    timeToLearn: '20 minutes',
    explanation: 'Think of support and resistance like floors and ceilings for stock prices. Support is where buying comes in (floor), resistance is where selling pressure increases (ceiling).',
    whatItMeans: 'These are psychological price levels where traders have strong memories of buying or selling, creating predictable behavior when prices return to these levels.',
    howToUse: [
      'Support: Previous lows where stock bounced multiple times',
      'Resistance: Previous highs where stock was rejected',
      'Draw horizontal lines connecting multiple touches',
      'When broken, support becomes resistance and vice versa'
    ],
    whyImportant: 'These levels help you plan entries (buy near support) and exits (sell near resistance), dramatically improving your timing.',
    practicalTips: [
      'Look for at least 2-3 touches to confirm a level',
      'Round numbers ($100, $50) often act as psychological levels',
      'Volume should increase at key levels for confirmation',
      'The more times a level is tested, the stronger it becomes'
    ],
    realWorldExample: 'Apple\'s $150 level acted as resistance 5 times in 2021. When it finally broke above with high volume, it ran to $180 quickly.',
    professionalTip: 'Professional traders place stop losses just below support and take profits just below resistance. They don\'t wait for exact touches.'
  },
  {
    id: 'moving-averages',
    title: 'Moving Averages & Trends',
    icon: TrendingUp,
    difficulty: 'beginner',
    timeToLearn: '18 minutes',
    explanation: 'Moving averages smooth out price noise to show the underlying trend. Think of them as the "average opinion" of what a stock should be worth over time.',
    whatItMeans: 'When price is above the moving average, the trend is up. When below, trend is down. When they cross, trends might be changing.',
    howToUse: [
      '20-day MA: Short-term trend (about 1 month of trading)',
      '50-day MA: Medium-term trend (about 2.5 months)',
      '200-day MA: Long-term trend (about 10 months)',
      'Golden Cross: 50-day crosses above 200-day (bullish)'
    ],
    whyImportant: 'Moving averages keep you on the right side of trends and help you avoid buying stocks that are in long-term decline.',
    practicalTips: [
      'Use multiple timeframes for confirmation',
      'Price above all MAs = strong uptrend',
      'Buy when price bounces off rising MA',
      'Sell when price breaks below key MA with volume'
    ],
    realWorldExample: 'Netflix held above its 200-day MA for 2 years (2019-2021). When it broke below in early 2022, it fell from $690 to $190.',
    professionalTip: 'Institutional investors use the 200-day MA as their primary trend filter. They rarely buy stocks trading below this level.'
  },
  {
    id: 'momentum-indicators',
    title: 'Momentum Indicators (RSI, MACD)',
    icon: Activity,
    difficulty: 'intermediate',
    timeToLearn: '30 minutes',
    explanation: 'Momentum indicators are like speedometers for stock prices. They tell you if a move is strong or weak, and if it\'s running out of steam.',
    whatItMeans: 'These tools help you spot when stocks are overbought (due for a pullback) or oversold (due for a bounce), even during strong trends.',
    howToUse: [
      'RSI above 70: Overbought (consider selling)',
      'RSI below 30: Oversold (consider buying)',
      'MACD line crosses above signal: Bullish momentum',
      'MACD histogram: Shows if momentum is accelerating'
    ],
    whyImportant: 'These indicators help you avoid buying at tops and selling at bottoms by showing when emotions are extreme.',
    practicalTips: [
      'RSI works best in sideways markets, less reliable in strong trends',
      'MACD is better for trending markets',
      'Look for divergences: price makes new high but indicator doesn\'t',
      'Use with other indicators for confirmation'
    ],
    realWorldExample: 'GameStop hit RSI of 95 during the meme stock craze (Jan 2021), signaling extreme overbought conditions before the crash from $480 to $40.',
    professionalTip: 'Hedge funds use momentum divergences as early warning signals. When price makes new highs but momentum doesn\'t, they often start selling.'
  },
  {
    id: 'volume-analysis',
    title: 'Volume Analysis',
    icon: Volume2,
    difficulty: 'intermediate',
    timeToLearn: '22 minutes',
    explanation: 'Volume is like the fuel that drives price movements. High volume confirms that a move is real and backed by conviction, while low volume suggests weak moves.',
    whatItMeans: 'When many people are buying or selling (high volume), price moves are more reliable. When few people trade (low volume), moves can be fake.',
    howToUse: [
      'Breakouts need high volume to be trusted',
      'Volume should increase in direction of trend',
      'High volume at support/resistance confirms the level',
      'Volume spikes often mark important turns'
    ],
    whyImportant: 'Volume separates real moves from fake ones. It\'s the difference between a stock breaking out vs. just having a temporary pop.',
    practicalTips: [
      'Compare today\'s volume to 20-day average',
      'Volume should be 50% above average for significant moves',
      'Watch for volume dry-ups at tops and bottoms',
      'Institutional selling creates consistent high volume'
    ],
    realWorldExample: 'When Zoom broke above $500 in 2020, it was on 5x normal volume, confirming the breakout. Without volume, it would have been a false signal.',
    professionalTip: 'Professional traders never trust breakouts without volume confirmation. "Volume precedes price" is a fundamental rule in institutional trading.'
  },
  {
    id: 'candlestick-patterns',
    title: 'Candlestick Patterns',
    icon: BarChart3,
    difficulty: 'advanced',
    timeToLearn: '35 minutes',
    explanation: 'Candlestick patterns are like reading the battlefield of buyers vs. sellers. Each candle tells a story about who won that day\'s fight.',
    whatItMeans: 'These patterns show the psychology and emotions of traders in real-time, giving you insights into whether buyers or sellers are in control.',
    howToUse: [
      'Doji: Indecision, potential reversal signal',
      'Hammer: Buyers step in after selling, bullish reversal',
      'Shooting Star: Sellers overwhelm buyers, bearish reversal',
      'Engulfing patterns: One side completely dominates'
    ],
    whyImportant: 'Candlestick patterns give you precise entry and exit points, often providing 1-2 day advance warning of trend changes.',
    practicalTips: [
      'Most powerful at support/resistance levels',
      'Confirm with volume and other indicators',
      'Morning/Evening stars are most reliable reversal patterns',
      'Don\'t trade single candlesticks - look for clusters'
    ],
    realWorldExample: 'Bitcoin formed a perfect evening star pattern at $69,000 in November 2021, warning of the 50% crash that followed over next 2 months.',
    professionalTip: 'Japanese institutional traders developed these patterns over centuries. The most reliable ones are confirmed by Western technical indicators.'
  },
  {
    id: 'advanced-strategies',
    title: 'Advanced Trading Strategies',
    icon: Target,
    difficulty: 'advanced',
    timeToLearn: '40 minutes',
    explanation: 'Advanced strategies combine multiple technical tools to create high-probability trading setups with defined risk and reward ratios.',
    whatItMeans: 'You\'re building a systematic approach that removes emotion and gives you specific rules for when to buy, sell, and cut losses.',
    howToUse: [
      'Triple confirmation: Price, volume, and momentum align',
      'Risk management: Never risk more than 2% per trade',
      'Multiple timeframe analysis: Daily, weekly, monthly agreement',
      'Market context: Trade with overall market direction'
    ],
    whyImportant: 'Professional-level strategies dramatically improve your win rate and help you preserve capital during losing streaks.',
    practicalTips: [
      'Backtest strategies on historical data first',
      'Keep detailed trading journal with screenshots',
      'Scale position size based on conviction level',
      'Always have exit plan before entering trade'
    ],
    realWorldExample: 'The "MACD + RSI + Volume breakout" strategy would have caught Tesla\'s move from $200 to $400 in 2020 while avoiding most false signals.',
    professionalTip: 'Institutional traders combine 5-7 indicators for entry signals. They focus more on risk management than being right on individual trades.'
  }
];

export const TechnicalAnalysisLearningGuide = () => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const selectedConceptData = technicalConcepts.find(c => c.id === selectedConcept);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-muted/10 text-muted-foreground border-border/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="backdrop-blur-md bg-card/60 border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Technical Analysis Mastery - Professional Trading Guide
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs"
          >
            {showGuide ? 'Hide Guide' : 'Learn Technical Analysis'}
          </Button>
        </div>
      </CardHeader>

      {showGuide && (
        <CardContent>
          <div className="space-y-6">
            {/* Overview */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">📈 Master Professional Chart Reading</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Learn the same technical analysis techniques used by Wall Street professionals and institutional traders. 
                This comprehensive guide teaches you to read market psychology through price action and timing.
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center p-2 bg-green-500/10 rounded">
                  <p className="font-medium text-green-500">FOUNDATION</p>
                  <p className="text-muted-foreground">Charts, trends, support/resistance</p>
                </div>
                <div className="text-center p-2 bg-yellow-500/10 rounded">
                  <p className="font-medium text-yellow-500">INTERMEDIATE</p>
                  <p className="text-muted-foreground">Indicators, patterns, volume</p>
                </div>
                <div className="text-center p-2 bg-red-500/10 rounded">
                  <p className="font-medium text-red-500">ADVANCED</p>
                  <p className="text-muted-foreground">Professional strategies</p>
                </div>
              </div>
            </div>

            {/* Concept Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technicalConcepts.map((concept) => {
                const IconComponent = concept.icon;
                return (
                  <Button
                    key={concept.id}
                    variant={selectedConcept === concept.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedConcept(concept.id)}
                    className="h-auto p-3 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium text-xs">{concept.title}</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <Badge className={`text-xs ${getDifficultyColor(concept.difficulty)}`}>
                        {getDifficultyLabel(concept.difficulty)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">⏱ {concept.timeToLearn}</span>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Detailed Explanation */}
            {selectedConceptData && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <selectedConceptData.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedConceptData.title}</h3>
                    <Badge className={`${getDifficultyColor(selectedConceptData.difficulty)} mt-1`}>
                      {getDifficultyLabel(selectedConceptData.difficulty)}
                    </Badge>
                  </div>
                </div>

                {/* What it is */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Simple Explanation
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedConceptData.explanation}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      What This Means for Your Trading
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedConceptData.whatItMeans}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      How to Use This Technique
                    </h4>
                    <div className="space-y-1">
                      {selectedConceptData.howToUse.map((item, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Why This Is Critical for Success
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedConceptData.whyImportant}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Practical Tips for Implementation
                    </h4>
                    <div className="space-y-1">
                      {selectedConceptData.practicalTips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Real Market Example
                    </h4>
                    <p className="text-sm text-muted-foreground italic bg-primary/5 p-3 rounded border-l-2 border-primary/30">
                      {selectedConceptData.realWorldExample}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Professional Trader Insight
                    </h4>
                    <p className="text-sm text-muted-foreground bg-yellow-500/5 p-3 rounded border-l-2 border-yellow-500/30">
                      <strong>Wall Street Secret:</strong> {selectedConceptData.professionalTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Prompt to select */}
            {!selectedConceptData && (
              <div className="text-center py-8 text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a technical analysis concept above to begin your professional trading education.</p>
                <p className="text-sm mt-1">Each lesson includes real examples and institutional trading secrets.</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};