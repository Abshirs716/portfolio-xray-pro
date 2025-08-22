import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface MappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: string[];
  filename: string;
  onSave: (mapping: Record<string, number | null>) => void;
  isDarkMode?: boolean;
}

export const MappingModal: React.FC<MappingModalProps> = ({
  isOpen,
  onClose,
  headers,
  filename,
  onSave,
  isDarkMode = false
}) => {
  const theme = {
    bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    selectBg: isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
  };

  // Standard fields we need to map
  const requiredFields = [
    { key: 'symbol', label: 'Symbol/Ticker', alternatives: ['ticker', 'symbol', 'security', 'cusip'] },
    { key: 'name', label: 'Security Name', alternatives: ['name', 'security name', 'description'] },
    { key: 'quantity', label: 'Quantity/Shares', alternatives: ['quantity', 'shares', 'qty', 'units'] },
    { key: 'price', label: 'Price', alternatives: ['price', 'current price', 'last price', 'close'] },
    { key: 'market_value', label: 'Market Value', alternatives: ['market value', 'value', 'mv', 'marketvalue'] },
    { key: 'cost_basis', label: 'Cost Basis', alternatives: ['cost basis', 'cost', 'book value', 'avg cost'] },
    { key: 'sector', label: 'Sector', alternatives: ['sector', 'industry', 'asset class'] }
  ];

  // Initialize mapping with best guesses
  const initializeMapping = () => {
    const mapping: Record<string, number | null> = {};
    const lowerHeaders = headers.map(h => h.toLowerCase().trim());
    
    requiredFields.forEach(field => {
      mapping[field.key] = null;
      // Try to find a match
      for (const alt of field.alternatives) {
        const idx = lowerHeaders.findIndex(h => h === alt || h.includes(alt));
        if (idx !== -1) {
          mapping[field.key] = idx;
          break;
        }
      }
    });
    
    return mapping;
  };

  const [mapping, setMapping] = useState(initializeMapping);

  const handleFieldChange = (field: string, value: string) => {
    setMapping(prev => ({
      ...prev,
      [field]: value === '' ? null : parseInt(value)
    }));
  };

  const handleSave = () => {
    onSave(mapping);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${theme.bg}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${theme.text}`}>Map Column Headers</h2>
            <p className={`text-sm mt-1 ${theme.textSecondary}`}>
              File: {filename}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`mb-4 p-3 rounded-lg border ${theme.border} ${theme.inputBg}`}>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className={`text-sm ${theme.textSecondary}`}>
              <p className="font-medium">Column Mapping Required</p>
              <p>Please map your CSV columns to the standard fields below. This mapping will be remembered for future uploads with the same format.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {requiredFields.map(field => (
            <div key={field.key} className={`flex items-center gap-4 p-3 rounded-lg border ${theme.border}`}>
              <label className={`w-40 text-sm font-medium ${theme.text}`}>
                {field.label}
              </label>
              <select
                value={mapping[field.key] ?? ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.selectBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">-- Not mapped --</option>
                {headers.map((header, idx) => (
                  <option key={idx} value={idx}>
                    {header} (Column {idx + 1})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.text} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Mapping
          </button>
        </div>
      </div>
    </div>
  );
};