import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, Target, BarChart3, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const AIPredictionsLearning = () => {
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
              AI Predictions Masterclass
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master the art of AI-powered market forecasting with neural networks, ensemble models, and scenario analysis
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">12-15 min read</Badge>
              <Badge variant="outline">Intermediate Level</Badge>
            </div>
          </div>

          {/* Learning Objectives */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                What You'll Master in This Comprehensive Guide
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">AI Model Selection & Usage</h4>
                      <p className="text-sm text-muted-foreground">Learn when to use LSTM for time series, Random Forest for feature importance, and XGBoost for ensemble predictions. Understand each model's strengths and optimal market conditions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Confidence Level Interpretation</h4>
                      <p className="text-sm text-muted-foreground">Master reading confidence intervals (85%+, 70-84%, &lt;70%) and translate them into position sizing, entry timing, and risk management decisions with real trading examples.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Ensemble Model Benefits</h4>
                      <p className="text-sm text-muted-foreground">Understand why combining multiple AI models (LSTM + Random Forest + XGBoost) produces more reliable predictions than any single model alone.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Scenario-Based Decision Framework</h4>
                      <p className="text-sm text-muted-foreground">Apply Bull/Base/Bear case analysis to create robust strategies that perform across different market conditions, with specific probability-weighted position sizing formulas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Professional Integration Workflow</h4>
                      <p className="text-sm text-muted-foreground">Build systematic approaches to integrate AI predictions into daily analysis, including backtesting validation, performance tracking, and continuous improvement processes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Advanced Pattern Recognition</h4>
                      <p className="text-sm text-muted-foreground">Identify when AI models detect patterns invisible to traditional analysis, and learn how to validate these insights before acting on them in live markets.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 1: AI Prediction Models */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Prediction Models: Deep Dive & Practical Usage
            </h2>
            
            <div className="space-y-8">
              {/* LSTM Section */}
              <div className="border-l-4 border-blue-400 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-400">LSTM Neural Networks</h3>
                <p className="text-muted-foreground mb-4">
                  Long Short-Term Memory networks excel at finding sequential patterns in stock prices by maintaining memory of important past events.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">How LSTM Works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Memory Cells:</strong> Remember price patterns from 50-200 days ago</li>
                      <li>• <strong>Forget Gates:</strong> Discard irrelevant old information automatically</li>
                      <li>• <strong>Input Gates:</strong> Decide which new price data to store</li>
                      <li>• <strong>Output Gates:</strong> Control what information influences predictions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Best Use Cases:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Trend Continuation:</strong> Predicting if current trends will persist</li>
                      <li>• <strong>Seasonal Patterns:</strong> Detecting recurring price cycles</li>
                      <li>• <strong>Momentum Shifts:</strong> Identifying when trends may reverse</li>
                      <li>• <strong>Volatility Clustering:</strong> Forecasting periods of high/low volatility</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-400/5 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-muted-foreground">
                    LSTM predictions are most reliable for stocks with clear historical patterns. Works exceptionally well for tech stocks with recurring cycles and momentum-driven assets like cryptocurrencies.
                  </p>
                </div>
              </div>

              {/* Random Forest Section */}
              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-green-400">Random Forest Ensemble</h3>
                <p className="text-muted-foreground mb-4">
                  Random Forest combines hundreds of decision trees to create robust predictions that work well across different market conditions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">How Random Forest Works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Bootstrap Sampling:</strong> Each tree trains on different data subsets</li>
                      <li>• <strong>Feature Randomness:</strong> Trees use different combinations of indicators</li>
                      <li>• <strong>Majority Voting:</strong> Final prediction comes from tree consensus</li>
                      <li>• <strong>Out-of-Bag Testing:</strong> Built-in validation without overfitting</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Key Benefits:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Feature Ranking:</strong> Shows which indicators matter most</li>
                      <li>• <strong>Noise Resistance:</strong> Handles erratic market data well</li>
                      <li>• <strong>Non-Linear Patterns:</strong> Captures complex relationships</li>
                      <li>• <strong>Market Regime Detection:</strong> Adapts to bull/bear markets</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-green-400/5 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-muted-foreground">
                    Random Forest excels during uncertain market periods because it doesn't rely on linear relationships. Particularly effective for value stocks and dividend-paying companies with multiple fundamental drivers.
                  </p>
                </div>
              </div>

              {/* XGBoost Section */}
              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-purple-400">XGBoost (Extreme Gradient Boosting)</h3>
                <p className="text-muted-foreground mb-4">
                  XGBoost sequentially builds models where each new model corrects the errors of previous ones, creating highly accurate predictions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">How XGBoost Works:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Gradient Boosting:</strong> Each tree learns from previous mistakes</li>
                      <li>• <strong>Regularization:</strong> Prevents overfitting with L1/L2 penalties</li>
                      <li>• <strong>Feature Selection:</strong> Automatically finds most predictive variables</li>
                      <li>• <strong>Early Stopping:</strong> Stops training when performance plateaus</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Performance Advantages:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>High Accuracy:</strong> Often outperforms other models</li>
                      <li>• <strong>Fast Training:</strong> Optimized for speed and memory</li>
                      <li>• <strong>Missing Data:</strong> Handles incomplete market data gracefully</li>
                      <li>• <strong>Cross-Validation:</strong> Built-in model validation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-purple-400/5 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-muted-foreground">
                    XGBoost shines when you have many different data types (technical, fundamental, sentiment). Perfect for earnings prediction and complex multi-factor analysis. Often used by professional quant funds.
                  </p>
                </div>
              </div>

              {/* Ensemble Benefits */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold mb-3 text-primary">🎯 Why We Combine All Three Models</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Complementary Strengths</h4>
                    <p className="text-muted-foreground">Each model sees different patterns. LSTM finds time trends, Random Forest identifies feature relationships, XGBoost optimizes for accuracy.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Risk Reduction</h4>
                    <p className="text-muted-foreground">When models disagree, it signals uncertainty. When they agree, it provides high-confidence signals for better position sizing.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Market Adaptability</h4>
                    <p className="text-muted-foreground">Different models perform better in different market conditions. The ensemble adapts automatically to changing market regimes.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Confidence Intervals */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Mastering Confidence Intervals & Risk Assessment
            </h2>
            
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Confidence levels tell you how much our AI models agree with each other. Higher agreement means higher probability of accuracy.
              </p>
              
              {/* High Confidence */}
              <div className="border border-success/30 bg-success/5 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-success">85%+ Confidence: High Conviction Signals</h3>
                    <Badge variant="default" className="bg-success">Very Reliable</Badge>
                  </div>
                  <Progress value={90} className="h-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What This Means:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• All 3 AI models strongly agree on direction</li>
                        <li>• Historical accuracy &gt; 75% on similar signals</li>
                        <li>• Clear trend with strong momentum</li>
                        <li>• Low probability of major surprises</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Position Size:</strong> 3-5% of portfolio</li>
                        <li>• <strong>Entry:</strong> Use limit orders near current price</li>
                        <li>• <strong>Stop Loss:</strong> 8-12% from entry</li>
                        <li>• <strong>Profit Target:</strong> Aim for prediction target</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-success/10 rounded border-l-4 border-success">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-success">Example:</strong> AAPL at $180 with 92% confidence for $195 target (+8.3%). 
                      All models see strong earnings momentum, institutional buying, and technical breakout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Medium Confidence */}
              <div className="border border-warning/30 bg-warning/5 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-warning">70-84% Confidence: Good Directional Bias</h3>
                    <Badge variant="outline" className="bg-warning/20 text-warning">Good Signal</Badge>
                  </div>
                  <Progress value={77} className="h-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What This Means:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• 2 out of 3 models agree on direction</li>
                        <li>• Historical accuracy ~65% on similar signals</li>
                        <li>• Trend is present but some uncertainty</li>
                        <li>• Moderate risk of volatility</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Position Size:</strong> 1-3% of portfolio</li>
                        <li>• <strong>Entry:</strong> Wait for dips or confirmation</li>
                        <li>• <strong>Stop Loss:</strong> 6-10% from entry</li>
                        <li>• <strong>Profit Target:</strong> Take profits at 50-75% of target</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-warning/10 rounded border-l-4 border-warning">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-warning">Example:</strong> MSFT at $400 with 78% confidence for $420 target (+5%). 
                      LSTM and XGBoost bullish, but Random Forest sees mixed signals due to sector rotation concerns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Low Confidence */}
              <div className="border border-destructive/30 bg-destructive/5 p-6 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-destructive">Below 70% Confidence: Uncertain Territory</h3>
                    <Badge variant="destructive">Uncertain</Badge>
                  </div>
                  <Progress value={55} className="h-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What This Means:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Models strongly disagree on direction</li>
                        <li>• Historical accuracy &lt; 55% (coin flip territory)</li>
                        <li>• Market at inflection point</li>
                        <li>• High probability of volatility ahead</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Recommended Actions:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Position Size:</strong> 0% - Avoid new positions</li>
                        <li>• <strong>Existing Positions:</strong> Consider reducing size</li>
                        <li>• <strong>Alternative Strategy:</strong> Wait for clarity</li>
                        <li>• <strong>Opportunity:</strong> Prepare for breakout direction</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-destructive/10 rounded border-l-4 border-destructive">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-destructive">Example:</strong> TSLA at $250 with 45% confidence - conflicting signals. 
                      LSTM sees continuation, Random Forest expects reversal, XGBoost neutral. Wait for clearer direction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Strategy Framework */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold mb-4 text-primary">📊 Professional Position Sizing Formula</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">Kelly Criterion Application</h4>
                    <p className="text-muted-foreground">Position Size = (Confidence - 50%) × Risk Factor</p>
                    <p className="text-xs text-muted-foreground mt-2">Risk Factor = 0.1-0.2 for most retail traders</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">Risk-Adjusted Sizing</h4>
                    <p className="text-muted-foreground">90% confidence = 5% position<br/>80% confidence = 2% position<br/>70% confidence = 1% position</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <h4 className="font-semibold text-foreground mb-2">Portfolio Correlation</h4>
                    <p className="text-muted-foreground">Reduce position size if holding correlated assets to avoid concentration risk</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Scenario Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Advanced Scenario Analysis & Decision Framework
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Scenario analysis helps you prepare for multiple outcomes and make probabilistic decisions rather than binary predictions.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bull Case */}
              <div className="border border-success/30 bg-success/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-success mb-4 flex items-center gap-2">
                  🚀 Bull Case Analysis
                  <Badge variant="outline" className="bg-success/20 text-success text-xs">35% typical</Badge>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Catalysts:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Earnings Beat:</strong> 10-20% above estimates</li>
                      <li>• <strong>Sector Momentum:</strong> Institutional rotation in</li>
                      <li>• <strong>Technical Breakout:</strong> Clear resistance levels broken</li>
                      <li>• <strong>Macro Tailwinds:</strong> Favorable economic conditions</li>
                      <li>• <strong>Product Cycle:</strong> New launches or innovations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Expected Outcomes:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Price Target:</strong> +15-25% from current price</li>
                      <li>• <strong>Timeframe:</strong> 3-6 months typically</li>
                      <li>• <strong>Volume Spike:</strong> 2-3x average daily volume</li>
                      <li>• <strong>Momentum Duration:</strong> 4-8 weeks sustained</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-success/10 rounded border-l-4 border-success">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-success">Real Example:</strong> NVDA Q2 2023 - Bull case materialized with +25% move following AI demand surge and 429% revenue growth in data center segment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Base Case */}
              <div className="border border-primary/30 bg-primary/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  📈 Base Case Analysis
                  <Badge variant="outline" className="bg-primary/20 text-primary text-xs">45% typical</Badge>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Expected Conditions:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Earnings In-Line:</strong> Meet or slightly beat estimates</li>
                      <li>• <strong>Market Beta:</strong> Follow overall market direction</li>
                      <li>• <strong>Stable Fundamentals:</strong> No major changes in business</li>
                      <li>• <strong>Normal Volatility:</strong> Standard deviation patterns</li>
                      <li>• <strong>Gradual Progress:</strong> Steady but unremarkable growth</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Expected Outcomes:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Price Target:</strong> +3-8% following market</li>
                      <li>• <strong>Timeframe:</strong> Steady progression over 6-12 months</li>
                      <li>• <strong>Correlation:</strong> High correlation with sector/market</li>
                      <li>• <strong>Dividend Yield:</strong> Steady if dividend-paying stock</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-primary/10 rounded border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-primary">Real Example:</strong> MSFT 2023 - Base case scenario with steady +6% growth following market trends, supported by cloud growth but without major catalysts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bear Case */}
              <div className="border border-destructive/30 bg-destructive/5 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
                  📉 Bear Case Analysis
                  <Badge variant="outline" className="bg-destructive/20 text-destructive text-xs">20% typical</Badge>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Risk Factors:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Earnings Miss:</strong> Significant disappointment vs. estimates</li>
                      <li>• <strong>Sector Headwinds:</strong> Regulatory or competitive pressure</li>
                      <li>• <strong>Technical Breakdown:</strong> Key support levels lost</li>
                      <li>• <strong>Macro Pressure:</strong> Interest rates, recession fears</li>
                      <li>• <strong>Company-Specific:</strong> Management changes, legal issues</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Expected Outcomes:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>Price Target:</strong> -10-20% from current price</li>
                      <li>• <strong>Timeframe:</strong> Rapid decline over 2-8 weeks</li>
                      <li>• <strong>Volume Pattern:</strong> High volume selling pressure</li>
                      <li>• <strong>Recovery Time:</strong> 3-6 months to stabilize</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-destructive/10 rounded border-l-4 border-destructive">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-destructive">Real Example:</strong> META Q4 2021 - Bear case with -26% single-day drop following disappointing user growth and increased competition from TikTok.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Strategy Implementation */}
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">🎯 Professional Implementation Strategy</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-3">Probability-Weighted Position Sizing</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bull Case (35% × +20%)</span>
                      <span className="font-semibold text-success">+7.0% expected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Base Case (45% × +5%)</span>
                      <span className="font-semibold text-primary">+2.25% expected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bear Case (20% × -15%)</span>
                      <span className="font-semibold text-destructive">-3.0% expected</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-foreground">Expected Value:</span>
                        <span className="text-success">+6.25%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-lg border border-success/20">
                  <h4 className="font-semibold text-success mb-3">Dynamic Risk Management</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>• <strong>Entry Triggers:</strong> Wait for bull case catalysts to emerge</div>
                    <div>• <strong>Position Scaling:</strong> Start small, add on confirmation</div>
                    <div>• <strong>Stop Losses:</strong> Tight stops if bear case probabilities increase</div>
                    <div>• <strong>Profit Taking:</strong> Partial exits as price approaches bull targets</div>
                    <div>• <strong>Scenario Monitoring:</strong> Reassess probabilities weekly</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-accent/10 rounded-lg border border-accent/30">
                <h4 className="font-semibold mb-4 text-foreground">📋 Weekly Scenario Review Checklist</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Fundamental Analysis:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>□ Earnings estimates trends</li>
                      <li>□ Sector rotation patterns</li>
                      <li>□ Institutional ownership changes</li>
                      <li>□ News sentiment analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Technical Analysis:</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>□ Support/resistance levels</li>
                      <li>□ Volume confirmation patterns</li>
                      <li>□ Momentum indicator divergences</li>
                      <li>□ Market structure changes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Practice Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Apply Your Knowledge
            </h2>
            <p className="text-muted-foreground mb-4">
              Now that you understand AI predictions, practice with your own portfolio:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'predictions' } })} className="w-full">
                View Your AI Predictions
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Add More Holdings
              </Button>
            </div>
          </Card>

          {/* Warning */}
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-destructive">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  AI predictions are tools for analysis, not guarantees. Always combine with your own research, 
                  risk management, and never invest more than you can afford to lose. Past performance does not 
                  predict future results.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionsLearning;