import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, AlertCircle, FileText, Database, Settings } from 'lucide-react';
import { MappingModal } from './MappingModal';

interface SimpleUploaderProps {
  onDataParsed: (data: any) => void;
  isDarkMode?: boolean;
}

interface FilePreview {
  file: File;
  headers: string[];
  needsMapping: boolean;
}

export const SimpleUploader: React.FC<SimpleUploaderProps> = ({ onDataParsed, isDarkMode = false }) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'mapping' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [batchInfo, setBatchInfo] = useState<{ id: number; saved: boolean } | null>(null);
  const [filesToProcess, setFilesToProcess] = useState<FilePreview[]>([]);
  const [currentMappingFile, setCurrentMappingFile] = useState<FilePreview | null>(null);
  const [mappings, setMappings] = useState<Record<string, any>>({});

  const theme = {
    bg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    hoverBorder: isDarkMode ? 'border-blue-400' : 'border-blue-500',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    uploadBg: isDarkMode ? 'bg-gray-700' : 'bg-blue-50',
    uploadBorder: isDarkMode ? 'border-gray-600' : 'border-blue-200',
    uploadHover: isDarkMode ? 'bg-gray-600' : 'bg-blue-100'
  };

  const checkFilesNeedMapping = async (files: File[]) => {
    const previews: FilePreview[] = [];
    
    for (const file of files) {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0]?.split(',').map(h => h.trim()) || [];
      
      // Check if we have a mapping for these headers
      const headerSig = headers.join(',').toLowerCase();
      const hasMapping = false; // In real app, check against saved mappings
      
      previews.push({
        file,
        headers,
        needsMapping: !hasMapping && headers.length > 0
      });
    }
    
    return previews;
  };

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus('uploading');
    setStatusMessage('Analyzing files...');
    setBatchInfo(null);

    // For now, skip mapping modal and go straight to upload
    await uploadFiles(acceptedFiles);
  }, []);

  const uploadFiles = async (files: File[]) => {
    setUploadStatus('uploading');
    setStatusMessage(`Uploading ${files.length} file(s)...`);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (!response.ok) {
        throw new Error(result.detail || 'Upload failed');
      }

      // Check if we have holdings data
      const holdings = result.performance?.holdings || [];
      
      // Transform holdings if they exist
      const transformedHoldings = Array.isArray(holdings) ? holdings.map((holding: any) => ({
        symbol: holding.symbol,
        name: holding.name || holding.symbol,
        shares: holding.quantity || 0,
        currentPrice: holding.current_price || holding.price || 0,
        marketValue: holding.market_value || 0,
        costBasis: holding.cost_basis || holding.market_value * 0.9,
        unrealizedGain: holding.market_value * 0.1,
        unrealizedGainPercent: 10,
        weight: holding.weight || 0
      })) : [];

      const data = {
        success: true,
        holdings: transformedHoldings,
        metadata: {
          custodianDetected: result.performance?.custodian || 'Universal Format',
          confidence: result.performance?.confidence || 95,
          rowsProcessed: result.rows || transformedHoldings.length,
          rowsSkipped: 0,
          filesProcessed: files.length
        },
        dataXRay: {
          mappedColumns: {
            symbol: 'Symbol',
            quantity: 'Quantity',
            price: 'Price',
            value: 'Market Value'
          }
        },
        analytics: result.performance?.analytics || {
          total_value: result.performance?.total_value || 0,
          holdings: transformedHoldings.length,
          top_concentration: 0,
          diversification_score: 0
        }
      };

      onDataParsed(data);
      
      const batchId = result.batch_id || result.performance?.batch_id;
      const saved = result.saved_to_database;
      
      if (batchId && saved) {
        setBatchInfo({ id: batchId, saved: true });
        setStatusMessage(`${files.length} file(s) processed and saved (Batch #${batchId})`);
      } else {
        setStatusMessage(`${files.length} file(s) processed successfully`);
      }
      
      setUploadStatus('success');

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Upload failed');
      setBatchInfo(null);
    }
  };

  const handleMappingSave = async (mapping: Record<string, number | null>) => {
    if (!currentMappingFile) return;

    // Save mapping to backend
    const formData = new FormData();
    formData.append('firm_id', '1');
    formData.append('headers', JSON.stringify(currentMappingFile.headers));
    formData.append('mapping', JSON.stringify(mapping));
    formData.append('custodian_hint', currentMappingFile.file.name);

    try {
      await fetch('http://localhost:8000/mappings/save', {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('Failed to save mapping:', error);
    }

    // Store mapping locally
    setMappings(prev => ({
      ...prev,
      [currentMappingFile.file.name]: mapping
    }));

    // Check for more files needing mapping
    const remaining = filesToProcess.filter(
      f => f.file !== currentMappingFile.file && f.needsMapping
    );

    if (remaining.length > 0) {
      setCurrentMappingFile(remaining[0]);
    } else {
      // All mappings done, upload files
      setCurrentMappingFile(null);
      await uploadFiles(filesToProcess.map(f => f.file));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles);
  }, [processFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  return (
    <>
      <div className={`rounded-xl shadow-lg p-8 border transition-all duration-300 ${theme.bg} ${theme.border}`}>
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-300 ${theme.uploadBg} ${theme.uploadBorder}
            hover:${theme.uploadHover} hover:${theme.hoverBorder}
            ${isDragActive ? 'scale-105 shadow-lg' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {uploadStatus === 'idle' && (
            <>
              <Upload className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <p className={`text-xl font-semibold mb-2 ${theme.text}`}>
                {isDragActive ? 'Drop your files here' : 'Click to upload CSV files'}
              </p>
              <p className={theme.textSecondary}>
                Upload positions, prices, and balances
              </p>
            </>
          )}

          {uploadStatus === 'uploading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
              <p className={`text-lg ${theme.text}`}>{statusMessage}</p>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className={`text-lg font-semibold text-green-600 dark:text-green-400`}>
                {statusMessage}
              </p>
              {batchInfo && batchInfo.saved && (
                <div className="mt-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span className={`text-sm ${theme.textSecondary}`}>
                    Data permanently saved • Batch ID: {batchInfo.id}
                  </span>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadStatus('idle');
                  setStatusMessage('');
                  setBatchInfo(null);
                  setFilesToProcess([]);
                  setMappings({});
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Upload More Files
              </button>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-lg font-semibold text-red-600">Upload Failed</p>
              <p className={`text-sm mt-2 ${theme.textSecondary}`}>{statusMessage}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadStatus('idle');
                  setStatusMessage('');
                  setBatchInfo(null);
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {currentMappingFile && (
        <MappingModal
          isOpen={true}
          onClose={() => {
            setCurrentMappingFile(null);
            setUploadStatus('idle');
          }}
          headers={currentMappingFile.headers}
          filename={currentMappingFile.file.name}
          onSave={handleMappingSave}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};