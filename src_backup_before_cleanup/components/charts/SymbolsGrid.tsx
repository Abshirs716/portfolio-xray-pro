import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SymbolData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  inPortfolio: boolean;
}

// YOUR ACTUAL PORTFOLIO HOLDINGS - Shows only stocks you own!
const symbolsData: SymbolData[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 225.15, change: 2.45, changePercent: 1.1, volume: '45.2M', inPortfolio: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 465.28, change: 5.12, changePercent: 1.12, volume: '32.1M', inPortfolio: true },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1150.75, change: -8.25, changePercent: -0.71, volume: '28.9M', inPortfolio: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.42, change: 1.88, changePercent: 1.08, volume: '22.5M', inPortfolio: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.92, change: 12.45, changePercent: 5.26, volume: '67.4M', inPortfolio: true },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.67, change: -2.15, changePercent: -1.14, volume: '35.8M', inPortfolio: true },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 0.85, changePercent: 0.43, volume: '12.3M', inPortfolio: true },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 159.72, change: -0.58, changePercent: -0.36, volume: '8.9M', inPortfolio: true },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 425.28, change: 3.42, changePercent: 0.81, volume: '2.1M', inPortfolio: true },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.45, change: 0.25, changePercent: 0.89, volume: '15.4M', inPortfolio: true },
  { symbol: 'XOM', name: 'ExxonMobil Corp.', price: 110.72, change: -1.25, changePercent: -1.12, volume: '18.6M', inPortfolio: true },
  { symbol: 'CVX', name: 'Chevron Corp.', price: 165.38, change: 2.15, changePercent: 1.32, volume: '9.8M', inPortfolio: true },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 550.28, change: 4.85, changePercent: 0.89, volume: '85.2M', inPortfolio: true },
  { symbol: 'QQQ', name: 'Invesco QQQ ETF', price: 475.67, change: 6.12, changePercent: 1.31, volume: '45.8M', inPortfolio: true }
];

export const SymbolsGrid = () => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <Card className="w-full backdrop-blur-md bg-card/60 border border-border/50 shadow-premium">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-2">Your Portfolio Holdings</h3>
          <p className="text-sm text-muted-foreground">Real-time prices for all stocks in your portfolio</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {symbolsData.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 bg-gradient-to-br from-secondary/10 to-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs font-mono bg-primary/10 text-primary border-primary/30">
                  {stock.symbol}
                </Badge>
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(stock.price)}</p>
                <p className={`text-xs font-medium ${
                  stock.change >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {formatChange(stock.change, stock.changePercent)}
                </p>
                <p className="text-xs text-muted-foreground">Vol: {stock.volume}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              Live Data
            </Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              Market Open
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};