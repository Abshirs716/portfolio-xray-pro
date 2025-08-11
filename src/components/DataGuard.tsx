/**
 * 🛡️ DATA GUARD COMPONENT - PREVENTS FAKE DATA FROM RENDERING
 * 
 * This component wraps any market data display and validates the data
 * before allowing it to render. If fake data is detected, shows an 
 * error state instead of rendering fake information.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, XCircle, Clock, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataGuardProps {
  data: any;
  children: React.ReactNode;
  symbol?: string;
  className?: string;
}

interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const DataGuard: React.FC<DataGuardProps> = ({ 
  data, 
  children, 
  symbol = 'UNKNOWN',
  className = '' 
}) => {
  const validation = validateDataSafety(data, symbol);

  if (!validation.isValid) {
    return (
      <Card className={`border-red-500 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="w-5 h-5" />
            Live Market Data Unavailable
            <Badge variant="destructive">BLOCKED</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <Wifi className="w-4 h-4" />
            <span>Cannot display {symbol} - all live data sources have failed</span>
          </div>
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-700">Data Quality Issues:</span>
            </div>
            <ul className="text-sm text-red-600 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>

          {validation.warnings.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-yellow-700">Warnings:</span>
              </div>
              <ul className="text-sm text-yellow-600 space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Why is this happening?</strong> All live market data sources 
              (Alpha Vantage, Financial Modeling Prep, AI providers) are currently 
              unavailable. We refuse to show hardcoded or fake data.
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600">Debug Info</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show warnings even when data is valid
  if (validation.warnings.length > 0) {
    console.warn(`⚠️ Data warnings for ${symbol}:`, validation.warnings);
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * Validate data safety and detect fake patterns
 */
function validateDataSafety(data: any, symbol: string): DataValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure checks
  if (!data) {
    errors.push('No data provided');
    return { isValid: false, errors, warnings };
  }

  if (typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors, warnings };
  }

  // Check for fake data indicators
  if (data.source === 'fallback' || data.source === 'hardcoded' || data.source === 'mock') {
    errors.push(`Fake data source detected: ${data.source}`);
  }

  if (data.source === 'approximation' || data.source === 'estimated') {
    errors.push(`Non-live data source: ${data.source}`);
  }

  // Check for missing live data attributes
  if (!data.source) {
    errors.push('Data source not specified');
  }

  if (!data.timestamp) {
    errors.push('Data timestamp missing');
  }

  // Check data freshness
  if (data.timestamp) {
    const dataTime = new Date(data.timestamp);
    const now = new Date();
    const ageMinutes = (now.getTime() - dataTime.getTime()) / (1000 * 60);
    
    if (ageMinutes > 15) {
      errors.push(`Data is stale (${ageMinutes.toFixed(1)} minutes old)`);
    } else if (ageMinutes > 5) {
      warnings.push(`Data is ${ageMinutes.toFixed(1)} minutes old`);
    }
  }

  // Symbol-specific validation
  if (symbol === 'NVDA') {
    // NVIDIA market cap validation
    if (data.marketCap && data.marketCap === 1000000000) {
      errors.push('NVIDIA $1B market cap is obviously fake');
    }
    
    if (data.marketCap && data.marketCap === 3000000000000) {
      warnings.push('NVIDIA exactly $3T market cap is suspicious (too round)');
    }
    
    if (data.price && (data.price < 800 || data.price > 2000)) {
      errors.push(`NVIDIA price $${data.price} is outside realistic range ($800-$2000)`);
    }
    
    if (data.marketCap && data.marketCap < 2000000000000) {
      errors.push(`NVIDIA market cap ${formatMarketCap(data.marketCap)} is unrealistically low`);
    }
  }

  // Check for obviously fake patterns
  if (data.price === 100 || data.price === 150 || data.price === 200) {
    warnings.push(`Round price $${data.price} may be a fallback value`);
  }

  // Check for test/placeholder patterns
  if (data.symbol && data.symbol.includes('TEST')) {
    errors.push('Test symbol detected');
  }

  if (JSON.stringify(data).toLowerCase().includes('placeholder')) {
    errors.push('Placeholder data detected');
  }

  // Market cap sanity checks
  if (data.marketCap) {
    if (data.marketCap % 1000000000000 === 0 && data.marketCap > 0) {
      warnings.push('Market cap is a round trillion - may be estimated');
    }
    
    if (data.marketCap < 1000000000) {
      errors.push(`Market cap ${formatMarketCap(data.marketCap)} is too small for major stock`);
    }
  }

  const isValid = errors.length === 0;
  
  return { isValid, errors, warnings };
}

/**
 * Format market cap for error messages
 */
function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1000000000000) {
    return `$${(marketCap / 1000000000000).toFixed(2)}T`;
  } else if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(1)}B`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
}