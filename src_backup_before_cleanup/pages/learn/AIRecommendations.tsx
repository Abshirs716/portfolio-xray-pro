import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, BarChart3, Shield, Target, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

const AIRecommendationsLearning = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AI Recommendations Mastery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master AI-powered investment recommendations through portfolio optimization, risk-adjusted strategies, and intelligent market analysis
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">10-15 min read</Badge>
              <Badge variant="outline">Intermediate Level</Badge>
            </div>
          </div>

          {/* Learning Objectives */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Learning Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Understand how AI analyzes portfolio optimization opportunities</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Learn risk-adjusted recommendation strategies</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Master market intelligence integration for smart decisions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Apply Modern Portfolio Theory in practice</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Portfolio Optimization */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              AI Portfolio Optimization Engine
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">How AI Analyzes Your Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-success">Current Holdings Analysis:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Position sizes and allocation percentages</li>
                      <li>• Sector concentration and geographic exposure</li>
                      <li>• Correlation between holdings</li>
                      <li>• Risk-return profile of each position</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-warning">Optimization Opportunities:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Overweight/underweight positions</li>
                      <li>• Missing asset classes or sectors</li>
                      <li>• High correlation risk clusters</li>
                      <li>• Inefficient risk-adjusted returns</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">Modern Portfolio Theory in Action</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">Efficient Frontier</h4>
                    <div className="space-y-2 text-xs">
                      <div>AI maps your portfolio's risk/return position</div>
                      <div className="bg-background/50 p-2 rounded">
                        <div>Current: 12% return, 18% volatility</div>
                        <div className="text-success">Optimal: 12% return, 15% volatility</div>
                      </div>
                      <div className="text-muted-foreground">Reduce risk by 3% with same returns</div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">Sharpe Optimization</h4>
                    <div className="space-y-2 text-xs">
                      <div>Maximize risk-adjusted returns</div>
                      <div className="bg-background/50 p-2 rounded">
                        <div>Current Sharpe: 0.65</div>
                        <div className="text-success">Target Sharpe: 0.85</div>
                      </div>
                      <div className="text-muted-foreground">+31% improvement in efficiency</div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm">Correlation Matrix</h4>
                    <div className="space-y-2 text-xs">
                      <div>Identify diversification gaps</div>
                      <div className="bg-background/50 p-2 rounded">
                        <div>Tech Stocks: 0.8 correlation</div>
                        <div className="text-warning">Add uncorrelated assets</div>
                      </div>
                      <div className="text-muted-foreground">Reduce portfolio volatility</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">AI Recommendation Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-success">Rebalancing Actions:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Trim overweight positions ({'>'}15% of portfolio)</li>
                      <li>• Add to underweight sectors</li>
                      <li>• Harvest tax losses while maintaining exposure</li>
                      <li>• Rotate from expensive to cheap assets</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-primary">New Positions:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Fill sector/geography gaps</li>
                      <li>• Add defensive assets during high volatility</li>
                      <li>• Include growth assets in stable markets</li>
                      <li>• Diversify with uncorrelated investments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Risk-Adjusted Strategies */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Risk-Adjusted Recommendation Framework
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-success">Conservative Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Risk Tolerance:</strong> Low (5-10% volatility)</div>
                    <div><strong>Time Horizon:</strong> 1-3 years</div>
                    <div><strong>AI Focus:</strong> Capital preservation</div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="font-semibold">Typical Recommendations:</div>
                    <div className="text-muted-foreground">• 60% bonds, 40% dividend stocks</div>
                    <div className="text-muted-foreground">• Blue chip companies (JNJ, PG, KO)</div>
                    <div className="text-muted-foreground">• Utility and consumer staple ETFs</div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-primary">Moderate Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Risk Tolerance:</strong> Medium (10-15% volatility)</div>
                    <div><strong>Time Horizon:</strong> 3-7 years</div>
                    <div><strong>AI Focus:</strong> Balanced growth</div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="font-semibold">Typical Recommendations:</div>
                    <div className="text-muted-foreground">• 70% stocks, 30% bonds</div>
                    <div className="text-muted-foreground">• Mix of growth and value stocks</div>
                    <div className="text-muted-foreground">• Broad market index funds (SPY, QQQ)</div>
                  </div>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-warning">Aggressive Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Risk Tolerance:</strong> High (15-25% volatility)</div>
                    <div><strong>Time Horizon:</strong> 7+ years</div>
                    <div><strong>AI Focus:</strong> Maximum growth</div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="font-semibold">Typical Recommendations:</div>
                    <div className="text-muted-foreground">• 90% stocks, 10% alternatives</div>
                    <div className="text-muted-foreground">• Growth stocks (NVDA, TSLA, AMZN)</div>
                    <div className="text-muted-foreground">• Small-cap and emerging market ETFs</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Dynamic Risk Adjustment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-primary">Market Conditions Impact:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• <strong>High VIX ({'>'}30):</strong> Recommend defensive positions</li>
                      <li>• <strong>Bull Market:</strong> Increase growth allocation</li>
                      <li>• <strong>Rising Rates:</strong> Favor financials, reduce bonds</li>
                      <li>• <strong>Recession Risk:</strong> Add gold, utilities, cash</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-success">AI Adaptive Features:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Real-time risk monitoring and alerts</li>
                      <li>• Automatic rebalancing triggers</li>
                      <li>• Market regime detection</li>
                      <li>• Stress testing under various scenarios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Market Intelligence Integration */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Market Intelligence & Data Integration
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">200+ Data Sources Analyzed</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Economic Data</div>
                    <div className="text-xs text-muted-foreground">GDP, inflation, employment</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Earnings Data</div>
                    <div className="text-xs text-muted-foreground">Revenue, margins, guidance</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Technical Signals</div>
                    <div className="text-xs text-muted-foreground">Momentum, volume, patterns</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Sentiment Data</div>
                    <div className="text-xs text-muted-foreground">News, social media, options</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Real-Time Signal Processing</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/5 border-l-4 border-success">
                      <div className="font-semibold text-sm">Bullish Confluence</div>
                      <div className="text-xs text-muted-foreground">
                        • Earnings beat + analyst upgrades + technical breakout<br/>
                        • AI Recommendation: Increase position size
                      </div>
                    </div>
                    <div className="p-3 bg-warning/5 border-l-4 border-warning">
                      <div className="font-semibold text-sm">Mixed Signals</div>
                      <div className="text-xs text-muted-foreground">
                        • Strong fundamentals + weak technicals<br/>
                        • AI Recommendation: Wait for confirmation
                      </div>
                    </div>
                    <div className="p-3 bg-destructive/5 border-l-4 border-destructive">
                      <div className="font-semibold text-sm">Bearish Confluence</div>
                      <div className="text-xs text-muted-foreground">
                        • Earnings miss + downgrades + technical breakdown<br/>
                        • AI Recommendation: Reduce or exit position
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Predictive Analytics</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Earnings Surprises</div>
                      <div className="text-xs text-muted-foreground">
                        Predict probability of earnings beats using historical patterns
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Analyst Revisions</div>
                      <div className="text-xs text-muted-foreground">
                        Forecast upcoming rating changes before they happen
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Sector Rotation</div>
                      <div className="text-xs text-muted-foreground">
                        Identify which sectors will outperform next quarter
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-3">Example: AI Recommendation Generation</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-2 bg-background/50 rounded">
                      <div className="font-semibold text-success">Input Data</div>
                      <div className="text-xs text-muted-foreground">
                        Portfolio: 40% NVDA, 30% TSLA, 30% Cash<br/>
                        Market: Tech correction, rising rates
                      </div>
                    </div>
                    <div className="p-2 bg-background/50 rounded">
                      <div className="font-semibold text-primary">AI Analysis</div>
                      <div className="text-xs text-muted-foreground">
                        Over-concentrated in tech (70%)<br/>
                        High correlation risk (0.8)<br/>
                        Missing defensive sectors
                      </div>
                    </div>
                    <div className="p-2 bg-background/50 rounded">
                      <div className="font-semibold text-warning">Recommendation</div>
                      <div className="text-xs text-muted-foreground">
                        1. Trim NVDA to 25% (take profits)<br/>
                        2. Add healthcare ETF (XLV) 15%<br/>
                        3. Add utilities (XLU) 10%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Get Your AI Recommendations
            </h2>
            <p className="text-muted-foreground mb-4">
              Apply your knowledge and get personalized AI recommendations for your portfolio:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'recommendations' } })} className="w-full">
                View Your AI Recommendations
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Update Portfolio Data
              </Button>
            </div>
          </Card>

          {/* Warning */}
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-destructive">Investment Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  AI recommendations are educational tools based on quantitative analysis and should not be considered 
                  personalized financial advice. Always consult with a qualified financial advisor and conduct your own 
                  research before making investment decisions. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsLearning;