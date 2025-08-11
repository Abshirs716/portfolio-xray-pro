import { useState, useEffect } from 'react';
import { sentimentAnalysisService } from '@/services/ml/sentimentAnalysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, TrendingDown, Newspaper, Users, FileText, AlertCircle } from 'lucide-react';

interface SentimentAnalysisDashboardProps {
  symbol: string;
}

export const SentimentAnalysisDashboard: React.FC<SentimentAnalysisDashboardProps> = ({ symbol }) => {
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeSentiment();
  }, [symbol]);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      console.log('🔍 Calling sentiment analysis for:', symbol);
      const result = await sentimentAnalysisService.analyzeSentiment(symbol);
      console.log('📊 Sentiment result:', result);
      
      // Check if using fallback
      if (result.confidence === 78 || result.confidence === 65 || result.confidence === 50) {
        console.warn('⚠️ Using FALLBACK sentiment - Hugging Face NOT active');
      } else {
        console.log('✅ Real Hugging Face sentiment active!');
      }
      
      setSentiment(result);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse text-purple-500" />
            <span>AI analyzing market sentiment for {symbol}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentiment) return null;

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSignalVariant = (signal: string): "default" | "destructive" | "secondary" => {
    if (signal.includes('BUY')) return 'default';
    if (signal.includes('SELL')) return 'destructive';
    return 'secondary';
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0.1) return <TrendingUp className="h-8 w-8 text-green-500" />;
    if (impact < -0.1) return <TrendingDown className="h-8 w-8 text-red-500" />;
    return <AlertCircle className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <Card className="border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <CardTitle>AI Market Sentiment Analysis - {symbol}</CardTitle>
            </div>
            <Badge variant="outline" className="bg-purple-500/20">
              Powered by FinBERT Neural Network
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Sentiment */}
            <div className="text-center p-4 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-3">Overall Sentiment</h3>
              <div className={`text-4xl font-bold mb-3 ${getSentimentColor(sentiment.overall.label)}`}>
                {sentiment.overall.label.toUpperCase()}
              </div>
              <Progress 
                value={sentiment.overall.score * 100} 
                className="h-3"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {(sentiment.overall.score * 100).toFixed(0)}% confidence score
              </p>
            </div>

            {/* Market Impact */}
            <div className="text-center p-4 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-3">Expected Market Impact</h3>
              <div className="flex items-center justify-center gap-3 mb-3">
                {getImpactIcon(sentiment.overall.marketImpact)}
                <span className="text-3xl font-bold">
                  {sentiment.overall.marketImpact > 0 ? '+' : ''}{(sentiment.overall.marketImpact * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-predicted price movement based on sentiment
              </p>
            </div>

            {/* Trading Signal */}
            <div className="text-center p-4 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-3">AI Trading Signal</h3>
              <Badge 
                variant={getSignalVariant(sentiment.tradingSignal)}
                className="text-xl px-6 py-3 mb-3"
              >
                {sentiment.tradingSignal.replace('_', ' ')}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {sentiment.confidence.toFixed(0)}% model confidence
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* News Sentiment */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-semibold">Financial News</p>
                  <p className="text-sm text-muted-foreground">Latest headlines & articles</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${getSentimentColor(sentiment.sources.news.label)}`}>
                  {sentiment.sources.news.label.toUpperCase()}
                </span>
                <div className="w-32">
                  <Progress value={sentiment.sources.news.score * 100} className="h-2" />
                  <p className="text-xs text-right mt-1">{(sentiment.sources.news.score * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-semibold">Social Media</p>
                  <p className="text-sm text-muted-foreground">Twitter, Reddit, StockTwits</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${getSentimentColor(sentiment.sources.social.label)}`}>
                  {sentiment.sources.social.label.toUpperCase()}
                </span>
                <div className="w-32">
                  <Progress value={sentiment.sources.social.score * 100} className="h-2" />
                  <p className="text-xs text-right mt-1">{(sentiment.sources.social.score * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Analyst Reports */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-semibold">Analyst Reports</p>
                  <p className="text-sm text-muted-foreground">Wall Street consensus</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${getSentimentColor(sentiment.sources.analyst.label)}`}>
                  {sentiment.sources.analyst.label.toUpperCase()}
                </span>
                <div className="w-32">
                  <Progress value={sentiment.sources.analyst.score * 100} className="h-2" />
                  <p className="text-xs text-right mt-1">{(sentiment.sources.analyst.score * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};