import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, MessageSquare, Twitter, BarChart3, Target, CheckCircle, Users, TrendingUp } from "lucide-react";

const MarketSentimentLearning = () => {
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Market Sentiment Mastery
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master the psychology of markets through sentiment analysis, social media monitoring, and behavioral finance principles
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
                <span className="text-sm">Learn to read news, social media, and analyst sentiment</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Understand put/call ratios and options flow analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Master Fear & Greed Index components</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <span className="text-sm">Apply contrarian and momentum sentiment strategies</span>
              </div>
            </div>
          </Card>

          {/* Section 1: Sentiment Indicators */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Sentiment Indicators & Data Sources
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-400 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    News Sentiment
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Sources:</strong> Financial news, earnings calls, analyst reports</div>
                    <div><strong>Analysis:</strong> Natural language processing of headlines and articles</div>
                    <div><strong>Signal:</strong> Volume and tone of coverage</div>
                  </div>
                  <div className="mt-3 p-2 bg-blue-500/5 rounded text-xs">
                    <strong>Example:</strong> 20+ positive NVDA articles = Bullish sentiment
                  </div>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-purple-400 flex items-center gap-2">
                    <Twitter className="h-5 w-5" />
                    Social Media
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Twitter/X:</strong> Real-time market chatter, influencer opinions</div>
                    <div><strong>Reddit:</strong> WallStreetBets momentum, retail sentiment</div>
                    <div><strong>Discord/Telegram:</strong> Trading communities, alerts</div>
                  </div>
                  <div className="mt-3 p-2 bg-purple-500/5 rounded text-xs">
                    <strong>Example:</strong> 🚀 emojis trending with TSLA = Retail bullishness
                  </div>
                </div>

                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Analyst Consensus
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Ratings:</strong> Buy/Hold/Sell recommendations</div>
                    <div><strong>Price Targets:</strong> 12-month fair value estimates</div>
                    <div><strong>Revisions:</strong> Recent upgrades/downgrades</div>
                  </div>
                  <div className="mt-3 p-2 bg-green-500/5 rounded text-xs">
                    <strong>Example:</strong> 15 analysts raise AAPL targets = Strong consensus
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Sentiment Scoring System (0-100)</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extremely Bearish (0-20)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-20 h-2" />
                      <Badge variant="destructive">Panic Selling</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bearish (21-40)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <Badge variant="outline" className="bg-orange-500/20">Pessimistic</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral (41-60)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={50} className="w-20 h-2" />
                      <Badge variant="secondary">Balanced</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bullish (61-80)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={70} className="w-20 h-2" />
                      <Badge variant="outline" className="bg-green-500/20">Optimistic</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extremely Bullish (81-100)</span>
                    <div className="flex items-center gap-2">
                      <Progress value={90} className="w-20 h-2" />
                      <Badge variant="default" className="bg-success">Euphoric</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Options Flow Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Options Flow & Smart Money Analysis
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Put/Call Ratio Signals</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-success/5 border-l-4 border-success">
                      <div className="font-semibold text-sm">Low Ratio (0.3-0.6)</div>
                      <div className="text-xs text-muted-foreground">
                        More calls than puts = Bullish sentiment<br/>
                        Often seen during market rallies
                      </div>
                    </div>
                    <div className="p-3 bg-warning/5 border-l-4 border-warning">
                      <div className="font-semibold text-sm">Normal Ratio (0.6-1.0)</div>
                      <div className="text-xs text-muted-foreground">
                        Balanced options activity<br/>
                        No strong directional bias
                      </div>
                    </div>
                    <div className="p-3 bg-destructive/5 border-l-4 border-destructive">
                      <div className="font-semibold text-sm">High Ratio (1.0+)</div>
                      <div className="text-xs text-muted-foreground">
                        More puts than calls = Bearish/Hedging<br/>
                        Fear or protection buying
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Unusual Options Activity</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Large Block Trades</div>
                      <div className="text-xs text-muted-foreground">
                        Institutional or informed money moving
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">High Premium Paid</div>
                      <div className="text-xs text-muted-foreground">
                        Buyer expects significant price movement
                      </div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded">
                      <div className="font-semibold text-sm">Open Interest Spikes</div>
                      <div className="text-xs text-muted-foreground">
                        New positions, not closing existing ones
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold text-primary mb-3">Smart Money Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-success">Bullish Smart Money:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Large call sweeps above ask</li>
                      <li>• Institutional accumulation</li>
                      <li>• Dark pool buying activity</li>
                      <li>• Insider buying clusters</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-destructive">Bearish Smart Money:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Protective put buying</li>
                      <li>• Institutional distribution</li>
                      <li>• Insider selling activity</li>
                      <li>• Hedge fund short interest</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Fear & Greed Psychology */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Fear & Greed Index Psychology
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-destructive">Fear Indicators (0-25)</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Market Volatility:</strong> VIX above 30</div>
                    <div><strong>Safe Haven Demand:</strong> Gold, bonds rallying</div>
                    <div><strong>Put/Call Ratio:</strong> Above 1.2</div>
                    <div><strong>Breadth:</strong> More stocks declining than advancing</div>
                    <div><strong>Junk Bond Demand:</strong> High-yield spreads widening</div>
                  </div>
                  <div className="mt-3 p-2 bg-destructive/10 rounded text-xs">
                    <strong>Trading Strategy:</strong> Contrarian buying opportunity - "Be greedy when others are fearful"
                  </div>
                </div>

                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <h3 className="font-semibold mb-3 text-success">Greed Indicators (75-100)</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Market Momentum:</strong> Strong price advances</div>
                    <div><strong>Risk-On Assets:</strong> Growth stocks, crypto rallying</div>
                    <div><strong>Put/Call Ratio:</strong> Below 0.5</div>
                    <div><strong>Breadth:</strong> 90%+ stocks advancing</div>
                    <div><strong>Junk Bond Demand:</strong> High-yield spreads tightening</div>
                  </div>
                  <div className="mt-3 p-2 bg-success/10 rounded text-xs">
                    <strong>Trading Strategy:</strong> Take profits, reduce risk - "Be fearful when others are greedy"
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-primary/20 rounded-lg">
                <h3 className="font-semibold text-primary mb-3">Behavioral Finance Principles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-warning">Common Emotional Biases:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• <strong>FOMO:</strong> Buying at peaks due to fear of missing out</li>
                      <li>• <strong>Loss Aversion:</strong> Holding losers too long</li>
                      <li>• <strong>Confirmation Bias:</strong> Only seeking agreeable information</li>
                      <li>• <strong>Herd Mentality:</strong> Following the crowd without analysis</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-primary">Contrarian Strategies:</strong>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Buy when sentiment is extremely negative</li>
                      <li>• Sell when euphoria reaches dangerous levels</li>
                      <li>• Look for oversold technical conditions</li>
                      <li>• Focus on fundamentals during emotion extremes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Real-World Sentiment Examples</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-2 bg-background/50 rounded">
                    <div className="font-semibold text-destructive">March 2020</div>
                    <div className="text-xs text-muted-foreground">
                      Extreme fear (VIX: 80+)<br/>
                      Perfect contrarian buy signal
                    </div>
                  </div>
                  <div className="p-2 bg-background/50 rounded">
                    <div className="font-semibold text-warning">January 2021</div>
                    <div className="text-xs text-muted-foreground">
                      Meme stock euphoria<br/>
                      Retail FOMO at peaks
                    </div>
                  </div>
                  <div className="p-2 bg-background/50 rounded">
                    <div className="font-semibold text-success">October 2022</div>
                    <div className="text-xs text-muted-foreground">
                      Peak pessimism<br/>
                      Market bottomed shortly after
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
              Apply Sentiment Analysis
            </h2>
            <p className="text-muted-foreground mb-4">
              Now practice reading market sentiment with your actual portfolio holdings:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => navigate('/', { state: { view: 'sentiment' } })} className="w-full">
                View Your Sentiment Analysis
              </Button>
              <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
                Track More Symbols
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentLearning;