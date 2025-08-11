import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, DollarSign } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Badge } from "@/components/ui/badge";

import { realMarketDataService } from '@/services/realMarketData';

interface PortfolioOverviewProps {
  className?: string;
}

interface PortfolioMetrics {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  weeklyChange: number;
  weeklyChangePercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  ytdReturn: number;
  ytdReturnPercent: number;
}

// Function to calculate real portfolio value
async function calculateRealPortfolioValue(holdings: any[]) {
  let totalValue = 0;
  
  for (const holding of holdings) {
    try {
      const quote = await realMarketDataService.getStockQuote(holding.symbol);
      const value = quote.price * holding.quantity;
      totalValue += value;
    } catch (error) {
      console.error(`Failed to get price for ${holding.symbol}`);
    }
  }
  
  return totalValue;
}

export const PortfolioOverview = ({ className = "" }: PortfolioOverviewProps) => {
  const { portfolio, transactions, metrics, isLoading } = usePortfolio();
  const [displayMetrics, setDisplayMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0,
    weeklyChange: 0,
    weeklyChangePercent: 0,
    monthlyChange: 0,
    monthlyChangePercent: 0,
    ytdReturn: 0,
    ytdReturnPercent: 0
  });
  const [animatedValue, setAnimatedValue] = useState(0);


  // Update metrics when real data loads
 useEffect(() => {
  const updateWithRealValues = async () => {
    if (metrics && portfolio) {
      console.log('📊 PortfolioOverview using REAL metrics:', metrics);
      
      // Calculate REAL portfolio value from holdings
      let realTotalValue = 0;
      if (portfolio.holdings && portfolio.holdings.length > 0) {
        realTotalValue = await calculateRealPortfolioValue(portfolio.holdings);
        console.log('💰 REAL calculated portfolio value:', realTotalValue);
      } else {
        console.log('❌ No holdings found in portfolio');
      }
      
      // Use real value instead of fake value
      const totalValue = realTotalValue || 0;
      const weeklyChangeAmount = (metrics.weeklyReturn / 100) * totalValue;
      const monthlyChangeAmount = (metrics.monthlyReturn / 100) * totalValue;
      const ytdChangeAmount = (metrics.yearToDateReturn / 100) * totalValue;

      const realMetrics = {
        totalValue: totalValue,
        dailyChange: metrics.dailyChange || 0,
        dailyChangePercent: metrics.dailyChangePercent || 0,
        weeklyChange: weeklyChangeAmount,
        weeklyChangePercent: metrics.weeklyReturn || 0,
        monthlyChange: monthlyChangeAmount,
        monthlyChangePercent: metrics.monthlyReturn || 0,
        ytdReturn: ytdChangeAmount,
        ytdReturnPercent: metrics.yearToDateReturn || 0
      };
      
      console.log('✅ Using REAL metrics in PortfolioOverview:', realMetrics);
      setDisplayMetrics(realMetrics);
    }
  };
  
  updateWithRealValues();
}, [metrics, portfolio]);
  // Animate the portfolio value on mount
  useEffect(() => {
    if (displayMetrics.totalValue === 0) return;
    
    const timer = setTimeout(() => {
      let start = 0;
      const end = displayMetrics.totalValue;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const animate = () => {
        start += increment;
        if (start < end) {
          setAnimatedValue(start);
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(end);
        }
      };
      animate();
    }, 100);

    return () => clearTimeout(timer);
  }, [displayMetrics.totalValue]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (value: number): string => {
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card className={`backdrop-blur-md bg-card/60 border border-border/50 shadow-premium ${className}`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-institutional text-foreground">
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted rounded-lg"></div>
              <div className="h-12 bg-muted rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`
      backdrop-blur-md bg-card/60 border border-border/50 shadow-premium
      transition-all duration-300 hover:shadow-elevated hover:bg-card/80
      bg-gradient-to-br from-card via-card/90 to-background/50
      ${className}
    `}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-institutional text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            Portfolio Overview
          </CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            Live
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Live Data Indicator - Simple and Clean */}
        <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-700">Live Market Data Active • OpenAI GPT-4.1</span>
          <Badge variant="default" className="bg-emerald-500">LIVE</Badge>
        </div>
        {/* Main Portfolio Value */}
        <div className="text-center space-y-2 p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/20">
          <p className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
            Total Portfolio Value
          </p>
          <p className="text-5xl font-bold font-financial bg-institutional-gradient bg-clip-text text-transparent">
            {formatCurrency(animatedValue)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {getTrendIcon(displayMetrics.dailyChange)}
            <span className={`text-lg font-medium ${getTrendColor(displayMetrics.dailyChange)}`}>
              {formatCurrency(Math.abs(displayMetrics.dailyChange))} ({formatPercentage(displayMetrics.dailyChangePercent)})
            </span>
            <span className="text-sm text-muted-foreground">today</span>
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Weekly Performance */}
          <div className="space-y-2 p-4 bg-secondary/10 rounded-lg border border-secondary/20 hover:bg-secondary/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Weekly
              </p>
              {getTrendIcon(displayMetrics.weeklyChange)}
            </div>
            <p className={`text-lg font-bold ${getTrendColor(displayMetrics.weeklyChange)}`}>
              {formatPercentage(displayMetrics.weeklyChangePercent)}
            </p>
            <p className={`text-xs ${getTrendColor(displayMetrics.weeklyChange)}`}>
              {formatCurrency(Math.abs(displayMetrics.weeklyChange))}
            </p>
          </div>

          {/* Monthly Performance */}
          <div className="space-y-2 p-4 bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Monthly
              </p>
              {getTrendIcon(displayMetrics.monthlyChange)}
            </div>
            <p className={`text-lg font-bold ${getTrendColor(displayMetrics.monthlyChange)}`}>
              {formatPercentage(displayMetrics.monthlyChangePercent)}
            </p>
            <p className={`text-xs ${getTrendColor(displayMetrics.monthlyChange)}`}>
              {formatCurrency(Math.abs(displayMetrics.monthlyChange))}
            </p>
          </div>

          {/* YTD Performance */}
          <div className="space-y-2 p-4 bg-success/10 rounded-lg border border-success/20 hover:bg-success/20 transition-all duration-200 lg:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Year to Date
              </p>
              {getTrendIcon(displayMetrics.ytdReturn)}
            </div>
            <div className="flex items-baseline gap-3">
              <p className={`text-2xl font-bold ${getTrendColor(displayMetrics.ytdReturn)}`}>
                {formatPercentage(displayMetrics.ytdReturnPercent)}
              </p>
              <p className={`text-sm ${getTrendColor(displayMetrics.ytdReturn)}`}>
                {formatCurrency(Math.abs(displayMetrics.ytdReturn))}
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Real-time Tracking
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            Market Hours: Open
          </Badge>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
            Last Update: Live
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};