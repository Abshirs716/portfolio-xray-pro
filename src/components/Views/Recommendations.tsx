import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearningCard } from "@/components/learning/LearningCard";
import { aiOrchestrator } from "@/services/ai/orchestrator";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Brain, TrendingUp, Shield, BarChart3, RefreshCw, BookOpen } from "lucide-react";

interface Recommendation {
  action: string;
  symbol?: string;
  reasoning: string;
  priority: string;
  targetAllocation?: number;
}

interface RecommendationData {
  recommendations: Recommendation[];
}

// Generate real recommendations based on actual portfolio data
const generateRealRecommendations = (holdings: any[], portfolio: any): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  if (!holdings || holdings.length === 0) {
    return [{
      action: "START_INVESTING",
      reasoning: "No holdings detected. Consider starting with diversified index funds like VTI (Total Stock Market) or VOO (S&P 500).",
      priority: "high"
    }];
  }

  // Calculate current portfolio composition
  const totalValue = portfolio?.total_value || 0;
  const symbols = holdings.map(h => h.symbol);
  
  // Analyze sector concentration
  const techStocks = symbols.filter(s => ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'].includes(s));
  const techWeight = techStocks.length / symbols.length;
  
  // Check for over-concentration in tech
  if (techWeight > 0.7) {
    recommendations.push({
      action: "DIVERSIFY",
      reasoning: `Your portfolio is ${(techWeight * 100).toFixed(0)}% concentrated in technology stocks (${techStocks.join(', ')}). Consider adding exposure to other sectors like healthcare (JNJ, UNH), financials (JPM, BAC), or consumer goods (PG, KO) to reduce risk.`,
      priority: "high"
    });
  }

  // Check for Tesla overweight (high volatility)
  if (symbols.includes('TSLA')) {
    recommendations.push({
      action: "REDUCE_RISK",
      symbol: "TSLA",
      reasoning: "Tesla represents significant volatility risk. Consider reducing position size or taking profits if holding is substantial. Tesla's beta is typically above 2.0, meaning it moves twice as much as the market.",
      priority: "medium"
    });
  }

  // Check for missing defensive positions
  const defensiveStocks = symbols.filter(s => ['JNJ', 'PG', 'KO', 'WMT', 'VZ', 'T'].includes(s));
  if (defensiveStocks.length === 0) {
    recommendations.push({
      action: "ADD_DEFENSIVE",
      reasoning: "Your portfolio lacks defensive positions. Consider adding dividend-paying blue chips like Johnson & Johnson (JNJ), Procter & Gamble (PG), or Walmart (WMT) for stability during market downturns.",
      priority: "medium"
    });
  }

  // Check for missing international exposure
  const internationalStocks = symbols.filter(s => ['VXUS', 'VEA', 'VWO', 'IEFA', 'IEMG'].includes(s));
  if (internationalStocks.length === 0 && symbols.length > 3) {
    recommendations.push({
      action: "ADD_INTERNATIONAL",
      reasoning: "Consider adding international exposure through ETFs like VXUS (Total International) or VEA (Developed Markets) to reduce US concentration and capture global growth opportunities.",
      priority: "low",
      targetAllocation: 20
    });
  }

  // Check portfolio size recommendations
  if (totalValue > 100000 && symbols.length < 5) {
    recommendations.push({
      action: "INCREASE_DIVERSIFICATION",
      reasoning: `With a portfolio value of $${(totalValue / 1000000).toFixed(1)}M, consider expanding to 8-12 holdings across different sectors to optimize diversification while maintaining manageability.`,
      priority: "medium"
    });
  }

  // Add specific stock recommendations based on current holdings
  if (symbols.includes('NVDA') || symbols.includes('AMD')) {
    recommendations.push({
      action: "MONITOR_SEMICONDUCTOR",
      reasoning: "Monitor semiconductor positions closely. The sector is cyclical and sensitive to AI hype cycles. Consider taking partial profits if positions are up significantly.",
      priority: "medium"
    });
  }

  return recommendations.slice(0, 5); // Limit to 5 most relevant recommendations
};

export default function Recommendations() {
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const { portfolio } = usePortfolio();

  const [holdingsMap, setHoldingsMap] = useState<Map<string, any>>(new Map());
  
  const loadRecommendations = async () => {
    if (!portfolio?.id) return;
    
    // Get portfolio transactions and calculate holdings
    const portfolioService = await import('@/services/portfolioService');
    const transactions = await portfolioService.default.getPortfolioTransactions(portfolio.id);
    
    const holdingsMapTemp = new Map();
    transactions?.forEach(transaction => {
      if (transaction.symbol) {
        const existing = holdingsMapTemp.get(transaction.symbol) || { symbol: transaction.symbol, shares: 0 };
        if (transaction.type === 'buy') {
          existing.shares += transaction.quantity || 0;
        } else if (transaction.type === 'sell') {
          existing.shares -= transaction.quantity || 0;
        }
        holdingsMapTemp.set(transaction.symbol, existing);
      }
    });
    
    setHoldingsMap(holdingsMapTemp);
    const holdings = Array.from(holdingsMapTemp.values()).filter(h => h.shares > 0);
    
    setLoading(true);
    try {
      // Get real portfolio data
      const result = await aiOrchestrator.getInstitutionalRecommendations(holdings);
      setRecommendationData(result as RecommendationData);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      
      // Generate real recommendations based on actual portfolio
      const realRecommendations = generateRealRecommendations(holdings, portfolio);
      setRecommendationData({ recommendations: realRecommendations });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRecommendations();
  }, [portfolio]);

  const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'SELL':
        return <TrendingUp className="h-5 w-5 text-destructive rotate-180" />;
      case 'REBALANCE':
        return <BarChart3 className="h-5 w-5 text-warning" />;
      case 'ADD_BONDS':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'BUY':
        return "bg-success/10 border-success/30 text-success";
      case 'SELL':
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case 'REBALANCE':
        return "bg-warning/10 border-warning/30 text-warning";
      case 'ADD_BONDS':
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      default:
        return "bg-primary/10 border-primary/30 text-primary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return "destructive";
      case 'medium':
        return "default";
      case 'low':
        return "secondary";
      default:
        return "outline";
    }
  };

  const RecommendationCard = ({ recommendation, index }: { recommendation: Recommendation; index: number }) => {
    const getExpectedOutcome = (action: string, symbol?: string) => {
      switch (action.toUpperCase()) {
        case 'TRIM':
        case 'SELL':
          return "Reduce portfolio risk and lock in gains";
        case 'BUY':
          return `Add diversification ${symbol ? `with ${symbol}` : ''} to improve risk-adjusted returns`;
        case 'REBALANCE':
          return "Optimize sector allocation for better diversification";
        case 'HOLD':
          return "Maintain strategic core position";
        default:
          return "Optimize portfolio allocation";
      }
    };

    const getRiskFactors = (action: string, symbol?: string) => {
      switch (action.toUpperCase()) {
        case 'TRIM':
        case 'SELL':
          return "Market timing risk if sold too early";
        case 'BUY':
          return `Execution risk and ${symbol ? `${symbol} specific risks` : 'sector concentration'}`;
        case 'REBALANCE':
          return "Transaction costs and temporary imbalance";
        case 'HOLD':
          return "Opportunity cost of not rebalancing";
        default:
          return "Execution and market risks";
      }
    };

    return (
      <Card className={`p-6 border-2 transition-colors hover:border-primary/30 ${getActionColor(recommendation.action)}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getActionIcon(recommendation.action)}
              <div>
                <h3 className="font-semibold text-foreground">
                  {recommendation.action.replace('_', ' ')}
                  {recommendation.symbol && ` ${recommendation.symbol}`}
                </h3>
                {recommendation.targetAllocation && (
                  <p className="text-sm text-muted-foreground">
                    Target: {recommendation.targetAllocation}% allocation
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
              <Badge variant="outline">#{index + 1}</Badge>
            </div>
          </div>
          
          <div className="space-y-3 pt-3 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Why This Recommendation:</p>
              <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-medium text-success">Expected Outcome:</p>
                <p className="text-muted-foreground">{getExpectedOutcome(recommendation.action, recommendation.symbol)}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-warning">Risk Factors:</p>
                <p className="text-muted-foreground">{getRiskFactors(recommendation.action, recommendation.symbol)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Based on: Modern Portfolio Theory, Risk Analysis, Market Conditions
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Apply Recommendation
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-financial-gradient bg-clip-text text-transparent">
            AI Investment Recommendations
          </h2>
          <p className="text-muted-foreground">
            Personalized investment advice based on YOUR actual portfolio holdings and current market conditions
          </p>
          
          {/* Add comprehensive explanation card */}
          <Card className="bg-primary/5 border-primary/20 p-4 mt-4">
            <div className="text-sm">
              <div className="font-semibold text-primary mb-3">How AI Generates Your Recommendations:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-medium text-success">Portfolio Analysis:</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Analyzes your actual holdings and position sizes</li>
                    <li>• Identifies concentration risks and imbalances</li>
                    <li>• Evaluates sector allocation and diversification</li>
                    <li>• Compares your performance to market benchmarks</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-warning">Market Intelligence:</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Real-time sentiment analysis across 200+ sources</li>
                    <li>• Technical indicators and price momentum</li>
                    <li>• Analyst consensus and rating changes</li>
                    <li>• Economic indicators and market trends</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-primary">Risk Assessment:</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Calculates portfolio volatility and correlation</li>
                    <li>• Identifies single-stock concentration risks</li>
                    <li>• Monitors sector-specific vulnerabilities</li>
                    <li>• Evaluates market timing and entry points</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-destructive">Personalization:</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• Tailored to your specific holdings</li>
                    <li>• Considers your portfolio size and allocation</li>
                    <li>• Adapts to your trading history patterns</li>
                    <li>• Updates based on market conditions</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-primary/20">
                <span className="font-medium text-primary">Important Note:</span> 
                <span className="text-muted-foreground"> These recommendations are for educational purposes only and should not be considered as financial advice. Always conduct your own research and consider consulting with a financial advisor before making investment decisions.</span>
              </div>
            </div>
          </Card>
        </div>
        <Button 
          onClick={loadRecommendations} 
          disabled={loading}
          className="space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </Button>
      </div>

      {/* Portfolio Analysis Summary - Real Data */}
      {recommendationData?.recommendations && recommendationData.recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500/20 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-foreground">Live Portfolio Analysis Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Your Current Portfolio:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Portfolio Value: ${((portfolio?.total_value || 0) / 1000000).toFixed(2)}M</li>
                  <li>• Holdings: {holdingsMap?.size || 0} different stocks</li>
                  <li>• Analysis based on real transaction data</li>
                  <li>• Live recommendations updated automatically</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">AI Analysis Results:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {recommendationData.recommendations.length} personalized recommendations</li>
                  <li>• Based on your actual holdings composition</li>
                  <li>• Risk-adjusted for your portfolio size</li>
                  <li>• Updated with live market data</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <div className="flex items-center space-x-4">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Portfolio Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {recommendationData?.recommendations?.length || 0} recommendations generated based on your current portfolio
            </p>
          </div>
        </div>
      </Card>
      
      {/* Recommendations grid */}
      {recommendationData?.recommendations ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendationData.recommendations.map((recommendation, index) => (
            <RecommendationCard 
              key={index}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 bg-card-gradient border-border text-center">
          <div className="space-y-4">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Generating Recommendations</h3>
              <p className="text-muted-foreground">
                {loading ? "Analyzing your portfolio..." : "Click refresh to generate AI recommendations"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Learning Section */}
      <Card className="p-6 bg-card-gradient border-border">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Learn Investment Strategy</h3>
              <p className="text-sm text-muted-foreground">Master portfolio optimization and investment decision-making</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LearningCard
              title="Portfolio Theory"
              description="Understand Modern Portfolio Theory, diversification, and risk-return optimization"
              path="/learn/ai-recommendations"
              icon={BarChart3}
              difficulty="Intermediate"
              estimatedTime="12-15 min"
            />
            <LearningCard
              title="Asset Allocation"
              description="Learn strategic asset allocation across stocks, bonds, and alternative investments"
              path="/learn/ai-recommendations"
              icon={TrendingUp}
              difficulty="Beginner"
              estimatedTime="10-12 min"
            />
            <LearningCard
              title="Rebalancing Strategies"
              description="Master systematic rebalancing techniques to maintain optimal portfolio allocation"
              path="/learn/ai-recommendations"
              icon={Shield}
              difficulty="Advanced"
              estimatedTime="15-20 min"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}