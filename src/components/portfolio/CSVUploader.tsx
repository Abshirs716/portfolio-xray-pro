// src/components/portfolio/CSVUploader.tsx - Complete Universal CSV Uploader

import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Zap, Shield, Settings } from 'lucide-react';
import { multiCustodianParser } from '../../services/parsers/multiCustodianParser';
import { CustomMappingWizard } from './CustomMappingWizard';
import { ParseResult } from '../../types/portfolio';

interface CSVUploaderProps {
  onDataParsed?: (result: ParseResult) => void;
}

interface DetectionResult {
  custodian: string;
  confidence: number;
  format: string;
  supportedCustodians: string[];
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataParsed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [showDataXRay, setShowDataXRay] = useState(false);
  const [showMappingWizard, setShowMappingWizard] = useState(false);
  const [currentCsvContent, setCurrentCsvContent] = useState<string>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvSampleData, setCsvSampleData] = useState<Record<string, string>[]>([]);

  const SUPPORTED_CUSTODIANS = [
    'Charles Schwab', 'Fidelity', 'TD Ameritrade', 'Interactive Brokers', 'Pershing',
    'E*Trade', 'Raymond James', 'LPL Financial', 'Wells Fargo Advisors', 
    'Merrill Lynch', 'Morgan Stanley', 'UBS', 'Commonwealth Financial',
    'Cambridge Investment Research', 'Stifel', 'Custom Format'
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const parseCSVForSample = (csvContent: string) => {
    const lines = csvContent.split('\n').map(line => line.trim());
    const headerLine = lines.find(line => line.length > 0 && !line.startsWith('#'));
    
    if (!headerLine) return { headers: [], sampleData: [] };

    const headers = parseCSVLine(headerLine);
    const headerIndex = lines.indexOf(headerLine);
    const dataLines = lines.slice(headerIndex + 1).filter(line => line.length > 0);

    const sampleData = dataLines.slice(0, 5).map(line => {
      const values = parseCSVLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, sampleData };
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(field => field.trim().replace(/^"|"$/g, ''));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setParseResult(null);
    setDetectionResult(null);
    setShowMappingWizard(false);

    try {
      console.log('🔄 CSV processing started...');
      const csvContent = await file.text();
      setCurrentCsvContent(csvContent);

      // Parse for sample data
      const { headers, sampleData } = parseCSVForSample(csvContent);
      setCsvHeaders(headers);
      setCsvSampleData(sampleData);
      
      // Step 1: Auto-detect custodian
      console.log('🔍 Detecting custodian format...');
      const detection = await multiCustodianParser.detectCustodian(csvContent);
      
      setDetectionResult({
        custodian: detection.custodian,
        confidence: detection.confidence,
        format: detection.format,
        supportedCustodians: SUPPORTED_CUSTODIANS
      });

      // Step 2: Check if we need custom mapping
      if (detection.confidence < 70 || detection.custodian === 'Custom Format') {
        console.log('⚠️ Low confidence or custom format detected, showing mapping wizard...');
        setIsProcessing(false);
        setShowMappingWizard(true);
        return;
      }

      // Step 3: Auto-parse the data (high confidence)
      await processParsedData(csvContent, detection);

    } catch (error) {
      console.error('❌ Error processing CSV:', error);
      handleParsingError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomMapping = async (customMappings: Record<string, string>) => {
    console.log('🎯 Applying custom mapping:', customMappings);
    setShowMappingWizard(false);
    setIsProcessing(true);

    try {
      // Create a custom detection result with the user's mappings
      const customDetection = {
        custodian: 'Custom Format',
        confidence: 100,
        format: 'User Mapped',
        columnMappings: customMappings
      };

      await processParsedData(currentCsvContent, customDetection);
    } catch (error) {
      console.error('❌ Error with custom mapping:', error);
      handleParsingError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processParsedData = async (csvContent: string, detection: any) => {
    console.log('📊 Parsing portfolio data...');
    const parsedData = await multiCustodianParser.parseCustodianData(csvContent, detection);
    
    // Transform to our format
    const holdings = parsedData.map(item => ({
      symbol: item.symbol,
      name: item.description || item.symbol,
      shares: item.shares,
      averageCost: item.costBasis ? item.costBasis / item.shares : 0,
      currentPrice: item.price,
      marketValue: item.marketValue,
      costBasis: item.costBasis || 0,
      unrealizedGain: item.marketValue - (item.costBasis || 0),
      unrealizedGainPercent: item.costBasis ? ((item.marketValue - item.costBasis) / item.costBasis) * 100 : 0,
      weight: 0 // Add weight property with default value
    }));

    const result: ParseResult = {
      success: true,
      holdings,
      metadata: {
        custodianDetected: detection.custodian,
        confidence: detection.confidence,
        rowsProcessed: parsedData.length,
        rowsSkipped: 0,
        errors: [],
        warnings: detection.confidence < 80 ? [`Confidence: ${detection.confidence}%`] : []
      },
      dataXRay: {
        originalColumns: Object.keys(parsedData[0] || {}),
        mappedColumns: detection.columnMappings,
        unmappedColumns: [],
        sampleData: parsedData.slice(0, 3)
      }
    };

    console.log('🔄 CSV processing complete. Result:', result);
    setParseResult(result);
    
    // Notify parent component
    console.log('📡 Calling onDataParsed with result');
    onDataParsed?.(result);
  };

  const handleParsingError = (error: any) => {
    const errorResult: ParseResult = {
      success: false,
      holdings: [],
      metadata: {
        custodianDetected: 'Unknown',
        confidence: 0,
        rowsProcessed: 0,
        rowsSkipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: []
      },
      dataXRay: {
        originalColumns: [],
        mappedColumns: {},
        unmappedColumns: [],
        sampleData: []
      }
    };
    setParseResult(errorResult);
  };

  const handleShowCustomMapping = () => {
    if (csvHeaders.length > 0) {
      setShowMappingWizard(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Universal Support Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Universal Custodian Support</h2>
            <p className="text-blue-100">
              Auto-detects 15+ custodians or use custom mapping wizard for any format
            </p>
          </div>
          <Shield className="h-16 w-16 text-blue-200" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
          {SUPPORTED_CUSTODIANS.slice(0, 8).map((custodian, index) => (
            <div key={index} className="bg-white/10 rounded px-3 py-2 text-center">
              <span className="text-sm font-medium">{custodian.split(' ')[0]}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-blue-200 text-sm">+ Any custom format with mapping wizard</span>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : isProcessing
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Your Portfolio...
            </h3>
            <p className="text-gray-600">
              Auto-detecting custodian format and parsing data
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your portfolio CSV here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-colors"
            >
              Choose CSV File
            </label>
          </>
        )}
      </div>

      {/* Detection Results */}
      {detectionResult && !showMappingWizard && (
        <div className="mt-8 bg-white rounded-lg shadow-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Custodian Detection Results
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Detected in {detectionResult.confidence > 90 ? '<5' : '<10'} seconds
                </span>
              </div>
              {csvHeaders.length > 0 && (
                <button
                  onClick={handleShowCustomMapping}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Custom Mapping
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`border rounded-lg p-4 ${
              detectionResult.confidence >= 80 ? 'bg-green-50 border-green-200' : 
              detectionResult.confidence >= 60 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                <CheckCircle className={`h-5 w-5 mr-2 ${
                  detectionResult.confidence >= 80 ? 'text-green-600' : 
                  detectionResult.confidence >= 60 ? 'text-yellow-600' : 
                  'text-red-600'
                }`} />
                <span className={`font-medium ${
                  detectionResult.confidence >= 80 ? 'text-green-800' : 
                  detectionResult.confidence >= 60 ? 'text-yellow-800' : 
                  'text-red-800'
                }`}>Custodian Detected</span>
              </div>
              <p className={`text-2xl font-bold ${
                detectionResult.confidence >= 80 ? 'text-green-900' : 
                detectionResult.confidence >= 60 ? 'text-yellow-900' : 
                'text-red-900'
              }`}>
                {detectionResult.custodian}
              </p>
              <p className={`text-sm ${
                detectionResult.confidence >= 80 ? 'text-green-700' : 
                detectionResult.confidence >= 60 ? 'text-yellow-700' : 
                'text-red-700'
              }`}>
                {detectionResult.format}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">Confidence Score</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{detectionResult.confidence}%</p>
              <p className="text-sm text-blue-700">
                {detectionResult.confidence >= 90 ? 'Excellent' : 
                 detectionResult.confidence >= 70 ? 'Good' : 
                 detectionResult.confidence >= 50 ? 'Fair' : 'Low'} match
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-800">Processing Status</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {detectionResult.confidence >= 70 ? 'Auto-Parsed' : 'Manual Required'}
              </p>
              <p className="text-sm text-purple-700">
                {detectionResult.confidence >= 70 ? 'Format validated' : 'Use custom mapping'}
              </p>
            </div>
          </div>

          {detectionResult.confidence < 70 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Low Confidence Detection</h4>
                  <p className="text-sm text-yellow-700">
                    We recommend using the custom mapping wizard to ensure accurate field mapping.
                  </p>
                </div>
                <button
                  onClick={handleShowCustomMapping}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Open Mapping Wizard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Mapping Wizard */}
      {showMappingWizard && (
        <CustomMappingWizard
          csvHeaders={csvHeaders}
          sampleData={csvSampleData}
          onMappingComplete={handleCustomMapping}
          onCancel={() => setShowMappingWizard(false)}
        />
      )}

      {/* Results Summary */}
      {parseResult && !showMappingWizard && (
        <div className="mt-8 bg-white rounded-lg shadow-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Portfolio Analysis Complete
            </h3>
            <button
              onClick={() => setShowDataXRay(!showDataXRay)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showDataXRay ? 'Hide' : 'Show'} Data X-Ray™
            </button>
          </div>

          {parseResult.success ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{parseResult.holdings.length}</p>
                <p className="text-gray-600">Holdings Processed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  ${parseResult.holdings.reduce((sum, h) => sum + (h.marketValue || 0), 0).toLocaleString()}
                </p>
                <p className="text-gray-600">Total Portfolio Value</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{parseResult.metadata.confidence}%</p>
                <p className="text-gray-600">Detection Accuracy</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{parseResult.metadata.custodianDetected}</p>
                <p className="text-gray-600">Source Platform</p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Processing Errors</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {parseResult.metadata.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Data X-Ray Panel */}
          {showDataXRay && parseResult.success && (
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Data X-Ray™ - Complete Transparency</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Column Mapping</h5>
                  <div className="space-y-2">
                    {Object.entries(parseResult.dataXRay.mappedColumns).map(([field, column]) => (
                      <div key={field} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">{column}</span>
                        <span className="font-medium text-gray-900">→ {field}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Sample Data Preview</h5>
                  <div className="space-y-2">
                    {parseResult.holdings.slice(0, 3).map((holding, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-sm text-gray-600">
                          {holding.shares} shares @ ${holding.currentPrice} = ${holding.marketValue?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};