import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, TrendingUp, Shield, Target, CheckCircle, Wallet, PieChart } from "lucide-react";

const PortfolioAnalysisLearning = () => {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Portfolio Analysis Fundamentals
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to analyze portfolio performance, diversification, and risk metrics effectively with professional techniques
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">8-12 min read</Badge>
              <Badge variant="outline">Beginner Level</Badge>
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
                <span className="text-sm">Calculate and interpret total portfolio returns</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Understand portfolio diversification metrics</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Analyze risk metrics and performance ratios</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Compare portfolio performance against benchmarks</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Portfolio Performance Metrics */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Essential Performance Metrics
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Return Calculations</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Total Return</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Formula:</strong> (Ending Value - Beginning Value + Dividends) / Beginning Value<br/>
                        <strong>Example:</strong> $100k → $115k + $2k dividends = 17% total return
                      </div>
                    </div>
                    
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Annualized Return</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Formula:</strong> ((Ending Value / Beginning Value)^(1/years)) - 1<br/>
                        <strong>Example:</strong> 44% over 3 years = 12.9% annualized
                      </div>
                    </div>

                    <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Time-Weighted Return</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Purpose:</strong> Eliminates impact of cash flows<br/>
                        <strong>Use:</strong> Comparing manager performance
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-success">Risk Metrics</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Standard Deviation</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Measures portfolio volatility<br/>
                        Lower = more stable returns
                      </div>
                    </div>
                    
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Beta</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Sensitivity to market movements<br/>
                        1.0 = moves with market, {'>'}1.0 = more volatile
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Maximum Drawdown</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Largest peak-to-trough decline<br/>
                        Shows worst-case scenario
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Performance Benchmarking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong className="text-primary">Market Benchmarks:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• S&P 500 (SPY): Large-cap US stocks</li>
                      <li>• NASDAQ (QQQ): Tech-heavy index</li>
                      <li>• Russell 2000 (IWM): Small-cap stocks</li>
                      <li>• Total Stock Market (VTI): Entire US market</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-success">Risk-Adjusted Metrics:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Alpha: Excess return vs benchmark</li>
                      <li>• Sharpe Ratio: Return per unit of risk</li>
                      <li>• Information Ratio: Active return/tracking error</li>
                      <li>• Calmar Ratio: Annual return/max drawdown</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-warning">Interpretation:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Positive Alpha = outperformed market</li>
                      <li>• Sharpe {'>'}1.0 = good risk-adjusted return</li>
                      <li>• Lower Beta = less market sensitivity</li>
                      <li>• Smaller drawdown = better downside protection</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Portfolio Composition Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              Portfolio Composition & Diversification
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Asset Allocation Analysis</h3>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Target vs Actual Allocation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>US Stocks (Target: 60%)</span>
                        <span className="text-success">Actual: 65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      
                      <div className="flex justify-between text-xs">
                        <span>International (Target: 20%)</span>
                        <span className="text-warning">Actual: 15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                      
                      <div className="flex justify-between text-xs">
                        <span>Bonds (Target: 20%)</span>
                        <span className="text-destructive">Actual: 20%</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-accent/10 rounded text-xs">
                    <strong>Analysis:</strong> Portfolio is overweight US stocks (+5%) and underweight international (-5%). 
                    Consider rebalancing by trimming US positions and adding international exposure.
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-success">Sector Concentration</h3>
                  <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Sector Weightings</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Technology</span>
                        <span className="text-warning">35% (High)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Healthcare</span>
                        <span className="text-success">15% (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financials</span>
                        <span className="text-success">12% (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumer Discretionary</span>
                        <span className="text-success">10% (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Others</span>
                        <span className="text-warning">28% (Low)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-warning/5 rounded text-xs">
                    <strong>Risk Alert:</strong> High tech concentration (35%) creates sector risk. 
                    Consider diversifying into defensive sectors like utilities, consumer staples, or REITs.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Correlation Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-primary">High Correlation Risk:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• AAPL + MSFT: 0.75 correlation</li>
                      <li>• NVDA + AMD: 0.82 correlation</li>
                      <li>• GOOGL + META: 0.68 correlation</li>
                      <li>• <strong>Problem:</strong> All move together in downturns</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-success">Diversification Opportunities:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Add utilities (low correlation to tech)</li>
                      <li>• Include gold or commodities (negative correlation)</li>
                      <li>• Add international exposure (different cycles)</li>
                      <li>• Include bonds (inverse correlation during stress)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Performance Attribution */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Performance Attribution Analysis
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">What Drove Your Returns?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-success">Top Contributors</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• NVDA: +8.2% (40% of gains)</li>
                      <li>• AAPL: +3.1% (20% of gains)</li>
                      <li>• MSFT: +2.7% (15% of gains)</li>
                      <li>• <strong>Total:</strong> +13.4% from top 3</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-destructive">Top Detractors</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• META: -2.1% (drag on returns)</li>
                      <li>• NFLX: -1.3% (sector rotation)</li>
                      <li>• Cash: -0.5% (opportunity cost)</li>
                      <li>• <strong>Total:</strong> -3.9% from bottom 3</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-primary">Net Attribution</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>• Stock Selection: +9.5%</li>
                      <li>• Sector Allocation: +1.2%</li>
                      <li>• Timing Effects: -0.8%</li>
                      <li>• <strong>Total Portfolio:</strong> +9.9%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h3 className="font-semibold text-success mb-3">Strengths Identified</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Stock Selection:</strong> Outperformed benchmarks in tech sector</li>
                    <li>• <strong>Concentration:</strong> Top holdings drove majority of returns</li>
                    <li>• <strong>Timing:</strong> Held through volatility for long-term gains</li>
                    <li>• <strong>Growth Focus:</strong> Benefited from growth stock outperformance</li>
                  </ul>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h3 className="font-semibold text-warning mb-3">Areas for Improvement</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Diversification:</strong> Reduce tech concentration risk</li>
                    <li>• <strong>Cash Drag:</strong> Too much idle cash missing opportunities</li>
                    <li>• <strong>International:</strong> Missing global growth opportunities</li>
                    <li>• <strong>Defensive:</strong> No protection during market downturns</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              Analyze Your Portfolio
            </h2>
            <p className="text-muted-foreground mb-4">
              Apply these analysis techniques to your actual portfolio and identify improvement opportunities:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'overview' } })} className="w-full">
                View Your Portfolio Analysis
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Update Holdings Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalysisLearning;