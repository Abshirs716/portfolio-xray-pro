import React, { useState } from 'react';
import UniversalUploaderLite from './components/portfolio/UniversalUploaderLite';
import { PortfolioDashboard } from './components/portfolio/PortfolioDashboard';
import { RiskAnalysis } from './components/portfolio/RiskAnalysis';
import { SectorAnalysis } from './components/portfolio/SectorAnalysis';
import { adaptParseResultToLegacy } from './adapters/legacyAdapters';
import type { ParseResult } from './adapters/legacyAdapters';
import './App.css';

const nz = (v: any, def = 0) => (Number.isFinite(v) ? v : def);

function App() {
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const isDarkMode = true;

  const onDataParsed = (result: ParseResult) => {
    console.log('[ParseResult]', {
      total_value: result?.totals?.total_value,
      positions: result?.totals?.positions_count,
      files: result?.metadata?.files?.length || 0,
    });
    
    // NEW: Log first holding's raw data from backend
    console.log('=== BACKEND RAW DATA ===');
    console.log('First holding from backend:', result?.holdings?.[0]);
    console.log('All holdings cost_basis values:', result?.holdings?.map(h => ({
      symbol: h.symbol, 
      cost_basis: h.cost_basis, 
      market_value: h.market_value,
      shares: h.shares,
      price: h.price
    })));
    
    setParsed(result);
  };

  // Adapt backend ParseResult into props the legacy components expect
  const adapted = parsed ? adaptParseResultToLegacy(parsed) : null;

  // NEW: Log adapter output
  if (adapted) {
    console.log('=== ADAPTER OUTPUT ===');
    console.log('First adapted holding:', adapted.holdings[0]);
    console.log('All adapted holdings cost data:', adapted.holdings.map(h => ({
      symbol: h.symbol,
      shares: h.shares,
      price: h.price,
      marketValue: h.marketValue,
      costBasis: h.costBasis,
      totalCost: h.totalCost,
      cost_basis: h.cost_basis || 'undefined',
      total_cost: h.total_cost || 'undefined'
    })));
    console.log('Total cost sum from adapter:', adapted.holdings.reduce((sum, h) => sum + (h.totalCost || 0), 0));
    console.log('Total market value from adapter:', adapted.totalValue);
  }

  // Top tiles above the dashboards
  const topTiles = adapted && (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-gray-400 text-sm">Total Value</div>
        <div className="text-2xl font-bold">
          ${nz(adapted.totalValue, 0).toLocaleString()}
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-gray-400 text-sm">Positions</div>
        <div className="text-2xl font-bold">{adapted.positionsCount}</div>
      </div>
      <div className="bg-gray-800 p-4 rounded">
        <div className="text-gray-400 text-sm">Custodian</div>
        <div className="text-2xl font-bold">{adapted.custodianDisplay}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style>{`
        .bg-white { background-color: rgb(31 41 55) !important; }
        .bg-gray-50 { background-color: rgb(55 65 81) !important; }
        .text-gray-900 { color: rgb(229 231 235) !important; }
        .text-gray-600 { color: rgb(156 163 175) !important; }
        .border-gray-200 { border-color: rgb(55 65 81) !important; }
      `}</style>

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CapX100 Portfolio X-Ray Pro™
          </h1>
          <p className="text-gray-400">
            Universal Parser ✓ • Real Calculations ✓ • Full Transparency
          </p>
        </div>

        <div className="mb-8">
          <UniversalUploaderLite onDataParsed={onDataParsed} isDarkMode={isDarkMode} />
        </div>

        {adapted && (
          <>
            {topTiles}

            {/* Portfolio Dashboard */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Portfolio Dashboard</h2>
              {(() => {
                console.log('=== PORTFOLIO DASHBOARD INPUT ===');
                console.log('Holdings passed to PortfolioDashboard:', adapted.holdings.map(h => ({
                  symbol: h.symbol,
                  costBasis: h.costBasis,
                  totalCost: h.totalCost,
                  cost_basis: h.cost_basis,
                  total_cost: h.total_cost,
                  marketValue: h.marketValue,
                  market_value: h.market_value
                })));
                console.log('Total cost should be:', adapted.holdings.reduce((sum, h) => sum + (h.totalCost || 0), 0));
                return null;
              })()}
              <PortfolioDashboard
                holdings={adapted.holdings}
                totalValue={adapted.totalValue}
              />
            </div>

            {/* Risk Analysis */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Risk Analysis</h2>
              {(() => {
                console.log('=== RISK ANALYSIS INPUT ===');
                console.log('Holdings passed to RiskAnalysis:', adapted.holdings.map(h => ({
                  symbol: h.symbol,
                  costBasis: h.costBasis,
                  totalCost: h.totalCost,
                  cost_basis: h.cost_basis,
                  total_cost: h.total_cost,
                  marketValue: h.marketValue,
                  market_value: h.market_value
                })));
                return null;
              })()}
              <RiskAnalysis
                holdings={adapted.holdings}
                isDarkMode={true}
              />
            </div>

            {/* Sector Analysis */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Sector Analysis</h2>
              {(() => {
                console.log('=== SECTOR ANALYSIS INPUT ===');
                console.log('Holdings passed to SectorAnalysis:', adapted.holdings.map(h => ({
                  symbol: h.symbol,
                  costBasis: h.costBasis,
                  totalCost: h.totalCost,
                  cost_basis: h.cost_basis,
                  total_cost: h.total_cost,
                  marketValue: h.marketValue,
                  market_value: h.market_value
                })));
                return null;
              })()}
              <SectorAnalysis
                holdings={adapted.holdings}
                isDarkMode={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;