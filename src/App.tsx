import React, { useState } from 'react';
import UniversalUploaderLite, { ParseResult } from './components/portfolio/UniversalUploaderLite';
import { HoldingsTable } from './components/portfolio/HoldingsTable';
import { PortfolioDashboard } from './components/portfolio/PortfolioDashboard';
import { RiskAnalysis } from './components/portfolio/RiskAnalysis';
import { SectorAnalysis } from './components/portfolio/SectorAnalysis';
import { PerformanceAnalysis } from './components/portfolio/PerformanceAnalysis';
import { adaptParseResultToLegacy } from './adapters/legacyAdapters';
import './App.css';

function App() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'holdings' | 'risk' | 'sector' | 'performance'>('dashboard');

  const handleParseResult = (result: ParseResult) => {
    console.log('Parse result received:', result);
    setParseResult(result);
  };

  const adapted = parseResult ? adaptParseResultToLegacy(parseResult) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2">CapX100 Portfolio X-Ray Pro™</h1>
          <p className="text-gray-300">Universal Parser ✓ • Real Calculations ✓ • Full Transparency</p>
        </header>

        <UniversalUploaderLite onDataParsed={handleParseResult} isDarkMode={true} />

        {adapted && adapted.holdings && adapted.holdings.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm mb-2">Total Value</h3>
                <p className="text-3xl font-bold">${adapted.totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm mb-2">Positions</h3>
                <p className="text-3xl font-bold">{adapted.positionsCount}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-sm mb-2">Custodian</h3>
                <p className="text-xl font-bold">{adapted.custodianDisplay}</p>
              </div>
            </div>

            <div className="flex gap-4 mb-8 flex-wrap">
              <button
                className={`px-4 py-2 rounded ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveView('dashboard')}
              >
                Portfolio Dashboard
              </button>
              <button
                className={`px-4 py-2 rounded ${activeView === 'holdings' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveView('holdings')}
              >
                Holdings Table
              </button>
              <button
                className={`px-4 py-2 rounded ${activeView === 'risk' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveView('risk')}
              >
                Risk Analysis
              </button>
              <button
                className={`px-4 py-2 rounded ${activeView === 'sector' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveView('sector')}
              >
                Sector Analysis
              </button>
              <button
                className={`px-4 py-2 rounded ${activeView === 'performance' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                onClick={() => setActiveView('performance')}
              >
                Performance Analysis
              </button>
            </div>

            {activeView === 'dashboard' && (
              <PortfolioDashboard holdings={adapted.holdings} isDarkMode={true} />
            )}
            {activeView === 'holdings' && (
              <HoldingsTable holdings={adapted.holdings} isDarkMode={true} />
            )}
            {activeView === 'risk' && (
              <RiskAnalysis 
                portfolio={{
                  custodian: adapted.custodianDisplay,
                  holdings: adapted.holdings,
                  totalValue: adapted.totalValue,
                  asOf: new Date(),
                  metadata: {
                    rowsParsed: adapted.positionsCount,
                    confidence: 95
                  }
                }} 
                isDarkMode={true} 
              />
            )}
            {activeView === 'sector' && (
              <SectorAnalysis holdings={adapted.holdings} isDarkMode={true} />
            )}
            {activeView === 'performance' && (
              <PerformanceAnalysis holdings={adapted.holdings} isDarkMode={true} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;