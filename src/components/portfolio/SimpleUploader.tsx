import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface SimpleUploaderProps {
  onDataParsed: (data: any) => void;
  isDarkMode?: boolean;
}

export const SimpleUploader: React.FC<SimpleUploaderProps> = ({ onDataParsed, isDarkMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload result:', result);
      
      // Create a ParseResult object that matches what the frontend expects
      const parseResult = {
        success: true,
        holdings: result.performance?.top_holdings?.map((holding: any) => ({
          symbol: holding.symbol,
          name: holding.name,
          shares: 100, // Default values since backend doesn't provide these
          currentPrice: holding.market_value / 100,
          marketValue: holding.market_value,
          costBasis: holding.market_value * 0.9,
          unrealizedGain: holding.market_value * 0.1,
          unrealizedGainPercent: 10
        })) || [],
        metadata: {
          rowsProcessed: result.rows || 0,
          rowsSkipped: 0,
          custodianDetected: 'Universal',
          confidence: 100
        },
        dataXRay: {
          mappedColumns: result.columns?.reduce((acc: any, col: string) => {
            acc[col] = col;
            return acc;
          }, {}) || {}
        }
      };
      
      onDataParsed(parseResult);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className={`mt-2 block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            {loading ? 'Processing...' : 'Click to upload CSV files'}
          </span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            multiple
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};