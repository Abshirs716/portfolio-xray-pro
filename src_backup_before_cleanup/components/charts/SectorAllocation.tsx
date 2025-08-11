import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, PieChart, Zap, Building2, Shield, Car, Activity, Fuel, ShoppingBag } from 'lucide-react';

interface SectorData {
  sector: string;
  value: number;
  percentage: number;
  stocks: string[];
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

// Your portfolio's sector breakdown with clear colors
const sectorData: SectorData[] = [
  {
    sector: 'Technology',
    value: 9500000,
    percentage: 35.8,
    stocks: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
    count: 4,
    icon: <Zap className="w-4 h-4" />,
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    trend: 'up',
    trendValue: 2.8
  },
  {
    sector: 'ETFs',
    value: 4500000,
    percentage: 17.0,
    stocks: ['SPY', 'QQQ'],
    count: 2,
    icon: <Activity className="w-4 h-4" />,
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    trend: 'up',
    trendValue: 1.2
  },
  {
    sector: 'Energy',
    value: 3200000,
    percentage: 12.1,
    stocks: ['XOM', 'CVX'],
    count: 2,
    icon: <Fuel className="w-4 h-4" />,
    color: '#F59E0B',
    bgColor: 'bg-amber-500',
    trend: 'up',
    trendValue: 3.4
  },
  {
    sector: 'Financials',
    value: 2800000,
    percentage: 10.6,
    stocks: ['JPM', 'BRK.B'],
    count: 2,
    icon: <Building2 className="w-4 h-4" />,
    color: '#8B5CF6',
    bgColor: 'bg-violet-500',
    trend: 'stable',
    trendValue: 0.8
  },
  {
    sector: 'Healthcare',
    value: 2000000,
    percentage: 7.5,
    stocks: ['JNJ', 'PFE'],
    count: 2,
    icon: <Shield className="w-4 h-4" />,
    color: '#EF4444',
    bgColor: 'bg-red-500',
    trend: 'stable',
    trendValue: 0.3
  },
  {
    sector: 'Automotive',
    value: 1500000,
    percentage: 5.7,
    stocks: ['TSLA'],
    count: 1,
    icon: <Car className="w-4 h-4" />,
    color: '#06B6D4',
    bgColor: 'bg-cyan-500',
    trend: 'down',
    trendValue: -1.5
  },
  {
    sector: 'Consumer',
    value: 3000000,
    percentage: 11.3,
    stocks: ['AMZN'],
    count: 1,
    icon: <ShoppingBag className="w-4 h-4" />,
    color: '#F97316',
    bgColor: 'bg-orange-500',
    trend: 'up',
    trendValue: 1.8
  }
];

export const SectorAllocation = () => {
  const totalValue = sectorData.reduce((sum, sector) => sum + sector.value, 0);

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full bg-slate-400" />;
  };

  return (
    <Card className="w-full backdrop-blur-md bg-card/60 border border-border/50 shadow-premium">
      <CardContent className="p-6">
        {/* Compact Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <PieChart className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Portfolio by Sector
            </h3>
          </div>
          <p className="text-xs text-muted-foreground ml-7">
            ${(totalValue / 1000000).toFixed(1)}M across {sectorData.length} sectors
          </p>
        </div>

        {/* Compact Visual Bars */}
        <div className="space-y-3 mb-5">
          {sectorData.map((sector, index) => (
            <div key={sector.sector} className="group">
              {/* Compact Sector Row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-md text-white"
                    style={{ backgroundColor: sector.color }}
                  >
                    {sector.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {sector.sector}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {sector.stocks.join(' • ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Trend */}
                  <div className="flex items-center gap-1">
                    {getTrendIcon(sector.trend, sector.trendValue)}
                    <span className={`text-xs font-medium ${
                      sector.trend === 'up' ? 'text-emerald-500' : 
                      sector.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {sector.trendValue > 0 ? '+' : ''}{sector.trendValue}%
                    </span>
                  </div>
                  
                  {/* Values */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {sector.percentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(sector.value)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sleek Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000 ease-out rounded-full"
                  style={{ 
                    backgroundColor: sector.color,
                    width: `${sector.percentage}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Compact Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-secondary/10 rounded-lg">
          <div className="text-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <p className="text-lg font-bold text-blue-600">36%</p>
            <p className="text-xs text-muted-foreground">Technology</p>
          </div>
          
          <div className="text-center">
            <div className="w-6 h-6 bg-emerald-500 rounded-full mx-auto mb-1"></div>
            <p className="text-lg font-bold text-emerald-600">7</p>
            <p className="text-xs text-muted-foreground">Sectors</p>
          </div>
          
          <div className="text-center">
            <div className="w-6 h-6 bg-amber-500 rounded-full mx-auto mb-1"></div>
            <p className="text-lg font-bold text-amber-600">A+</p>
            <p className="text-xs text-muted-foreground">Diversity</p>
          </div>
          
          <div className="text-center">
            <div className="w-6 h-6 bg-violet-500 rounded-full mx-auto mb-1"></div>
            <p className="text-lg font-bold text-violet-600">Low</p>
            <p className="text-xs text-muted-foreground">Risk</p>
          </div>
        </div>

        {/* Compact Insights */}
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-medium text-foreground mb-2 text-sm">Portfolio Insights</h4>
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Tech at 36%, Amazon in Consumer sector</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-muted-foreground">Well diversified across 7 sectors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-muted-foreground">Energy trending up +3.4%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <span className="text-muted-foreground">Tesla now in Automotive sector</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};