// src/pages/Portfolio.tsx

import React, { useState } from 'react';
import { Calculator, FileText, BarChart3, Shield } from 'lucide-react';
import { SimpleUploader } from '../components/portfolio/SimpleUploader';
import { MetricsDisplay } from '../components/portfolio/MetricsDisplay';
import { calculateRealPortfolioMetrics, PortfolioMetrics, PortfolioHolding } from '../services/calculations/metricsCalculator';
import { ParseResult } from '../types/portfolio';

const Portfolio: React.FC = () => {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMetrics = async () => {
    console.log('🔥 BUTTON CLICKED! 🔥');
    console.log('✅ Starting REAL portfolio metrics calculation...');
    
    if (!parseResult?.success) {
      console.log('❌ No parse result available');
      return;
    }

    setIsCalculating(true);
    
    try {
      console.log('📊 Using actual portfolio holdings:', parseResult.holdings);
      
      // Convert holdings to the format our calculator expects with proper type safety
      const portfolioHoldings: PortfolioHolding[] = parseResult.holdings.map(holding => ({
        symbol: holding.symbol,
        shares: holding.shares,
        marketValue: holding.marketValue || holding.costBasis || 0
      }));
      
      console.log('💼 Calculated portfolio weights for:', portfolioHoldings.map(h => h.symbol).join(', '));
      
      // Use REAL portfolio data instead of just Apple
      const portfolioMetrics = await calculateRealPortfolioMetrics(portfolioHoldings, 252);
      
      console.log('✅ Real portfolio metrics calculated successfully!');
      console.log('📈 Portfolio composition:', portfolioMetrics.dataSource);
      
      setTimeout(() => {
        setMetrics(portfolioMetrics);
        setIsCalculating(false);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error calculating real portfolio metrics:', error);
      setIsCalculating(false);
    }
  };

  const handleDataParsed = (result: ParseResult) => {
    console.log('🔥 DATA PARSED! 🔥');
    console.log('parseResult received:', result);
    setParseResult(result);
    setMetrics(null); // Reset metrics when new data is uploaded
  };

  // Calculate portfolio summary
  const getPortfolioSummary = () => {
    if (!parseResult?.success) return null;
    
    const totalValue = parseResult.holdings.reduce((sum, holding) => {
      return sum + (holding.marketValue || holding.costBasis || 0);
    }, 0);
    const holdings = parseResult.holdings;
    
    return { totalValue, holdings: holdings.length, symbols: holdings.map(h => h.symbol) };
  };

  const portfolioSummary = getPortfolioSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio X-Ray Pro™
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Institutional-Grade Performance Analysis with Complete Transparency
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart CSV Detection</h3>
              <p className="text-sm text-gray-600">Auto-detects custodian formats with confidence scoring</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
              <p className="text-sm text-gray-600">Sharpe, Sortino, Max Drawdown, Up/Down Capture</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Data X-Ray™</h3>
              <p className="text-sm text-gray-600">Complete calculation transparency</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">GIPS Reports</h3>
              <p className="text-sm text-gray-600">Institutional-grade PDF reports</p>
            </div>
          </div>
        </div>

        {/* CSV Uploader */}
        <div className="mb-8">
           <SimpleUploader onDataParsed={handleDataParsed} />
        </div>

        {/* Ready for Analytics */}
        {parseResult?.success && !metrics && portfolioSummary && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready for Real Portfolio Analytics?
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-blue-900">Holdings:</span>
                    <span className="text-blue-700 ml-2">{portfolioSummary.holdings} positions</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-900">Total Value:</span>
                    <span className="text-blue-700 ml-2">${portfolioSummary.totalValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-900">Symbols:</span>
                    <span className="text-blue-700 ml-2">{portfolioSummary.symbols.join(', ')}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Calculate performance metrics using <strong>real historical data</strong> for each holding, 
                weighted by your actual position sizes. This provides true portfolio-level analytics.
              </p>
              <button
                onClick={calculateMetrics}
                disabled={isCalculating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Fetching Real Data for All Holdings...
                  </div>
                ) : (
                  'Calculate Real Portfolio Metrics →'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isCalculating && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyzing Real Portfolio Performance...
              </h3>
              <p className="text-gray-600">
                Fetching historical data for all holdings and calculating weighted portfolio returns
              </p>
              {portfolioSummary && (
                <div className="text-sm text-gray-500 mt-2">
                  Processing: {portfolioSummary.symbols.join(' • ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Display */}
        {metrics && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Real Portfolio Analysis: {metrics.dataSource.symbols} via {metrics.dataSource.dataProvider}
                  </p>
                  <p className="text-sm text-green-700">
                    {metrics.dataSource.periods} trading days • Portfolio value: ${metrics.dataSource.totalValue?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <MetricsDisplay metrics={metrics} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;