import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PieChart, TrendingUp, Shield, Target, CheckCircle, BarChart3, Wallet } from "lucide-react";

const AssetAllocationLearning = () => {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Asset Allocation Mastery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understand different asset classes and how to build a balanced investment portfolio for optimal risk-adjusted returns
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
                <span className="text-sm">Understand major asset classes and their characteristics</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Learn strategic vs tactical asset allocation approaches</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Master age-based and goal-based allocation strategies</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Implement rebalancing and portfolio maintenance</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Asset Classes */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              Major Asset Classes Explained
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Equity Asset Classes</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <h4 className="font-semibold text-sm">US Stocks</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> High | <strong>Return:</strong> High<br/>
                        <strong>Examples:</strong> S&P 500, Total Stock Market<br/>
                        <strong>Best for:</strong> Long-term growth
                      </div>
                    </div>
                    
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-sm">International Developed</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> High | <strong>Return:</strong> Medium-High<br/>
                        <strong>Examples:</strong> Europe, Japan, Australia<br/>
                        <strong>Best for:</strong> Geographic diversification
                      </div>
                    </div>

                    <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Emerging Markets</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> Very High | <strong>Return:</strong> Very High<br/>
                        <strong>Examples:</strong> China, India, Brazil<br/>
                        <strong>Best for:</strong> Higher growth potential
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-400">Fixed Income & Alternatives</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Government Bonds</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> Low | <strong>Return:</strong> Low<br/>
                        <strong>Examples:</strong> Treasury bonds, TIPS<br/>
                        <strong>Best for:</strong> Capital preservation, deflation hedge
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Corporate Bonds</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> Medium | <strong>Return:</strong> Medium<br/>
                        <strong>Examples:</strong> Investment grade, high yield<br/>
                        <strong>Best for:</strong> Income generation
                      </div>
                    </div>

                    <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm">REITs & Commodities</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        <strong>Risk:</strong> Medium-High | <strong>Return:</strong> Medium-High<br/>
                        <strong>Examples:</strong> Real estate, gold, oil<br/>
                        <strong>Best for:</strong> Inflation hedge, diversification
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Asset Class Correlations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-primary">Low Correlation Pairs (Good for Diversification):</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• US Stocks + Government Bonds: 0.1</li>
                      <li>• Stocks + Gold: -0.1</li>
                      <li>• US + International Stocks: 0.7</li>
                      <li>• REITs + Technology Stocks: 0.4</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-warning">High Correlation Pairs (Less Diversification):</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• US Large Cap + US Small Cap: 0.8</li>
                      <li>• Corporate Bonds + Government Bonds: 0.9</li>
                      <li>• Growth Stocks + Tech Stocks: 0.85</li>
                      <li>• Emerging Markets + Commodities: 0.6</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Allocation Strategies */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Strategic Allocation Frameworks
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-success">Conservative (20s-30s)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>US Stocks</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <div className="flex justify-between">
                      <span>International</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    <div className="flex justify-between">
                      <span>Bonds</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <div className="flex justify-between">
                      <span>Alternatives</span>
                      <span>10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Goal:</strong> Capital preservation with modest growth
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-primary">Moderate (30s-50s)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>US Stocks</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    <div className="flex justify-between">
                      <span>International</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <div className="flex justify-between">
                      <span>Bonds</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    <div className="flex justify-between">
                      <span>Alternatives</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Goal:</strong> Balanced growth and income
                  </div>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-warning">Aggressive (Young investors)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>US Stocks</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="flex justify-between">
                      <span>International</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <div className="flex justify-between">
                      <span>Bonds</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                    <div className="flex justify-between">
                      <span>Alternatives</span>
                      <span>5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <strong>Goal:</strong> Maximum long-term growth
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Goal-Based Allocation Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-success">Retirement (30+ years):</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• 80% Stocks (growth focused)</li>
                      <li>• 15% Bonds (stability)</li>
                      <li>• 5% REITs (inflation protection)</li>
                      <li>• <strong>Strategy:</strong> Aggressive growth, long time horizon</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-warning">House Down Payment (5 years):</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• 40% Stocks (moderate growth)</li>
                      <li>• 50% Bonds (capital preservation)</li>
                      <li>• 10% Cash (liquidity)</li>
                      <li>• <strong>Strategy:</strong> Conservative, shorter timeline</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-primary">Emergency Fund:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• 0% Stocks (too risky)</li>
                      <li>• 20% Short-term bonds</li>
                      <li>• 80% High-yield savings</li>
                      <li>• <strong>Strategy:</strong> Maximum liquidity and safety</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-destructive">Retirement Income (65+):</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• 30% Stocks (inflation protection)</li>
                      <li>• 60% Bonds (income generation)</li>
                      <li>• 10% Cash (immediate needs)</li>
                      <li>• <strong>Strategy:</strong> Income and capital preservation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Rebalancing */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Rebalancing & Portfolio Maintenance
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">When to Rebalance</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Threshold-Based</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Rebalance when allocation drifts {'>'} 5-10% from target<br/>
                        <strong>Example:</strong> 60% stocks → 67% = Time to rebalance
                      </div>
                    </div>
                    
                    <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Time-Based</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Rebalance on fixed schedule (quarterly, annually)<br/>
                        <strong>Pros:</strong> Disciplined, easy to remember
                      </div>
                    </div>

                    <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                      <h4 className="font-semibold text-sm">Combination Approach</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Check quarterly, rebalance if {'>'} 5% drift<br/>
                        <strong>Best Practice:</strong> Most recommended approach
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-success">Rebalancing Methods</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Sell High, Buy Low</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Trim overweight positions, add to underweight<br/>
                        <strong>Tax Impact:</strong> May trigger capital gains
                      </div>
                    </div>
                    
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Cash Flow Rebalancing</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Direct new contributions to underweight assets<br/>
                        <strong>Advantage:</strong> No selling required, tax-efficient
                      </div>
                    </div>

                    <div className="p-3 bg-accent/10 rounded-lg">
                      <h4 className="font-semibold text-sm">Tax-Loss Harvesting</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        Sell losers for tax benefits while rebalancing<br/>
                        <strong>Benefit:</strong> Reduces tax burden
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Rebalancing Example</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-primary">Original Target</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>Stocks: 60% ($60k)</li>
                      <li>Bonds: 40% ($40k)</li>
                      <li><strong>Total:</strong> $100k</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-warning">After Growth</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>Stocks: 68% ($75k) ↑</li>
                      <li>Bonds: 32% ($35k) ↓</li>
                      <li><strong>Total:</strong> $110k</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-background/50 rounded">
                    <div className="font-semibold text-success">After Rebalancing</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>Stocks: 60% ($66k)</li>
                      <li>Bonds: 40% ($44k)</li>
                      <li><strong>Action:</strong> Sell $9k stocks, buy bonds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              Design Your Asset Allocation
            </h2>
            <p className="text-muted-foreground mb-4">
              Apply these principles to create and maintain your optimal asset allocation:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'overview' } })} className="w-full">
                View Your Asset Allocation
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

export default AssetAllocationLearning;