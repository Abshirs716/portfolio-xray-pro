// src/components/portfolio/PortfolioManager.tsx
import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Users, Calendar, DollarSign } from 'lucide-react';
import { Holding } from '../../types/portfolio';

interface SavedPortfolio {
  id: string;
  name: string;
  clientName: string;
  savedAt: string;
  totalValue: number;
  holdings: Holding[];
  custodian: string;
  positionsCount: number;
}

interface PortfolioManagerProps {
  currentHoldings: Holding[];
  totalValue: number;
  custodian: string;
  onLoadPortfolio: (holdings: Holding[]) => void;
  isDarkMode?: boolean;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  currentHoldings,
  totalValue,
  custodian,
  onLoadPortfolio,
  isDarkMode = false
}) => {
  const [savedPortfolios, setSavedPortfolios] = useState<SavedPortfolio[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [clientName, setClientName] = useState('');

  // Theme
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    inputBg: isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
    modalBg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    buttonDanger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  // Load saved portfolios from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('savedPortfolios');
    if (stored) {
      try {
        setSavedPortfolios(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading saved portfolios:', e);
      }
    }
  }, []);

  // Save portfolio
  const handleSave = () => {
    if (!portfolioName.trim() || !clientName.trim()) {
      alert('Please enter both portfolio name and client name');
      return;
    }

    const newPortfolio: SavedPortfolio = {
      id: Date.now().toString(),
      name: portfolioName,
      clientName: clientName,
      savedAt: new Date().toISOString(),
      totalValue: totalValue,
      holdings: currentHoldings,
      custodian: custodian,
      positionsCount: currentHoldings.length
    };

    const updated = [...savedPortfolios, newPortfolio];
    setSavedPortfolios(updated);
    localStorage.setItem('savedPortfolios', JSON.stringify(updated));
    
    setShowSaveDialog(false);
    setPortfolioName('');
    setClientName('');
    alert(`Portfolio "${portfolioName}" saved successfully!`);
  };

  // Load portfolio
  const handleLoad = (portfolio: SavedPortfolio) => {
    onLoadPortfolio(portfolio.holdings);
    setShowLoadDialog(false);
    alert(`Loaded portfolio: ${portfolio.name}`);
  };

  // Delete portfolio
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio?')) {
      const updated = savedPortfolios.filter(p => p.id !== id);
      setSavedPortfolios(updated);
      localStorage.setItem('savedPortfolios', JSON.stringify(updated));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`rounded-xl shadow-lg p-6 border mb-8 ${theme.cardBg}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${theme.textPrimary} flex items-center`}>
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Portfolio Manager
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={currentHoldings.length === 0}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentHoldings.length > 0 ? theme.buttonPrimary : 'bg-gray-400 cursor-not-allowed text-gray-200'
            }`}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Current
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            className={`px-4 py-2 rounded-lg flex items-center ${theme.buttonSecondary}`}
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Load Portfolio ({savedPortfolios.length})
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.modalBg} rounded-lg p-6 w-96 shadow-xl`}>
            <h4 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>Save Portfolio</h4>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.textSecondary}`}>
                  Portfolio Name
                </label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g., Q4 2024 Review"
                  className={`w-full px-3 py-2 rounded border ${theme.inputBg}`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme.textSecondary}`}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className={`w-full px-3 py-2 rounded border ${theme.inputBg}`}
                />
              </div>

              <div className={`text-sm ${theme.textSecondary}`}>
                <p>Portfolio Value: {formatCurrency(totalValue)}</p>
                <p>Positions: {currentHoldings.length}</p>
                <p>Custodian: {custodian}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className={`px-4 py-2 rounded ${theme.buttonSecondary}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded ${theme.buttonPrimary}`}
              >
                Save Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.modalBg} rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-xl`}>
            <h4 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>Load Portfolio</h4>
            
            {savedPortfolios.length === 0 ? (
              <p className={`text-center py-8 ${theme.textSecondary}`}>
                No saved portfolios yet
              </p>
            ) : (
              <div className="space-y-3">
                {savedPortfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className={`p-4 rounded-lg border ${theme.cardBg} hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h5 className={`font-semibold ${theme.textPrimary}`}>
                            {portfolio.name}
                          </h5>
                          <span className={`text-sm px-2 py-1 rounded bg-blue-100 text-blue-600`}>
                            {portfolio.clientName}
                          </span>
                        </div>
                        <div className={`flex items-center space-x-4 mt-2 text-sm ${theme.textSecondary}`}>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(portfolio.savedAt)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {formatCurrency(portfolio.totalValue)}
                          </span>
                          <span>{portfolio.positionsCount} positions</span>
                          <span>{portfolio.custodian}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleLoad(portfolio)}
                          className={`px-3 py-1 rounded text-sm ${theme.buttonPrimary}`}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(portfolio.id)}
                          className={`px-3 py-1 rounded text-sm ${theme.buttonDanger}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowLoadDialog(false)}
                className={`px-4 py-2 rounded ${theme.buttonSecondary}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};