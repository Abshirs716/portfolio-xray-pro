import React, { useState } from 'react';
import UniversalUploaderLite, { ParseResult } from './components/portfolio/UniversalUploaderLite';
import { PortfolioDashboard } from './components/portfolio/PortfolioDashboard';
import { RiskAnalysis } from './components/portfolio/RiskAnalysis';
import { SectorAnalysis } from './components/portfolio/SectorAnalysis';
import './App.css';

function App() {
  const [portfolioData, setPortfolioData] = useState<ParseResult | null>(null);
  const isDarkMode = true;

  const handleDataParsed = (result: ParseResult) => {
    console.log('Universal parser result:', result);
    setPortfolioData(result);
  };

  // Convert snake_case to camelCase for component compatibility
  const convertHoldings = (holdings: any[]) => {
    return holdings.map(h => ({
      symbol: h.symbol,
      name: h.name,
      shares: h.shares,
      price: h.price,
      marketValue: h.market_value,
      costBasis: h.cost_basis || h.price * h.shares,
      weight: h.weight,
      sector: h.sector,
      currency: h.currency
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CapX100 Portfolio X-Ray Pro™
          </h1>
          <p className="text-gray-400">
            Universal Parser Working ✓ • With Dashboard, Risk & Sector Analysis
          </p>
        </div>
        
        {/* Universal Uploader */}
        <div className="mb-8">
          <UniversalUploaderLite 
            onDataParsed={handleDataParsed} 
            isDarkMode={isDarkMode} 
          />
        </div>

        {/* Show parsed data */}
        {portfolioData && portfolioData.holdings && portfolioData.holdings.length > 0 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Total Value</div>
                <div className="text-2xl font-bold">${portfolioData.totals.total_value.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Positions</div>
                <div className="text-2xl font-bold">{portfolioData.totals.positions_count}</div>
              </div>
              <div className="bg-gray-800 p-4 rounded">
                <div className="text-gray-400 text-sm">Custodian</div>
                <div className="text-2xl font-bold">{portfolioData.metadata.custodianDetected}</div>
              </div>
            </div>

            {/* Portfolio Dashboard Component */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Portfolio Dashboard</h2>
              <PortfolioDashboard holdings={convertHoldings(portfolioData.holdings)} isDarkMode={isDarkMode} />
            </div>

            {/* Risk Analysis Component */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Risk Analysis - Full Transparency</h2>
              <RiskAnalysis holdings={convertHoldings(portfolioData.holdings)} isDarkMode={isDarkMode} />
            </div>

            {/* Sector Analysis Component */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Sector Analysis</h2>
              <SectorAnalysis holdings={convertHoldings(portfolioData.holdings)} isDarkMode={isDarkMode} />
            </div>

            {/* Holdings Table */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Holdings Detail</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-right p-2">Shares</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Market Value</th>
                      <th className="text-right p-2">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.holdings.map((h, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="p-2">{h.symbol}</td>
                        <td className="p-2 text-right">{h.shares.toFixed(2)}</td>
                        <td className="p-2 text-right">${h.price.toFixed(2)}</td>
                        <td className="p-2 text-right">${h.market_value.toFixed(2)}</td>
                        <td className="p-2 text-right">{(h.weight * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-900 p-4 rounded text-center">
              <p className="text-green-400">✓ Universal Parser Working!</p>
              <p className="text-sm text-gray-400">Successfully parsed {portfolioData.totals.positions_count} positions from {portfolioData.metadata.custodianDetected}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;