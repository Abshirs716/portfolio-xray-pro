import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity,
  Target
} from "lucide-react";

interface RiskMetricsProps {
  className?: string;
}

interface RiskData {
  sharpeRatio: number;
  portfolioBeta: number;
  volatility30Day: number;
  volatility90Day: number;
  maxDrawdown: number;
  valueAtRisk: number;
  riskScore: number;
  confidenceLevel: number;
}

export const RiskMetrics = ({ className = "" }: RiskMetricsProps) => {
  const [riskData, setRiskData] = useState<RiskData>({
    sharpeRatio: 1.24,
    portfolioBeta: 0.87,
    volatility30Day: 12.4,
    volatility90Day: 15.8,
    maxDrawdown: -8.3,
    valueAtRisk: -2.4,
    riskScore: 7.2,
    confidenceLevel: 95
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and calculation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [riskData]);

  const getRiskColor = (value: number, type: 'sharpe' | 'beta' | 'volatility' | 'drawdown' | 'var' | 'score'): string => {
    switch (type) {
      case 'sharpe':
        if (value >= 1.5) return 'text-success';
        if (value >= 1.0) return 'text-warning';
        return 'text-destructive';
      case 'beta':
        if (value >= 0.8 && value <= 1.2) return 'text-success';
        if (value >= 0.6 && value <= 1.5) return 'text-warning';
        return 'text-destructive';
      case 'volatility':
        if (value <= 10) return 'text-success';
        if (value <= 20) return 'text-warning';
        return 'text-destructive';
      case 'drawdown':
      case 'var':
        if (Math.abs(value) <= 5) return 'text-success';
        if (Math.abs(value) <= 15) return 'text-warning';
        return 'text-destructive';
      case 'score':
        if (value >= 8) return 'text-success';
        if (value >= 6) return 'text-warning';
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBadge = (value: number, type: 'sharpe' | 'beta' | 'volatility' | 'drawdown' | 'var' | 'score'): { label: string; variant: string } => {
    
    switch (type) {
      case 'sharpe':
        if (value >= 1.5) return { label: 'Excellent', variant: 'success' };
        if (value >= 1.0) return { label: 'Good', variant: 'warning' };
        return { label: 'Poor', variant: 'destructive' };
      case 'beta':
        if (value >= 0.8 && value <= 1.2) return { label: 'Market Aligned', variant: 'success' };
        if (value < 0.8) return { label: 'Defensive', variant: 'warning' };
        return { label: 'Aggressive', variant: 'destructive' };
      case 'volatility':
        if (value <= 10) return { label: 'Low Risk', variant: 'success' };
        if (value <= 20) return { label: 'Moderate Risk', variant: 'warning' };
        return { label: 'High Risk', variant: 'destructive' };
      default:
        return { label: 'Normal', variant: 'outline' };
    }
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card className={`backdrop-blur-md bg-card/60 border border-border/50 shadow-premium ${className}`}>
        <CardHeader>
          <CardTitle className="text-xl font-institutional text-foreground flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            Risk Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg"></div>
              ))}
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
          <CardTitle className="text-xl font-institutional text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            Risk Analytics
          </CardTitle>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            Live Analysis
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Score Overview */}
        <div className="p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Overall Risk Score
            </span>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${getRiskColor(riskData.riskScore, 'score')}`}>
              {riskData.riskScore}/10
            </span>
            <Badge 
              variant={getRiskBadge(riskData.riskScore, 'score').variant as any}
              className="ml-2"
            >
              {getRiskBadge(riskData.riskScore, 'score').label}
            </Badge>
          </div>
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sharpe Ratio */}
          <div className="p-4 bg-success/10 rounded-lg border border-success/20 hover:bg-success/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground font-medium">Sharpe Ratio</span>
              </div>
              <Badge variant={getRiskBadge(riskData.sharpeRatio, 'sharpe').variant as any} className="text-xs">
                {getRiskBadge(riskData.sharpeRatio, 'sharpe').label}
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.sharpeRatio, 'sharpe')}`}>
              {riskData.sharpeRatio.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Risk-adjusted return measure
            </p>
          </div>

          {/* Portfolio Beta */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20 hover:bg-accent/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground font-medium">Portfolio Beta</span>
              </div>
              <Badge variant={getRiskBadge(riskData.portfolioBeta, 'beta').variant as any} className="text-xs">
                {getRiskBadge(riskData.portfolioBeta, 'beta').label}
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.portfolioBeta, 'beta')}`}>
              {riskData.portfolioBeta.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Market correlation coefficient
            </p>
          </div>

          {/* 30-Day Volatility */}
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 hover:bg-warning/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground font-medium">30-Day Volatility</span>
              </div>
              <Badge variant={getRiskBadge(riskData.volatility30Day, 'volatility').variant as any} className="text-xs">
                {getRiskBadge(riskData.volatility30Day, 'volatility').label}
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.volatility30Day, 'volatility')}`}>
              {formatPercentage(riskData.volatility30Day)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Short-term price volatility
            </p>
          </div>

          {/* 90-Day Volatility */}
          <div className="p-4 bg-institutional/10 rounded-lg border border-institutional/20 hover:bg-institutional/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-institutional" />
                <span className="text-sm text-muted-foreground font-medium">90-Day Volatility</span>
              </div>
              <Badge variant={getRiskBadge(riskData.volatility90Day, 'volatility').variant as any} className="text-xs">
                {getRiskBadge(riskData.volatility90Day, 'volatility').label}
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.volatility90Day, 'volatility')}`}>
              {formatPercentage(riskData.volatility90Day)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Medium-term price volatility
            </p>
          </div>

          {/* Maximum Drawdown */}
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 hover:bg-destructive/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-muted-foreground font-medium">Max Drawdown</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                Peak Decline
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.maxDrawdown, 'drawdown')}`}>
              {formatPercentage(riskData.maxDrawdown)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Largest peak-to-trough decline
            </p>
          </div>

          {/* Value at Risk */}
          <div className="p-4 bg-forest/10 rounded-lg border border-forest/20 hover:bg-forest/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-forest" />
                <span className="text-sm text-muted-foreground font-medium">Value at Risk</span>
              </div>
              <Badge variant="outline" className="text-xs bg-forest/10 text-forest border-forest/30">
                {riskData.confidenceLevel}% Confidence
              </Badge>
            </div>
            <p className={`text-2xl font-bold ${getRiskColor(riskData.valueAtRisk, 'var')}`}>
              {formatPercentage(riskData.valueAtRisk)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Potential 1-day loss (95% confidence)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};