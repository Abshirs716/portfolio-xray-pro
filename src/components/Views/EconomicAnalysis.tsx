import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { aiOrchestrator } from "@/services/ai/orchestrator";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RefreshCw, 
  BarChart3, 
  Globe,
  PieChart,
  Target
} from "lucide-react";

interface EconomicData {
  macroeconomic?: {
    fedRates: {
      currentRate: string;
      nextMeeting: string;
      cutProbability: number;
      implications: string;
    };
    gdp: {
      current: number;
      forecast: number;
      trend: string;
    };
    inflation: {
      cpi: number;
      core: number;
      target: number;
      trajectory: string;
    };
  };
  sectorRotation?: {
    currentCycle: string;
    favoredSectors: string[];
    avoidSectors: string[];
  };
  correlationAnalysis?: {
    spyCorrelation: number;
    bondCorrelation: number;
    commodityCorrelation: number;
    diversificationScore: number;
  };
  monteCarloResults?: {
    simulations: number;
    var95: number;
    expectedShortfall: number;
    probabilityOfLoss: number;
    expectedReturn: number;
  };
}

export default function EconomicAnalysis() {
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);
  const [loading, setLoading] = useState(false);
  const { portfolio } = usePortfolio();

  const loadEconomicAnalysis = async () => {
    if (!portfolio?.id) return;
    
    // Get holdings from transactions
    const portfolioService = await import('@/services/portfolioService');
    const transactions = await portfolioService.default.getPortfolioTransactions(portfolio.id);
    
    // Calculate holdings from transactions
    const holdingsMap = new Map();
    transactions?.forEach(transaction => {
      if (transaction.symbol) {
        const existing = holdingsMap.get(transaction.symbol) || { symbol: transaction.symbol, shares: 0 };
        if (transaction.type === 'buy') {
          existing.shares += transaction.quantity || 0;
        } else if (transaction.type === 'sell') {
          existing.shares -= transaction.quantity || 0;
        }
        holdingsMap.set(transaction.symbol, existing);
      }
    });
    
    const holdings = Array.from(holdingsMap.values()).filter(h => h.shares > 0);
    
    setLoading(true);
    try {
      const result = await aiOrchestrator.getEconomicForecast(holdings);
      setEconomicData(result as EconomicData);
    } catch (error) {
      console.error('Error loading economic analysis:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEconomicAnalysis();
  }, [portfolio]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-financial-gradient bg-clip-text text-transparent">
            Economic Analysis
          </h2>
          <p className="text-muted-foreground">
            Macroeconomic forecasting and portfolio optimization modeling
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Monte Carlo • VAR • GARCH
          </Badge>
          <Button 
            onClick={loadEconomicAnalysis} 
            disabled={loading}
            size="sm"
            className="space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Macroeconomic Overview */}
      {economicData?.macroeconomic && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card-gradient border-border">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Federal Rates</p>
                <p className="text-2xl font-bold text-primary">
                  {economicData.macroeconomic.fedRates.currentRate}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-success">
                    {economicData.macroeconomic.fedRates.cutProbability}% cut probability
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-gradient border-border">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">GDP Growth</p>
                <p className="text-2xl font-bold text-success">
                  {economicData.macroeconomic.gdp.current}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Forecast: {economicData.macroeconomic.gdp.forecast}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card-gradient border-border">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Inflation (CPI)</p>
                <p className="text-2xl font-bold text-warning">
                  {economicData.macroeconomic.inflation.cpi}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Target: {economicData.macroeconomic.inflation.target}%
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Sector Rotation Analysis */}
      {economicData?.sectorRotation && (
        <Card className="p-6 bg-card-gradient border-border">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Sector Rotation Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Current Cycle</p>
                <Badge variant="outline" className="text-sm">
                  {economicData.sectorRotation.currentCycle}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Favored Sectors</p>
                <div className="flex flex-wrap gap-1">
                  {economicData.sectorRotation.favoredSectors.map((sector, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Avoid Sectors</p>
                <div className="flex flex-wrap gap-1">
                  {economicData.sectorRotation.avoidSectors.map((sector, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Correlation Analysis */}
      {economicData?.correlationAnalysis && (
        <Card className="p-6 bg-card-gradient border-border">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Portfolio Correlation Analysis
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">S&P 500 Correlation</p>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.abs(economicData.correlationAnalysis.spyCorrelation) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {economicData.correlationAnalysis.spyCorrelation.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Bond Correlation</p>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.abs(economicData.correlationAnalysis.bondCorrelation) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {economicData.correlationAnalysis.bondCorrelation.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Commodity Correlation</p>
                <div className="flex items-center space-x-2">
                  <Progress value={Math.abs(economicData.correlationAnalysis.commodityCorrelation) * 100} className="flex-1" />
                  <span className="text-sm font-medium">
                    {economicData.correlationAnalysis.commodityCorrelation.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Diversification Score</p>
                <div className="flex items-center space-x-2">
                  <Progress value={economicData.correlationAnalysis.diversificationScore * 10} className="flex-1" />
                  <span className="text-sm font-medium">
                    {economicData.correlationAnalysis.diversificationScore.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Monte Carlo Results */}
      {economicData?.monteCarloResults && (
        <Card className="p-6 bg-card-gradient border-border">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Monte Carlo Simulation Results
            </h3>
            <p className="text-sm text-muted-foreground">
              Based on {economicData.monteCarloResults.simulations.toLocaleString()} simulations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Value at Risk (95%)</p>
                <p className="text-2xl font-bold text-destructive">
                  ${Math.abs(economicData.monteCarloResults.var95).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Maximum likely loss</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expected Shortfall</p>
                <p className="text-2xl font-bold text-destructive">
                  ${Math.abs(economicData.monteCarloResults.expectedShortfall).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Average loss beyond VaR</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Loss Probability</p>
                <p className="text-2xl font-bold text-warning">
                  {economicData.monteCarloResults.probabilityOfLoss.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Chance of any loss</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expected Return</p>
                <p className="text-2xl font-bold text-success">
                  ${economicData.monteCarloResults.expectedReturn.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">1-year projection</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {economicData === null && (
        <Card className="p-8 bg-card-gradient border-border text-center">
          <div className="space-y-4">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Economic Models Loading</h3>
              <p className="text-muted-foreground">
                {loading ? 'Running advanced economic analysis...' : 'Add holdings to see economic forecasts'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}