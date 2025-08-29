// src/components/portfolio/HoldingsTable.tsx
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Download, Filter, Eye, EyeOff } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface HoldingsTableProps {
  holdings: Holding[];
  isDarkMode?: boolean;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings, isDarkMode = false }) => {
  const [sortKey, setSortKey] = useState<keyof Holding>('marketValue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [showCostBasis, setShowCostBasis] = useState(true);

  // Theme
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    headerBg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    rowHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    inputBg: isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  };

  // Get unique sectors for filter
  const sectors = useMemo(() => {
    const sectorSet = new Set(holdings.map(h => h.sector || 'Other'));
    return Array.from(sectorSet).sort();
  }, [holdings]);

  // Filter and sort holdings
  const processedHoldings = useMemo(() => {
    let filtered = [...holdings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply value filter
    if (minValue) {
      filtered = filtered.filter(h => h.marketValue >= parseFloat(minValue));
    }
    if (maxValue) {
      filtered = filtered.filter(h => h.marketValue <= parseFloat(maxValue));
    }

    // Apply sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(h => (h.sector || 'Other') === selectedSector);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortKey] || 0;
      const bValue = b[sortKey] || 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return filtered;
  }, [holdings, searchTerm, minValue, maxValue, selectedSector, sortKey, sortOrder]);

  // Handle sorting
  const handleSort = (key: keyof Holding) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const totalMarketValue = processedHoldings.reduce((sum, h) => sum + h.marketValue, 0);
    const totalCost = processedHoldings.reduce((sum, h) => sum + (h.totalCost || h.costBasis * h.shares), 0);
    const totalGain = totalMarketValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    
    return { totalMarketValue, totalCost, totalGain, totalGainPercent };
  }, [processedHoldings]);

  // Export to CSV - FIXED VERSION
  const exportToCSV = () => {
    const date = new Date().toISOString().split('T')[0];
    
    // Build CSV rows
    const rows = [];
    
    // Add header section
    rows.push(['Portfolio Analysis Report']);
    rows.push([`Generated: ${new Date().toLocaleDateString()}`]);
    rows.push(['']);
    rows.push(['Portfolio Summary']);
    rows.push([`Total Market Value:`, totals.totalMarketValue.toFixed(2)]);
    rows.push([`Total Cost Basis:`, totals.totalCost.toFixed(2)]);
    rows.push([`Total Unrealized Gain/Loss:`, totals.totalGain.toFixed(2), `${totals.totalGainPercent.toFixed(2)}%`]);
    rows.push([`Total Positions:`, processedHoldings.length]);
    rows.push(['']);
    rows.push(['']);
    
    // Add holdings header
    rows.push(['Symbol', 'Name', 'Shares', 'Price', 'Market Value', 'Cost Basis', 'Total Cost', 'Unrealized Gain', 'Unrealized Gain %', 'Sector', 'Weight %']);
    
    // Add data rows - WITHOUT COMMAS IN NUMBERS
    processedHoldings.forEach(h => {
      const totalCost = h.totalCost || h.costBasis * h.shares;
      const unrealizedGain = h.unrealizedGain || (h.marketValue - totalCost);
      const unrealizedGainPercent = h.unrealizedGainPercent || (totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0);
      
      rows.push([
        h.symbol,
        h.name,
        h.shares.toFixed(2),
        h.price.toFixed(2),
        h.marketValue.toFixed(2),
        h.costBasis.toFixed(2),
        totalCost.toFixed(2),
        unrealizedGain.toFixed(2),
        unrealizedGainPercent.toFixed(2),
        h.sector || 'Other',
        ((h.weight || 0) * 100).toFixed(2)
      ]);
    });
    
    // Add totals row
    rows.push(['']);
    rows.push(['TOTAL', `${processedHoldings.length} positions`, '', '', totals.totalMarketValue.toFixed(2), '', totals.totalCost.toFixed(2), totals.totalGain.toFixed(2), totals.totalGainPercent.toFixed(2), '', '100.00']);

    // Convert to CSV string using TAB separator for Excel
    const csvContent = rows.map(row => row.join('\t')).join('\n');

    // Create blob with BOM for Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Portfolio_Analysis_${date}.tsv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const SortIcon = ({ column }: { column: keyof Holding }) => {
    if (sortKey !== column) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className={`rounded-xl shadow-lg border transition-all duration-300 ${theme.cardBg}`}>
      {/* Header and Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className={`text-2xl font-bold ${theme.textPrimary}`}>
            Holdings Details
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-3 py-2 rounded-lg border ${theme.inputBg} w-64`}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${theme.buttonSecondary}`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Cost Basis Toggle */}
            <button
              onClick={() => setShowCostBasis(!showCostBasis)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${theme.buttonSecondary}`}
            >
              {showCostBasis ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Cost Basis
            </button>

            {/* Export */}
            <button
              onClick={exportToCSV}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${theme.buttonPrimary}`}
            >
              <Download className="w-4 h-4" />
              Export TSV
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.textSecondary}`}>
                  Sector
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${theme.inputBg}`}
                >
                  <option value="all">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.textSecondary}`}>
                  Min Value
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${theme.inputBg}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.textSecondary}`}>
                  Max Value
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${theme.inputBg}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className={`mt-4 text-sm ${theme.textSecondary}`}>
          Showing {processedHoldings.length} of {holdings.length} holdings
          {searchTerm && ` • Searching for "${searchTerm}"`}
          {selectedSector !== 'all' && ` • Filtered by ${selectedSector}`}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={theme.headerBg}>
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('symbol')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600`}
                >
                  Symbol <SortIcon column="symbol" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600`}
                >
                  Name <SortIcon column="name" />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('shares')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                >
                  Shares <SortIcon column="shares" />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('price')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                >
                  Price <SortIcon column="price" />
                </button>
              </th>
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('marketValue')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                >
                  Market Value <SortIcon column="marketValue" />
                </button>
              </th>
              {showCostBasis && (
                <>
                  <th className="text-right p-4">
                    <button
                      onClick={() => handleSort('costBasis')}
                      className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                    >
                      Cost/Share <SortIcon column="costBasis" />
                    </button>
                  </th>
                  <th className="text-right p-4">
                    <button
                      onClick={() => handleSort('totalCost')}
                      className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                    >
                      Total Cost <SortIcon column="totalCost" />
                    </button>
                  </th>
                  <th className="text-right p-4">
                    <button
                      onClick={() => handleSort('unrealizedGain')}
                      className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                    >
                      Gain/Loss <SortIcon column="unrealizedGain" />
                    </button>
                  </th>
                  <th className="text-right p-4">
                    <button
                      onClick={() => handleSort('unrealizedGainPercent')}
                      className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                    >
                      Gain % <SortIcon column="unrealizedGainPercent" />
                    </button>
                  </th>
                </>
              )}
              <th className="text-right p-4">
                <button
                  onClick={() => handleSort('weight')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600 ml-auto`}
                >
                  Weight % <SortIcon column="weight" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('sector')}
                  className={`flex items-center gap-1 font-semibold ${theme.textPrimary} hover:text-blue-600`}
                >
                  Sector <SortIcon column="sector" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {processedHoldings.map((holding, index) => {
              const totalCost = holding.totalCost || holding.costBasis * holding.shares;
              const unrealizedGain = holding.unrealizedGain || (holding.marketValue - totalCost);
              const unrealizedGainPercent = holding.unrealizedGainPercent || 
                (totalCost > 0 ? (unrealizedGain / totalCost) * 100 : 0);
              
              return (
                <tr key={`${holding.symbol}-${index}`} className={`border-t border-gray-200 dark:border-gray-700 ${theme.rowHover}`}>
                  <td className={`p-4 font-semibold ${theme.textPrimary}`}>
                    {holding.symbol}
                  </td>
                  <td className={`p-4 ${theme.textSecondary}`}>
                    {holding.name}
                  </td>
                  <td className={`p-4 text-right ${theme.textPrimary}`}>
                    {formatNumber(holding.shares)}
                  </td>
                  <td className={`p-4 text-right ${theme.textPrimary}`}>
                    ${formatNumber(holding.price, 2)}
                  </td>
                  <td className={`p-4 text-right font-semibold ${theme.textPrimary}`}>
                    {formatCurrency(holding.marketValue)}
                  </td>
                  {showCostBasis && (
                    <>
                      <td className={`p-4 text-right ${theme.textSecondary}`}>
                        ${formatNumber(holding.costBasis, 2)}
                      </td>
                      <td className={`p-4 text-right ${theme.textSecondary}`}>
                        {formatCurrency(totalCost)}
                      </td>
                      <td className={`p-4 text-right font-semibold ${
                        unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(unrealizedGain)}
                      </td>
                      <td className={`p-4 text-right font-semibold ${
                        unrealizedGainPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {unrealizedGainPercent >= 0 ? '+' : ''}{formatNumber(unrealizedGainPercent, 1)}%
                      </td>
                    </>
                  )}
                  <td className={`p-4 text-right ${theme.textPrimary}`}>
                    {formatNumber((holding.weight || 0) * 100, 1)}%
                  </td>
                  <td className={`p-4 ${theme.textSecondary}`}>
                    {holding.sector || 'Other'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Totals Row */}
          <tfoot className={`border-t-2 border-gray-300 dark:border-gray-600 ${theme.headerBg}`}>
            <tr>
              <td colSpan={4} className={`p-4 font-bold ${theme.textPrimary}`}>
                TOTAL ({processedHoldings.length} positions)
              </td>
              <td className={`p-4 text-right font-bold text-lg ${theme.textPrimary}`}>
                {formatCurrency(totals.totalMarketValue)}
              </td>
              {showCostBasis && (
                <>
                  <td className="p-4"></td>
                  <td className={`p-4 text-right font-bold ${theme.textPrimary}`}>
                    {formatCurrency(totals.totalCost)}
                  </td>
                  <td className={`p-4 text-right font-bold text-lg ${
                    totals.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(totals.totalGain)}
                  </td>
                  <td className={`p-4 text-right font-bold text-lg ${
                    totals.totalGainPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {totals.totalGainPercent >= 0 ? '+' : ''}{formatNumber(totals.totalGainPercent, 1)}%
                  </td>
                </>
              )}
              <td className={`p-4 text-right font-bold ${theme.textPrimary}`}>
                100.0%
              </td>
              <td className="p-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};