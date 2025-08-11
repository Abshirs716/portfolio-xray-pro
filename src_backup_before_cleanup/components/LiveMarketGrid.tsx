import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface LiveMarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  marketCap: number;
  source: string;
  timestamp: string;
  previousClose: number;
}

const portfolioSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway' },
  { symbol: 'PFE', name: 'Pfizer Inc.' },
  { symbol: 'XOM', name: 'ExxonMobil Corp.' },
  { symbol: 'CVX', name: 'Chevron Corp.' }
];

export const LiveMarketGrid = () => {
  const [marketData, setMarketData] = useState<LiveMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLive, setIsLive] = useState(false);

  const fetchLiveData = async () => {
    setIsLoading(true);
    const newData: LiveMarketData[] = [];
    
    try {
      // Fetch data for a smaller subset to reduce flickering
      const prioritySymbols = portfolioSymbols.slice(0, 8); // First 8 symbols only
      
      for (const stock of prioritySymbols) {
        try {
          const { data, error } = await supabase.functions.invoke('real-market-data', {
            body: { symbol: stock.symbol, type: 'quote' }
          });
          
          if (data?.success && data?.data) {
            const marketInfo = data.data;
            newData.push({
              symbol: stock.symbol,
              name: stock.name,
              price: marketInfo.price,
              change: marketInfo.change,
              changePercent: marketInfo.changePercent,
              volume: marketInfo.volume || 0,
              marketCap: marketInfo.marketCap || 0,
              source: marketInfo.source,
              timestamp: marketInfo.timestamp,
              previousClose: marketInfo.previousClose
            });
          }
        } catch (err) {
          console.error(`Error fetching ${stock.symbol}:`, err);
        }
        
        // Longer delay to reduce flickering
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      if (newData.length > 0) {
        setMarketData(newData);
        setLastUpdate(new Date().toLocaleTimeString());
        setIsLive(newData.some(d => d.source.includes('OpenAI')));
      }
    } catch (error) {
      console.error('Error fetching live market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    
    // Reduced auto-refresh to every 2 minutes to prevent flickering
    const interval = setInterval(fetchLiveData, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    if (marketCap >= 1000000000) return `$${(marketCap / 1000000000).toFixed(1)}B`;
    if (marketCap >= 1000000) return `$${(marketCap / 1000000).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  return (
    <Card className="w-full backdrop-blur-md bg-card/60 border border-border/50 shadow-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            Live Market Data
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge variant="default" className="bg-emerald-500 animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                OpenAI Live
              </Badge>
            )}
            <Button 
              onClick={fetchLiveData} 
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate} • Powered by OpenAI GPT-4.1
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {marketData.map((stock) => (
            <div
              key={stock.symbol}
              className="p-4 bg-gradient-to-br from-secondary/10 to-background/50 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs font-mono bg-primary/10 text-primary border-primary/30">
                  {stock.symbol}
                </Badge>
                <div className="flex items-center gap-1">
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  {stock.source.includes('OpenAI') && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground truncate font-medium">{stock.name}</p>
                <p className="text-xl font-bold text-foreground">{formatPrice(stock.price)}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    stock.change >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent})
                  </p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-medium">{formatVolume(stock.volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span className="font-medium">{formatMarketCap(stock.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prev Close:</span>
                    <span className="font-medium">{formatPrice(stock.previousClose)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {marketData.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No market data available. Click refresh to load live data.</p>
          </div>
        )}
        
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="p-4 bg-secondary/10 rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};