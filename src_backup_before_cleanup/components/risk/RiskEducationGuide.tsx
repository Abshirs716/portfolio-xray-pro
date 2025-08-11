import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield, 
  AlertTriangle,
  Target,
  BarChart3,
  Zap,
  DollarSign,
  Timer,
  Users
} from 'lucide-react';

interface RiskMetric {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  yourValue: string;
  category: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  explanation: string;
  whatItMeans: string;
  howToRead: string[];
  whyItMatters: string;
  actionableInsights: string[];
  realWorldExample: string;
  professionalTip: string;
}

const riskMetrics: RiskMetric[] = [
  {
    id: 'overall-risk',
    title: 'Overall Risk Score (8.1/10)',
    icon: Shield,
    yourValue: '8.1 out of 10',
    category: 'dangerous',
    explanation: 'Think of this like a credit score, but for investment risk. It combines all your portfolio risks into one number from 1 (super safe) to 10 (extremely risky).',
    whatItMeans: 'Your portfolio is in the HIGH RISK category. This means your investments could swing up or down dramatically.',
    howToRead: [
      '1-3: Conservative (like savings account safety)',
      '4-6: Moderate (like a balanced mutual fund)', 
      '7-8: Aggressive (like growth stocks)',
      '9-10: Speculative (like cryptocurrency or startups)'
    ],
    whyItMatters: 'This score helps you understand if your portfolio matches your risk tolerance. If you need stable income or are close to retirement, 8.1 might be too high.',
    actionableInsights: [
      'Consider diversifying into bonds or international stocks',
      'Reduce concentration in technology sector',
      'Set stop-loss orders to limit downside',
      'Only invest what you can afford to lose completely'
    ],
    realWorldExample: 'During the 2022 tech crash, portfolios like yours lost 20-30% while diversified portfolios lost only 10-15%.',
    professionalTip: 'Professional portfolio managers rarely go above 7/10 risk score unless the client specifically requests aggressive growth and can handle volatility.'
  },
  {
    id: 'sharpe-ratio',
    title: 'Sharpe Ratio (0.75)',
    icon: TrendingUp,
    yourValue: '0.75',
    category: 'poor',
    explanation: 'This measures "bang for your buck" in investing. It tells you how much extra return you get for taking on extra risk, compared to a safe investment like Treasury bonds.',
    whatItMeans: 'Your portfolio is NOT efficiently rewarding you for the high risk you\'re taking. You\'re getting poor returns relative to the risk.',
    howToRead: [
      'Above 1.5: Excellent (great returns for the risk)',
      '1.0-1.5: Good (decent risk-adjusted returns)',
      '0.8-1.0: Fair (moderate efficiency)',
      'Below 0.8: Poor (too much risk for the returns)'
    ],
    whyItMatters: 'A low Sharpe ratio means you could potentially get similar returns with less risk, or much better returns for the same risk.',
    actionableInsights: [
      'Your tech concentration is hurting risk-adjusted returns',
      'Consider adding defensive stocks or bonds',
      'Look for undervalued opportunities outside tech',
      'Review if the extra risk is worth it compared to index funds'
    ],
    realWorldExample: 'The S&P 500 typically has a Sharpe ratio around 1.0. Your 0.75 means you\'re taking more risk for worse risk-adjusted performance.',
    professionalTip: 'Warren Buffett looks for investments with Sharpe ratios above 1.0. Anything below 0.8 gets scrutinized heavily.'
  },
  {
    id: 'portfolio-beta',
    title: 'Portfolio Beta (1.35)',
    icon: Activity,
    yourValue: '1.35',
    category: 'dangerous',
    explanation: 'Beta measures how much your portfolio moves compared to the overall stock market. It\'s like a multiplier for market movements.',
    whatItMeans: 'When the market goes up 10%, your portfolio typically goes up 13.5%. When the market drops 10%, you lose 13.5%. You\'re more volatile than the market.',
    howToRead: [
      'Beta = 1.0: Moves exactly with the market',
      'Beta = 0.5: Half as volatile as market (defensive)',
      'Beta = 1.5: 50% more volatile than market (aggressive)',
      'Your 1.35: 35% more volatile than market'
    ],
    whyItMatters: 'High beta means bigger gains in bull markets but bigger losses in bear markets. It amplifies both your wins and losses.',
    actionableInsights: [
      'Expect 35% larger swings than the overall market',
      'In a market crash, you\'ll likely lose more than average',
      'Consider adding low-beta stocks (utilities, consumer staples)',
      'Perfect for bull markets, dangerous in bear markets'
    ],
    realWorldExample: 'In March 2020 when markets dropped 30%, portfolios with 1.35 beta typically lost 40%+. But in the recovery, they gained 35% more too.',
    professionalTip: 'Most professional portfolios target beta between 0.8-1.2. Above 1.3 is considered aggressive and requires careful monitoring.'
  },
  {
    id: 'volatility',
    title: '30-Day Volatility (22.5%)',
    icon: BarChart3,
    yourValue: '22.5% monthly swings',
    category: 'dangerous',
    explanation: 'Volatility measures how much your portfolio value bounces around. Think of it like measuring how bumpy a roller coaster ride is.',
    whatItMeans: 'Your portfolio typically swings up or down 22.5% in a month. That\'s VERY bumpy - like a high-speed roller coaster.',
    howToRead: [
      '0-10%: Smooth ride (like driving on a highway)',
      '10-20%: Moderate bumps (like city driving)',
      '20-30%: Very bumpy (like off-road driving)', 
      '30%+: Extreme turbulence (like a hurricane)'
    ],
    whyItMatters: 'High volatility can cause emotional stress and lead to bad decisions like selling at the bottom or buying at the top.',
    actionableInsights: [
      'Prepare mentally for large daily swings',
      'Don\'t check your portfolio daily if volatility stresses you',
      'Set aside emergency fund so you never need to sell at bad times',
      'Consider dollar-cost averaging to smooth out entry points'
    ],
    realWorldExample: 'With 22.5% volatility, a $100,000 portfolio might be worth $77,500 one month and $122,500 the next. That\'s normal for your risk level.',
    professionalTip: 'Institutional investors typically target 12-18% volatility. Above 20% requires strong conviction and risk management protocols.'
  },
  {
    id: 'max-drawdown',
    title: 'Max Drawdown (-15.2%)',
    icon: TrendingDown,
    yourValue: '-15.2% potential decline',
    category: 'poor',
    explanation: 'This shows the biggest loss your portfolio might experience from peak to bottom during a bad market period. It\'s like asking "what\'s the worst-case scenario?"',
    whatItMeans: 'Based on your portfolio\'s risk profile, you could lose 15.2% from your highest point before things start recovering.',
    howToRead: [
      '0-5%: Very safe (minor fluctuations)',
      '5-10%: Moderate (normal market corrections)',
      '10-20%: Significant (major market stress)',
      '20%+: Severe (bear market territory)'
    ],
    whyItMatters: 'This helps you mentally prepare for losses and ensure you can handle them financially and emotionally.',
    actionableInsights: [
      'Be prepared to see your portfolio drop 15%+ during bad times',
      'Don\'t invest money you\'ll need within 2-3 years',
      'Have 6+ months expenses in cash so you don\'t panic sell',
      'Remember: drawdowns are temporary if you stay invested'
    ],
    realWorldExample: 'During COVID crash (March 2020), tech-heavy portfolios lost 20-35%. Your -15.2% estimate might be conservative for extreme events.',
    professionalTip: 'Professional traders use position sizing to ensure no single drawdown can hurt them long-term. Never risk more than you can afford to lose.'
  },
  {
    id: 'value-at-risk',
    title: 'Value at Risk (-1.4%)',
    icon: AlertTriangle,
    yourValue: '-1.4% daily risk',
    category: 'fair',
    explanation: 'VaR tells you the most you\'re likely to lose on any single day, 95% of the time. It\'s like a daily "worst case scenario" forecast.',
    whatItMeans: 'On 95% of days, you won\'t lose more than 1.4%. But on the worst 5% of days (about once a month), you could lose much more.',
    howToRead: [
      '0-0.5%: Very stable daily movements',
      '0.5-1%: Normal daily fluctuations',
      '1-2%: Noticeable daily swings',
      '2%+: High daily volatility'
    ],
    whyItMatters: 'This helps you understand daily portfolio stress and set realistic expectations for short-term performance.',
    actionableInsights: [
      'Expect to lose 1.4%+ about once per month',
      'On extreme days (like earnings disasters), losses could be 3-5%+',
      'Don\'t panic on high-loss days - they\'re mathematically expected',
      'Use this to size positions appropriately'
    ],
    realWorldExample: 'If you have $100,000 invested, you might lose $1,400+ on a bad day. During events like earnings misses, you could lose $3,000-5,000 in one day.',
    professionalTip: 'Hedge funds typically maintain VaR below 1% through diversification and hedging. Your 1.4% reflects concentrated tech exposure.'
  },
  {
    id: 'concentration-risk',
    title: 'Concentration Risk (52.4% in largest position)',
    icon: Target,
    yourValue: '52.4% in GOOGL',
    category: 'dangerous',
    explanation: 'This measures how much of your portfolio depends on one single investment. It\'s like putting all your eggs in one basket.',
    whatItMeans: 'Over HALF your wealth is tied to Google\'s stock performance. If Google has problems, your entire portfolio suffers dramatically.',
    howToRead: [
      '0-20%: Well diversified (safe)',
      '20-30%: Moderate concentration (manageable)',
      '30-40%: High concentration (risky)',
      '40%+: Extreme concentration (very dangerous)'
    ],
    whyItMatters: 'Concentration risk is the #1 cause of portfolio disasters. Even great companies can have bad years or decades.',
    actionableInsights: [
      'Immediately reduce GOOGL to under 25% of portfolio',
      'Never let any single stock exceed 20% of your wealth',
      'Diversify across sectors, geographies, and asset classes',
      'Remember: diversification is the only free lunch in investing'
    ],
    realWorldExample: 'Enron employees had 60% in company stock and lost everything. Even Amazon dropped 94% from 1999-2001. No stock is "too big to fail."',
    professionalTip: 'Professional portfolio managers have strict rules: no single position above 5-10%. Your 52% would never be allowed in institutional portfolios.'
  }
];

export const RiskEducationGuide = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const selectedMetricData = riskMetrics.find(m => m.id === selectedMetric);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'good': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'poor': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'dangerous': return 'bg-red-500/10 text-red-500 border-red-500/30';
      default: return 'bg-muted/10 text-muted-foreground border-border/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'poor': return 'Poor';
      case 'dangerous': return 'High Risk';
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
              Risk Metrics Education - Portfolio Manager Training
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs"
          >
            {showGuide ? 'Hide Guide' : 'Learn Risk Analysis'}
          </Button>
        </div>
      </CardHeader>

      {showGuide && (
        <CardContent>
          <div className="space-y-6">
            {/* Overview */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">🎯 Your Portfolio Risk Assessment</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your portfolio shows <strong>HIGH CONCENTRATION RISK</strong> with significant exposure to technology stocks. 
                This creates both opportunities and dangers that professional portfolio managers would address immediately.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center p-2 bg-red-500/10 rounded">
                  <p className="font-medium text-red-500">IMMEDIATE CONCERNS</p>
                  <p className="text-muted-foreground">52% in one stock, 100% tech sector</p>
                </div>
                <div className="text-center p-2 bg-yellow-500/10 rounded">
                  <p className="font-medium text-yellow-500">ACTION REQUIRED</p>
                  <p className="text-muted-foreground">Diversification across sectors needed</p>
                </div>
              </div>
            </div>

            {/* Metric Selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {riskMetrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                  <Button
                    key={metric.id}
                    variant={selectedMetric === metric.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMetric(metric.id)}
                    className="h-auto p-3 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium text-xs">{metric.title.split('(')[0]}</span>
                    </div>
                    <Badge className={`text-xs ${getCategoryColor(metric.category)}`}>
                      {getCategoryLabel(metric.category)}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {/* Detailed Explanation */}
            {selectedMetricData && (
              <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <selectedMetricData.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMetricData.title}</h3>
                    <Badge className={`${getCategoryColor(selectedMetricData.category)} mt-1`}>
                      {getCategoryLabel(selectedMetricData.category)}
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
                    <p className="text-sm text-muted-foreground">{selectedMetricData.explanation}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      What Your Number Means
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedMetricData.whatItMeans}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      How to Read These Numbers
                    </h4>
                    <div className="space-y-1">
                      {selectedMetricData.howToRead.map((item, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Why This Matters for Your Wealth
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedMetricData.whyItMatters}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Action Items for You
                    </h4>
                    <div className="space-y-1">
                      {selectedMetricData.actionableInsights.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary">•</span>
                          <span className="text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Real-World Example
                    </h4>
                    <p className="text-sm text-muted-foreground italic">{selectedMetricData.realWorldExample}</p>
                  </div>

                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-primary flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Professional Portfolio Manager Tip
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedMetricData.professionalTip}</p>
                  </div>
                </div>
              </div>
            )}

            {!selectedMetricData && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm mb-2">Select a risk metric above to learn how to interpret it like a pro</p>
                <p className="text-xs">Understanding these metrics is crucial for building and managing wealth</p>
              </div>
            )}

            {/* Summary Action Plan */}
            {showGuide && (
              <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  URGENT: Professional Portfolio Manager Action Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-medium mb-2">Immediate Actions (Next 30 days):</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Reduce GOOGL position to under 25%</li>
                      <li>• Add bonds/REITs for stability</li>
                      <li>• Set stop-losses on tech positions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Long-term Strategy (Next 6 months):</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Diversify across 8-12 sectors</li>
                      <li>• Add international exposure</li>
                      <li>• Target overall risk score under 6.0</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};