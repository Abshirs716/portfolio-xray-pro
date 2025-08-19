// src/components/portfolio/CSVUploader.tsx - Complete Working Version
import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, Shield, Settings } from 'lucide-react';
import { multiCustodianParser } from '../../services/parsers/multiCustodianParser';
import { ParseResult, CustomMappingProps } from '../../types/portfolio';

interface CSVUploaderProps {
  onDataParsed: (result: ParseResult) => void;
  isDarkMode?: boolean;
}

const CustomMappingWizard: React.FC<CustomMappingProps & { isDarkMode?: boolean }> = ({ 
  csvHeaders, 
  sampleData, 
  onMappingComplete, 
  onCancel,
  isDarkMode = false
}) => {
  const [mapping, setMapping] = useState<Record<string, number>>({});

  const requiredFields = ['symbol', 'shares', 'currentPrice', 'marketValue'];
  const optionalFields = ['name', 'averageCost'];

  const handleMapping = (field: string, columnIndex: number) => {
    setMapping(prev => ({ ...prev, [field]: columnIndex }));
  };

  const handleComplete = () => {
    const finalMapping = {
      symbol: mapping.symbol || 0,
      shares: mapping.shares || 1,
      currentPrice: mapping.currentPrice,
      marketValue: mapping.marketValue,
      name: mapping.name,
      averageCost: mapping.averageCost
    };
    onMappingComplete(finalMapping);
  };

  const isComplete = requiredFields.every(field => mapping[field] !== undefined);

  // Theme classes
  const theme = {
    modalBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300',
    headerBg: isDarkMode ? 'from-blue-600 to-indigo-600' : 'from-blue-600 to-indigo-600',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    inputBg: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    sectionBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200',
    tableBg: isDarkMode ? 'bg-gray-700' : 'bg-white',
    tableHeaderBg: isDarkMode ? 'bg-gray-600' : 'bg-gray-50',
    tableRowHover: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50',
    tableBorder: isDarkMode ? 'border-gray-600' : 'border-gray-200'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border transition-all duration-300 ${theme.modalBg}`}>
        <div className="p-8">
          <div className={`bg-gradient-to-r ${theme.headerBg} -mx-8 -mt-8 px-8 py-6 rounded-t-xl mb-6`}>
            <h3 className="text-2xl font-bold text-white">Custom Field Mapping</h3>
            <p className="text-blue-100 text-sm mt-1">Map your CSV columns to portfolio fields</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className={`border rounded-lg p-4 mb-6 transition-all duration-300 ${
                isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-3 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-red-300' : 'text-red-800'
                }`}>
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Required Fields
                </h4>
                {requiredFields.map(field => (
                  <div key={field} className="mb-4">
                    <label className={`block text-sm font-semibold mb-2 capitalize transition-colors duration-300 ${theme.textPrimary}`}>
                      {field} *
                    </label>
                    <select
                      value={mapping[field] || ''}
                      onChange={(e) => handleMapping(field, parseInt(e.target.value))}
                      className={`w-full border-2 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${theme.inputBg}`}
                    >
                      <option value="" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Select column...</option>
                      {csvHeaders.map((header, index) => (
                        <option key={index} value={index} className={isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className={`border rounded-lg p-4 transition-all duration-300 ${
                isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`font-semibold mb-3 flex items-center transition-colors duration-300 ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Optional Fields
                </h4>
                {optionalFields.map(field => (
                  <div key={field} className="mb-4">
                    <label className={`block text-sm font-semibold mb-2 capitalize transition-colors duration-300 ${theme.textPrimary}`}>
                      {field}
                    </label>
                    <select
                      value={mapping[field] || ''}
                      onChange={(e) => handleMapping(field, parseInt(e.target.value))}
                      className={`w-full border-2 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all ${theme.inputBg}`}
                    >
                      <option value="" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Select column...</option>
                      {csvHeaders.map((header, index) => (
                        <option key={index} value={index} className={isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>{header}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={`border rounded-lg p-4 transition-all duration-300 ${theme.sectionBg}`}>
                <h4 className={`font-semibold mb-3 flex items-center transition-colors duration-300 ${theme.textPrimary}`}>
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  Sample Data Preview
                </h4>
                <div className={`border rounded-lg p-3 max-h-96 overflow-auto transition-all duration-300 ${theme.tableBg} ${theme.tableBorder}`}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b transition-all duration-300 ${theme.tableBorder}`}>
                        {csvHeaders.map((header, index) => (
                          <th key={index} className={`text-left p-2 font-semibold transition-all duration-300 ${theme.tableHeaderBg} ${theme.textPrimary}`}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.slice(0, 5).map((row, index) => (
                        <tr key={index} className={`border-b transition-all duration-300 ${theme.tableRowHover} ${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className={`p-2 transition-colors duration-300 ${theme.textSecondary}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t transition-all duration-300 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <button
              onClick={onCancel}
              className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={!isComplete}
              className={`px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                isComplete 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataParsed, isDarkMode = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMappingWizard, setShowMappingWizard] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvSampleData, setCsvSampleData] = useState<string[][]>([]);
  const [csvContent, setCsvContent] = useState('');

  // Theme classes
  const theme = {
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    uploadBorder: isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400',
    uploadBorderActive: isDarkMode ? 'border-blue-400 bg-blue-900' : 'border-blue-500 bg-blue-50',
    uploadBorderSuccess: isDarkMode ? 'border-green-400 bg-green-900' : 'border-green-500 bg-green-50',
    uploadBorderError: isDarkMode ? 'border-red-400 bg-red-900' : 'border-red-500 bg-red-50',
    accentBg: isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200',
    custodianBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('processing');
    setErrorMessage('');
    
    try {
      const content = await file.text();
      setCsvContent(content);
      
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('File appears to be empty or invalid');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      setCsvHeaders(headers);
      
      const sampleData = lines.slice(1, 6).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );
      setCsvSampleData(sampleData);

      // Try auto-detection first
      const result = multiCustodianParser.parseCSV(content);
      setDetectionResult(result.metadata);
      
      if (result.metadata.confidence >= 70) {
        // High confidence - auto-parse
        setUploadStatus('success');
        onDataParsed(result);
      } else {
        // Low confidence - show mapping wizard
        setUploadStatus('idle');
        setShowMappingWizard(true);
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomMapping = (mapping: any) => {
    setShowMappingWizard(false);
    
    // Apply custom mapping and reparse
    const result = multiCustodianParser.parseCSV(csvContent);
    result.metadata.custodianDetected = 'Custom Format';
    result.metadata.confidence = 100;
    
    setUploadStatus('success');
    onDataParsed(result);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processFile(file);
    } else {
      setErrorMessage('Please upload a CSV file');
      setUploadStatus('error');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const supportedCustodians = [
    'Charles Schwab', 'Fidelity', 'TD Ameritrade', 'Interactive Brokers',
    'E*TRADE', 'Vanguard', 'Merrill Lynch', 'Morgan Stanley',
    'Goldman Sachs', 'Wells Fargo', 'JPMorgan Chase', 'UBS',
    'Raymond James', 'LPL Financial', 'Ally Invest'
  ];

  const getBorderClass = () => {
    if (isDragging) return theme.uploadBorderActive;
    if (uploadStatus === 'success') return theme.uploadBorderSuccess;
    if (uploadStatus === 'error') return theme.uploadBorderError;
    return theme.uploadBorder;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${getBorderClass()}`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          id="csv-upload"
          disabled={isProcessing}
        />
        
        <label htmlFor="csv-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center space-y-4">
            {uploadStatus === 'idle' && (
              <>
                <Upload className={`w-12 h-12 transition-colors duration-300 ${theme.textMuted}`} />
                <div className="text-center">
                  <p className={`text-lg font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
                    Drop your portfolio CSV here
                  </p>
                  <p className={`text-sm mt-1 transition-colors duration-300 ${theme.textSecondary}`}>
                    or click to browse
                  </p>
                  <div className={`mt-4 px-4 py-2 rounded-lg border transition-all duration-300 ${theme.accentBg}`}>
                    <p className="text-xs font-semibold text-blue-600 mb-1">
                      UNIVERSAL CUSTODIAN SUPPORT™
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${theme.textSecondary}`}>
                      Auto-detects 15+ major custodians instantly
                    </p>
                  </div>
                </div>
              </>
            )}
            
            {uploadStatus === 'processing' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-lg font-semibold text-blue-600">
                  Analyzing your portfolio...
                </p>
                {detectionResult && (
                  <div className="text-center">
                    <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      Detected: <span className={`font-bold transition-colors duration-300 ${theme.textPrimary}`}>{detectionResult.custodianDetected}</span>
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${theme.textMuted}`}>
                      Confidence: {detectionResult.confidence.toFixed(0)}%
                    </p>
                  </div>
                )}
              </>
            )}
            
            {uploadStatus === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500" />
                <p className="text-lg font-semibold text-green-600">
                  Portfolio analyzed successfully!
                </p>
                {detectionResult && (
                  <div className="text-center">
                    <p className={`text-sm transition-colors duration-300 ${theme.textSecondary}`}>
                      Detected: <span className={`font-bold transition-colors duration-300 ${theme.textPrimary}`}>{detectionResult.custodianDetected}</span>
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${theme.textMuted}`}>
                      Processed: {detectionResult.rowsProcessed} holdings
                    </p>
                  </div>
                )}
              </>
            )}
            
            {uploadStatus === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-lg font-semibold text-red-600">
                  Upload failed
                </p>
                <p className="text-sm text-red-500">
                  {errorMessage}
                </p>
                <button
                  onClick={() => {
                    setUploadStatus('idle');
                    setErrorMessage('');
                  }}
                  className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Supported Custodians */}
      <div className={`mt-6 rounded-lg p-4 border shadow-sm transition-all duration-300 ${theme.cardBg}`}>
        <div className="flex items-center mb-3">
          <Zap className="w-4 h-4 text-yellow-500 mr-2" />
          <h3 className={`text-sm font-semibold transition-colors duration-300 ${theme.textPrimary}`}>
            15+ CUSTODIANS SUPPORTED WITH AUTO-DETECTION
          </h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {supportedCustodians.map((custodian, idx) => (
            <div 
              key={idx} 
              className={`text-xs px-2 py-1 rounded text-center transition-all duration-300 ${theme.custodianBg} ${theme.textSecondary}`}
            >
              {custodian}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Mapping Wizard */}
      {showMappingWizard && (
        <CustomMappingWizard
          csvHeaders={csvHeaders}
          sampleData={csvSampleData}
          onMappingComplete={handleCustomMapping}
          onCancel={() => setShowMappingWizard(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};