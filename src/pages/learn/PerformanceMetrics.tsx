import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Brain, Shield } from "lucide-react";

const PerformanceMetricsLearning = () => {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Performance Metrics Mastery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master key performance indicators like Sharpe ratio, alpha, beta, and tracking error for professional portfolio analysis
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">15-20 min read</Badge>
              <Badge variant="outline">Advanced Level</Badge>
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
                <span className="text-sm">Calculate and interpret Sharpe, Sortino, and Calmar ratios</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Understand alpha, beta, and tracking error metrics</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Master information ratio and attribution analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Apply metrics for manager selection and performance evaluation</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Risk-Adjusted Return Metrics */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Risk-Adjusted Return Metrics
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Sharpe Ratio</h3>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Formula & Interpretation</h4>
                    <div className="bg-background/50 p-2 rounded font-mono text-sm mb-2">
                      (Portfolio Return - Risk-free Rate) / Standard Deviation
                    </div>
                    <div className="space-y-2 text-xs">
                      <div><strong>Measures:</strong> Excess return per unit of total risk</div>
                      <div><strong>Good Score:</strong> {'>'} 1.0 (excellent {'>'} 2.0)</div>
                      <div><strong>Use Case:</strong> Comparing different strategies or funds</div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                      <strong>Example:</strong> Portfolio returns 12%, risk-free rate 3%, volatility 15%<br/>
                      Sharpe = (12% - 3%) / 15% = 0.60 (Below average)
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-success">Sortino Ratio</h3>
                  <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Enhanced Risk Measurement</h4>
                    <div className="bg-background/50 p-2 rounded font-mono text-sm mb-2">
                      (Portfolio Return - Target Return) / Downside Deviation
                    </div>
                    <div className="space-y-2 text-xs">
                      <div><strong>Advantage:</strong> Only penalizes downside volatility</div>
                      <div><strong>Logic:</strong> Upside volatility is good, downside is bad</div>
                      <div><strong>Better than Sharpe:</strong> For asymmetric return distributions</div>
                    </div>
                    
                    <div className="mt-3 p-2 bg-success/10 rounded text-xs">
                      <strong>Example:</strong> Same portfolio with 8% downside deviation<br/>
                      Sortino = (12% - 3%) / 8% = 1.125 (Much better than Sharpe!)
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h3 className="font-semibold text-warning mb-2">Calmar Ratio</h3>
                  <div className="bg-background/50 p-2 rounded font-mono text-sm mb-2">
                    Annual Return / Maximum Drawdown
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><strong>Focus:</strong> Return vs worst-case scenario</div>
                    <div><strong>Good Score:</strong> {'>'} 0.5 (excellent {'>'} 1.0)</div>
                    <div><strong>Ideal for:</strong> Conservative investors, downside protection</div>
                  </div>
                  <div className="mt-2 p-2 bg-warning/10 rounded text-xs">
                    <strong>Example:</strong> 10% annual return, 20% max drawdown = 0.5 Calmar
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <h3 className="font-semibold text-blue-400 mb-2">Information Ratio</h3>
                  <div className="bg-background/50 p-2 rounded font-mono text-sm mb-2">
                    (Portfolio Return - Benchmark Return) / Tracking Error
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><strong>Measures:</strong> Active return vs active risk</div>
                    <div><strong>Good Score:</strong> {'>'} 0.5 (excellent {'>'} 1.0)</div>
                    <div><strong>Perfect for:</strong> Active manager evaluation</div>
                  </div>
                  <div className="mt-2 p-2 bg-blue-500/10 rounded text-xs">
                    <strong>Example:</strong> Beat S&P by 2% with 4% tracking error = 0.5 IR
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Metric Comparison Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">Portfolio</th>
                        <th className="text-center p-2">Return</th>
                        <th className="text-center p-2">Volatility</th>
                        <th className="text-center p-2">Sharpe</th>
                        <th className="text-center p-2">Sortino</th>
                        <th className="text-center p-2">Max DD</th>
                        <th className="text-center p-2">Calmar</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr className="border-b border-border/50">
                        <td className="p-2 font-semibold">Conservative</td>
                        <td className="text-center p-2">8%</td>
                        <td className="text-center p-2">6%</td>
                        <td className="text-center p-2 text-success">0.83</td>
                        <td className="text-center p-2 text-success">1.25</td>
                        <td className="text-center p-2">-5%</td>
                        <td className="text-center p-2 text-success">1.60</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="p-2 font-semibold">Balanced</td>
                        <td className="text-center p-2">11%</td>
                        <td className="text-center p-2">12%</td>
                        <td className="text-center p-2 text-primary">0.67</td>
                        <td className="text-center p-2 text-primary">0.89</td>
                        <td className="text-center p-2">-15%</td>
                        <td className="text-center p-2 text-primary">0.73</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Aggressive</td>
                        <td className="text-center p-2">15%</td>
                        <td className="text-center p-2">20%</td>
                        <td className="text-center p-2 text-warning">0.60</td>
                        <td className="text-center p-2 text-warning">0.75</td>
                        <td className="text-center p-2">-30%</td>
                        <td className="text-center p-2 text-warning">0.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <strong>Analysis:</strong> Conservative portfolio has best risk-adjusted returns despite lower absolute returns
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Alpha, Beta, and Tracking Error */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Alpha, Beta & Tracking Metrics
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h3 className="font-semibold text-success mb-3">Alpha (α)</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Definition:</strong> Excess return vs expected return based on beta</div>
                    <div><strong>Formula:</strong> Portfolio Return - (Risk-free + Beta × Market Premium)</div>
                    <div><strong>Interpretation:</strong></div>
                    <ul className="text-xs text-muted-foreground ml-3">
                      <li>• Positive: Outperformed expectations</li>
                      <li>• Zero: Performed as expected</li>
                      <li>• Negative: Underperformed</li>
                    </ul>
                  </div>
                  <div className="mt-3 p-2 bg-success/10 rounded text-xs">
                    <strong>Example:</strong> Portfolio returned 14%, expected 12% based on beta<br/>
                    Alpha = +2% (Excellent manager skill!)
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold text-primary mb-3">Beta (β)</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Definition:</strong> Sensitivity to market movements</div>
                    <div><strong>Calculation:</strong> Covariance(Portfolio, Market) / Variance(Market)</div>
                    <div><strong>Interpretation:</strong></div>
                    <ul className="text-xs text-muted-foreground ml-3">
                      <li>• β = 1.0: Moves with market</li>
                      <li>• β {'>'} 1.0: More volatile than market</li>
                      <li>• β {'<'} 1.0: Less volatile than market</li>
                    </ul>
                  </div>
                  <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                    <strong>Example:</strong> β = 1.3 means if market goes up 10%, portfolio likely goes up 13%
                  </div>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h3 className="font-semibold text-warning mb-3">Tracking Error</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Definition:</strong> Standard deviation of excess returns vs benchmark</div>
                    <div><strong>Formula:</strong> StdDev(Portfolio Return - Benchmark Return)</div>
                    <div><strong>Typical Ranges:</strong></div>
                    <ul className="text-xs text-muted-foreground ml-3">
                      <li>• Index funds: 0.1-0.5%</li>
                      <li>• Active funds: 2-6%</li>
                      <li>• Hedge funds: 5-15%</li>
                    </ul>
                  </div>
                  <div className="mt-3 p-2 bg-warning/10 rounded text-xs">
                    <strong>Use:</strong> Higher tracking error = more active management (higher fees justified if alpha {'>'} 0)
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">CAPM and Security Market Line</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-primary">Capital Asset Pricing Model (CAPM):</strong>
                    <div className="bg-background/50 p-2 rounded font-mono text-xs mt-1 mb-2">
                      Expected Return = Risk-free + Beta × (Market Return - Risk-free)
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Theoretical framework for asset pricing</li>
                      <li>• Assumes efficient markets and rational investors</li>
                      <li>• Higher beta = higher expected return required</li>
                      <li>• Forms basis for alpha calculation</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-success">Practical Applications:</strong>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• <strong>Portfolio Construction:</strong> Balance high/low beta assets</li>
                      <li>• <strong>Manager Evaluation:</strong> Risk-adjusted performance</li>
                      <li>• <strong>Cost of Capital:</strong> Required return for investments</li>
                      <li>• <strong>Risk Budgeting:</strong> Allocate risk across strategies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Real-World Example: Tech Portfolio Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div><strong>Portfolio Holdings:</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• NVDA (30%): β = 1.8, α = +5.2%</li>
                      <li>• AAPL (25%): β = 1.2, α = +1.8%</li>
                      <li>• MSFT (25%): β = 0.9, α = +2.1%</li>
                      <li>• GOOGL (20%): β = 1.1, α = +0.9%</li>
                    </ul>
                    <div className="text-xs"><strong>Portfolio β = 1.25, α = +2.8%</strong></div>
                  </div>
                  <div className="space-y-2">
                    <div><strong>Performance Analysis:</strong></div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• High beta (1.25) = 25% more volatile than market</li>
                      <li>• Positive alpha (+2.8%) = excellent stock selection</li>
                      <li>• Tracking error: 8.5% (high active management)</li>
                      <li>• Information ratio: 0.33 (2.8% / 8.5%)</li>
                    </ul>
                    <div className="text-xs text-success"><strong>Conclusion:</strong> Good manager, but high risk</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Attribution Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Performance Attribution Analysis
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Brinson Attribution Model</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Breaks down portfolio performance into allocation effect, selection effect, and interaction effect
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-background/50 rounded">
                    <h4 className="font-semibold text-success">Allocation Effect</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      <strong>Measures:</strong> Sector/asset class timing<br/>
                      <strong>Formula:</strong> (wp - wb) × (rb - rB)<br/>
                      <strong>Example:</strong> Overweight tech during tech rally = +2.1%
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <h4 className="font-semibold text-primary">Selection Effect</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      <strong>Measures:</strong> Stock picking within sectors<br/>
                      <strong>Formula:</strong> wb × (rp - rb)<br/>
                      <strong>Example:</strong> Picked NVDA over sector average = +1.8%
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <h4 className="font-semibold text-warning">Interaction Effect</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      <strong>Measures:</strong> Combined allocation + selection<br/>
                      <strong>Formula:</strong> (wp - wb) × (rp - rb)<br/>
                      <strong>Example:</strong> Overweight good stocks = +0.3%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-semibold mb-3">Sector Attribution Example</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Sector</span>
                      <span>Allocation</span>
                      <span>Selection</span>
                      <span>Total</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technology</span>
                      <span className="text-success">+1.2%</span>
                      <span className="text-success">+0.8%</span>
                      <span className="text-success">+2.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Healthcare</span>
                      <span className="text-warning">-0.3%</span>
                      <span className="text-success">+0.5%</span>
                      <span className="text-success">+0.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financials</span>
                      <span className="text-destructive">-0.8%</span>
                      <span className="text-warning">-0.2%</span>
                      <span className="text-destructive">-1.0%</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total</span>
                      <span className="text-success">+0.1%</span>
                      <span className="text-success">+1.1%</span>
                      <span className="text-success">+1.2%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold text-primary mb-3">Key Insights</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Stock Selection Strength:</strong> +1.1% from picking winners within sectors</li>
                    <li>• <strong>Allocation Neutral:</strong> +0.1% from sector timing (not much skill here)</li>
                    <li>• <strong>Tech Success:</strong> Right stocks in right sector at right time</li>
                    <li>• <strong>Financial Weakness:</strong> Poor sector timing and stock selection</li>
                    <li>• <strong>Overall:</strong> Good stock picker, mediocre sector timer</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <h3 className="font-semibold text-destructive mb-3">Common Attribution Pitfalls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-warning">Data Quality Issues:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Benchmark mismatch (wrong comparison)</li>
                      <li>• Timing differences (month-end vs real trades)</li>
                      <li>• Transaction costs not included</li>
                      <li>• Currency effects in international portfolios</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-destructive">Interpretation Errors:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Short-term luck vs long-term skill</li>
                      <li>• Style drift not accounted for</li>
                      <li>• Risk not considered (may be taking excessive risk)</li>
                      <li>• Market regime changes affecting results</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Analyze Your Performance Metrics
            </h2>
            <p className="text-muted-foreground mb-4">
              Apply these professional metrics to evaluate your portfolio's risk-adjusted performance:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'overview' } })} className="w-full">
                View Your Performance Metrics
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Improve Your Portfolio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsLearning;