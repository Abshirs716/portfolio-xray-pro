import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Shield, AlertTriangle, TrendingUp, PieChart, Target, CheckCircle, BarChart3 } from "lucide-react";

const RiskAnalysisLearning = () => {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Risk Analysis Mastery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master portfolio risk management with advanced metrics, diversification strategies, and professional risk control techniques
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
                <span className="text-sm">Understand Value at Risk (VaR) and how to calculate it</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Master the Sharpe ratio for risk-adjusted returns</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Learn effective diversification across sectors and geographies</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Implement professional position sizing and risk management</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Key Risk Metrics */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Essential Risk Metrics Explained
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Value at Risk (VaR)
                </h3>
                <p className="text-muted-foreground mb-3">
                  VaR answers: "How much could I lose in a single day with 95% confidence?"
                </p>
                
                <div className="space-y-3">
                  <div className="bg-background/50 p-3 rounded">
                    <h4 className="font-semibold text-sm mb-2">Example Calculation:</h4>
                    <div className="text-sm space-y-1">
                      <div>Portfolio Value: $100,000</div>
                      <div>Daily Volatility: 2%</div>
                      <div className="text-destructive font-semibold">1-Day VaR (95%): $3,290</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <strong className="text-primary">How to Use VaR:</strong>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        <li>• Set position size limits</li>
                        <li>• Plan emergency liquidity</li>
                        <li>• Stress test portfolio</li>
                        <li>• Compare strategy risks</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-warning">VaR Limitations:</strong>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        <li>• Doesn't predict tail events</li>
                        <li>• Based on historical data</li>
                        <li>• Assumes normal distributions</li>
                        <li>• Misses correlation changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-success flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sharpe Ratio
                </h3>
                <p className="text-muted-foreground mb-3">
                  Measures risk-adjusted returns: (Return - Risk-free rate) / Volatility
                </p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-background/50 p-3 rounded">
                      <div className="text-2xl font-bold text-success">2.0+</div>
                      <div className="text-xs text-muted-foreground">Excellent</div>
                    </div>
                    <div className="bg-background/50 p-3 rounded">
                      <div className="text-2xl font-bold text-primary">1.0-2.0</div>
                      <div className="text-xs text-muted-foreground">Good</div>
                    </div>
                    <div className="bg-background/50 p-3 rounded">
                      <div className="text-2xl font-bold text-destructive">&lt;1.0</div>
                      <div className="text-xs text-muted-foreground">Poor</div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded">
                    <h4 className="font-semibold text-primary mb-2">Real-World Examples:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <strong>Warren Buffett (Berkshire):</strong>
                        <div className="text-muted-foreground">Sharpe Ratio: ~0.8 (Lower vol, steady gains)</div>
                      </div>
                      <div>
                        <strong>Tech Growth Funds:</strong>
                        <div className="text-muted-foreground">Sharpe Ratio: ~1.2 (Higher vol, higher returns)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Diversification Score
                </h3>
                <p className="text-muted-foreground mb-3">
                  Measures how spread out your investments are across different assets and sectors
                </p>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Single Stock (Score: 1/10)</span>
                      <Badge variant="destructive">Extremely Risky</Badge>
                    </div>
                    <Progress value={10} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>5 Stocks, Same Sector (Score: 4/10)</span>
                      <Badge variant="outline" className="bg-warning/20">High Risk</Badge>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>15+ Stocks, Multiple Sectors (Score: 8/10)</span>
                      <Badge variant="default" className="bg-success">Well Diversified</Badge>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Diversification Strategies */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              Professional Diversification Framework
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-accent/10 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-primary">Sector Diversification</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Technology</span>
                      <span className="text-muted-foreground">20-25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Healthcare</span>
                      <span className="text-muted-foreground">15-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financials</span>
                      <span className="text-muted-foreground">15-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consumer</span>
                      <span className="text-muted-foreground">10-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Energy/Materials</span>
                      <span className="text-muted-foreground">10-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities/REITs</span>
                      <span className="text-muted-foreground">5-10%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-success">Geographic Diversification</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>US Large Cap</span>
                      <span className="text-muted-foreground">50-60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>US Small/Mid Cap</span>
                      <span className="text-muted-foreground">10-15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Developed International</span>
                      <span className="text-muted-foreground">20-25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emerging Markets</span>
                      <span className="text-muted-foreground">5-10%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border">
                  <h3 className="font-semibold mb-3 text-warning">Asset Class Mix</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Growth Stocks</span>
                      <span className="text-muted-foreground">40-50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value Stocks</span>
                      <span className="text-muted-foreground">20-30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonds/Fixed Income</span>
                      <span className="text-muted-foreground">20-30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alternatives (REITs, Commodities)</span>
                      <span className="text-muted-foreground">5-10%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-3">Correlation-Based Diversification</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Look for assets that don't move together. When tech stocks fall, these might rise:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Utilities</div>
                    <div className="text-xs text-muted-foreground">Low correlation</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Gold/Commodities</div>
                    <div className="text-xs text-muted-foreground">Negative correlation</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">Bonds</div>
                    <div className="text-xs text-muted-foreground">Flight to safety</div>
                  </div>
                  <div className="text-center p-2 bg-background/50 rounded">
                    <div className="font-semibold">International</div>
                    <div className="text-xs text-muted-foreground">Different cycles</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Position Sizing & Risk Management */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Professional Risk Management Rules
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Position Sizing Rules</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/5 border-l-4 border-success">
                      <div className="font-semibold text-sm">Conservative (5-10%)</div>
                      <div className="text-xs text-muted-foreground">Blue chip stocks, index funds</div>
                    </div>
                    <div className="p-3 bg-warning/5 border-l-4 border-warning">
                      <div className="font-semibold text-sm">Moderate (3-5%)</div>
                      <div className="text-xs text-muted-foreground">Growth stocks, sector ETFs</div>
                    </div>
                    <div className="p-3 bg-destructive/5 border-l-4 border-destructive">
                      <div className="font-semibold text-sm">Aggressive (1-3%)</div>
                      <div className="text-xs text-muted-foreground">Speculative plays, small caps</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Stop Loss Strategy</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Technical Stop: -8%</div>
                      <div className="text-xs text-muted-foreground">Below key support levels</div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Volatility Stop: -15%</div>
                      <div className="text-xs text-muted-foreground">2x average daily range</div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Time Stop: 3 months</div>
                      <div className="text-xs text-muted-foreground">If thesis hasn't played out</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Kelly Criterion for Position Sizing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Formula:</h4>
                    <div className="bg-background/50 p-2 rounded font-mono text-sm">
                      f = (bp - q) / b
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      f = fraction to bet<br/>
                      b = odds (reward/risk)<br/>
                      p = probability of winning<br/>
                      q = probability of losing
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Example:</h4>
                    <div className="text-sm space-y-1">
                      <div>Win rate: 60% (p = 0.6)</div>
                      <div>Average win: +15%</div>
                      <div>Average loss: -8%</div>
                      <div className="text-primary font-semibold">Optimal size: 8.75% of portfolio</div>
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
              Analyze Your Portfolio Risk
            </h2>
            <p className="text-muted-foreground mb-4">
              Apply your knowledge to evaluate and improve your current portfolio's risk profile:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'risk' } })} className="w-full">
                View Your Risk Analysis
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Rebalance Portfolio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisLearning;