import { useState } from 'react'
import { BarChart3, Shield, Upload, FileText, CheckCircle, Sun, Moon } from 'lucide-react'
import './App.css'
import { SimpleUploader } from './components/portfolio/SimpleUploader'
import { RiskAnalysis } from './components/portfolio/RiskAnalysis'
import { PortfolioDashboard } from './components/portfolio/PortfolioDashboard'
import { SectorAnalysis } from './components/portfolio/SectorAnalysis'
import { PerformanceCharts } from './components/portfolio/PerformanceCharts'
import { PerformanceAnalytics } from './components/portfolio/PerformanceAnalytics'
import { ParseResult } from './types/portfolio'

function App() {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleDataParsed = (result: ParseResult) => {
    setParseResult(result)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalValue = parseResult?.holdings.reduce((sum, holding) => sum + holding.marketValue, 0) || 0

  // Theme classes
  const theme = {
    bg: isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    headerBg: isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    tableBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    tableHeaderBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    tableRowHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    tableBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    accent: isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${theme.bg}`}>
      {/* Header */}
      <header className={`shadow-lg border-b transition-all duration-300 ${theme.headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold transition-colors duration-300 ${theme.textPrimary}`}>
                  Portfolio X-Ray Pro™
                </h1>
                <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>by CapX100</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                Universal Custodian Support • 30-Second Analysis • 100% Transparency
              </span>
              {parseResult && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                  Portfolio Loaded
                </span>
              )}
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>
            30-Second Portfolio Analysis
          </h2>
          <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${theme.textSecondary}`}>
            Upload your CSV from any custodian and get instant professional analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <SimpleUploader onDataParsed={handleDataParsed} isDarkMode={isDarkMode} />
        </div>

        {/* Results Section */}
        {parseResult && parseResult.success && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Total Value</p>
                    <p className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary}`}>
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Holdings</p>
                    <p className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary}`}>
                      {parseResult.holdings.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Custodian</p>
                    <p className={`text-lg font-bold transition-colors duration-300 ${theme.textPrimary}`}>
                      {parseResult.metadata.custodianDetected}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium transition-colors duration-300 ${theme.textMuted}`}>Confidence</p>
                    <p className={`text-2xl font-bold transition-colors duration-300 ${theme.textPrimary}`}>
                      {parseResult.metadata.confidence.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className={`rounded-xl shadow-lg overflow-hidden border transition-all duration-300 ${theme.cardBg}`}>
              <div className={`px-6 py-5 border-b transition-all duration-300 ${theme.tableHeaderBg} ${theme.tableBorder}`}>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme.textPrimary}`}>Portfolio Holdings</h3>
                <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                  Processed {parseResult.metadata.rowsProcessed} holdings successfully
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`transition-all duration-300 ${theme.tableHeaderBg}`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Symbol
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Name
                      </th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Shares
                      </th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Price
                      </th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Market Value
                      </th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${theme.textSecondary}`}>
                        Gain/Loss
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y transition-all duration-300 ${theme.tableBg} ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {parseResult.holdings.map((holding, index) => (
                      <tr key={index} className={`transition-colors duration-300 ${theme.tableRowHover}`}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                          {holding.symbol}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                          {holding.name || '-'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium transition-colors duration-300 ${theme.textPrimary}`}>
                          {holding.shares.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium transition-colors duration-300 ${theme.textPrimary}`}>
                          ${holding.currentPrice.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                          {formatCurrency(holding.marketValue)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                          holding.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(holding.unrealizedGain)}
                          <span className="block text-xs font-normal">
                            ({holding.unrealizedGainPercent.toFixed(1)}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Portfolio Dashboard Section */}
            <PortfolioDashboard holdings={parseResult.holdings} isDarkMode={isDarkMode} />

            {/* Performance Analytics Section - NEW P&L & TWR */}
            <PerformanceAnalytics holdings={parseResult.holdings} isDarkMode={isDarkMode} />

            {/* Performance Charts Section */}
            <PerformanceCharts holdings={parseResult.holdings} isDarkMode={isDarkMode} />

            {/* Sector Analysis Section */}
            <SectorAnalysis holdings={parseResult.holdings} isDarkMode={isDarkMode} />

            {/* Risk Analysis Section */}
            <RiskAnalysis holdings={parseResult.holdings} isDarkMode={isDarkMode} />

            {/* Data X-Ray */}
            <div className={`rounded-xl shadow-lg p-6 border transition-all duration-300 ${theme.cardBg}`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme.textPrimary}`}>Data X-Ray™</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-lg p-4 transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <h4 className={`font-semibold mb-3 transition-colors duration-300 ${theme.textPrimary}`}>Detection Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Custodian:</span>
                      <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>{parseResult.metadata.custodianDetected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Confidence:</span>
                      <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>{parseResult.metadata.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Rows Processed:</span>
                      <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>{parseResult.metadata.rowsProcessed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`transition-colors duration-300 ${theme.textSecondary}`}>Rows Skipped:</span>
                      <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>{parseResult.metadata.rowsSkipped}</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 transition-all duration-300 ${
                  isDarkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <h4 className={`font-semibold mb-3 transition-colors duration-300 ${theme.textPrimary}`}>Column Mapping</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(parseResult.dataXRay.mappedColumns).map(([field, column]) => (
                      <div key={field} className="flex justify-between">
                        <span className={`capitalize transition-colors duration-300 ${theme.textSecondary}`}>{field}:</span>
                        <span className={`font-semibold transition-colors duration-300 ${theme.textPrimary}`}>{column}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Overview */}
        {!parseResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme.textPrimary}`}>Universal Parser</h3>
              </div>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${theme.textSecondary}`}>
                Works with 15+ custodians automatically. Unknown format? Our Visual Mapping Wizard handles it in 60 seconds.
              </p>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme.textPrimary}`}>100% Transparent</h3>
              </div>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${theme.textSecondary}`}>
                Every calculation shown step-by-step. See exactly how we detect your custodian and process your data.
              </p>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300 ${theme.cardBg}`}>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold transition-colors duration-300 ${theme.textPrimary}`}>Instant Analysis</h3>
              </div>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${theme.textSecondary}`}>
                Professional portfolio analysis in 30 seconds. Upload your CSV and get institutional-grade insights immediately.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App