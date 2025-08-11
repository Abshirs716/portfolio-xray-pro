/**
 * Data Validation Utilities
 * PREVENTS FAKE DATA FROM BEING DISPLAYED
 */

import React from 'react';

interface StockValidationRules {
  minPrice: number;
  maxPrice: number;
  minMarketCap: number;
  maxMarketCap: number;
  symbol: string;
  name: string;
}

// REALISTIC VALIDATION RULES FOR MAJOR STOCKS
const STOCK_VALIDATION_RULES: Record<string, StockValidationRules> = {
  'NVDA': {
    minPrice: 800,         // NVIDIA must be > $800
    maxPrice: 2000,        // NVIDIA max reasonable ~$2,000
    minMarketCap: 2000000000000,  // $2T minimum market cap
    maxMarketCap: 5000000000000,  // $5T maximum market cap
    symbol: 'NVDA',
    name: 'NVIDIA Corporation'
  },
  'AAPL': {
    minPrice: 150,
    maxPrice: 300,
    minMarketCap: 2500000000000,  // $2.5T minimum
    maxMarketCap: 4000000000000,  // $4T maximum
    symbol: 'AAPL',
    name: 'Apple Inc.'
  },
  'MSFT': {
    minPrice: 300,
    maxPrice: 600,
    minMarketCap: 2000000000000,  // $2T minimum
    maxMarketCap: 4000000000000,  // $4T maximum
    symbol: 'MSFT',
    name: 'Microsoft Corporation'
  },
  'GOOGL': {
    minPrice: 120,
    maxPrice: 200,
    minMarketCap: 1500000000000,  // $1.5T minimum
    maxMarketCap: 3000000000000,  // $3T maximum
    symbol: 'GOOGL',
    name: 'Alphabet Inc.'
  },
  'AMZN': {
    minPrice: 120,
    maxPrice: 250,
    minMarketCap: 1200000000000,  // $1.2T minimum
    maxMarketCap: 2500000000000,  // $2.5T maximum
    symbol: 'AMZN',
    name: 'Amazon.com Inc.'
  }
};

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  correctedData?: any;
}

/**
 * Validates stock price data to prevent showing obviously fake values
 */
export const validateStockPrice = (symbol: string, price: number): ValidationResult => {
  const rules = STOCK_VALIDATION_RULES[symbol.toUpperCase()];
  
  if (!rules) {
    return { isValid: true, errors: [] }; // No validation rules for this symbol
  }

  const errors: string[] = [];

  // Price validation
  if (price < rules.minPrice) {
    errors.push(
      `🚨 FAKE DATA DETECTED: ${symbol} price $${price.toFixed(2)} is impossibly low! ` +
      `${rules.name} trades above $${rules.minPrice}, not $${price.toFixed(2)}!`
    );
  }

  if (price > rules.maxPrice) {
    errors.push(
      `🚨 SUSPICIOUS DATA: ${symbol} price $${price.toFixed(2)} seems too high! ` +
      `Maximum reasonable price is ~$${rules.maxPrice}.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates market cap data to prevent showing obviously fake values
 */
export const validateMarketCap = (symbol: string, marketCap: number): ValidationResult => {
  const rules = STOCK_VALIDATION_RULES[symbol.toUpperCase()];
  
  if (!rules) {
    return { isValid: true, errors: [] };
  }

  const errors: string[] = [];

  if (marketCap < rules.minMarketCap) {
    const minCapTrillions = (rules.minMarketCap / 1000000000000).toFixed(1);
    const actualCapBillions = (marketCap / 1000000000).toFixed(1);
    errors.push(
      `🚨 FAKE DATA DETECTED: ${symbol} market cap $${actualCapBillions}B is impossibly low! ` +
      `${rules.name} has a market cap above $${minCapTrillions} TRILLION!`
    );
  }

  if (marketCap > rules.maxMarketCap) {
    const maxCapTrillions = (rules.maxMarketCap / 1000000000000).toFixed(1);
    const actualCapTrillions = (marketCap / 1000000000000).toFixed(1);
    errors.push(
      `🚨 SUSPICIOUS DATA: ${symbol} market cap $${actualCapTrillions}T seems too high! ` +
      `Maximum reasonable market cap is ~$${maxCapTrillions}T.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates complete stock data including price and market cap
 */
export const validateStockData = (symbol: string, data: { price?: number; marketCap?: number }): ValidationResult => {
  const allErrors: string[] = [];

  if (data.price !== undefined) {
    const priceValidation = validateStockPrice(symbol, data.price);
    allErrors.push(...priceValidation.errors);
  }

  if (data.marketCap !== undefined) {
    const marketCapValidation = validateMarketCap(symbol, data.marketCap);
    allErrors.push(...marketCapValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Component wrapper to display validation errors
 */
export const DataValidationError = ({ symbol, errors }: { symbol: string; errors: string[] }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 my-4">
      <h4 className="font-semibold text-destructive mb-2">⚠️ Data Validation Error for {symbol}</h4>
      <ul className="text-sm text-destructive space-y-1">
        {errors.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-2">
        This data has been flagged as potentially inaccurate. Please check the data source.
      </p>
    </div>
  );
};

/**
 * Test function to verify validation is working
 */
export const testDataValidation = () => {
  console.log("=== TESTING DATA VALIDATION ===");
  
  // Test NVIDIA fake data detection
  const nvidiaTest = validateStockData('NVDA', { 
    price: 155.28,           // FAKE - should trigger error
    marketCap: 1000000000    // FAKE $1B - should trigger error
  });
  
  console.log("NVDA Validation Result:", nvidiaTest);
  
  if (nvidiaTest.errors.length > 0) {
    console.log("✅ VALIDATION WORKING: Caught fake NVIDIA data!");
    nvidiaTest.errors.forEach(error => console.error(error));
  } else {
    console.error("❌ VALIDATION FAILED: Did not catch fake NVIDIA data!");
  }
  
  // Test realistic data passes
  const realisticTest = validateStockData('NVDA', {
    price: 1150,                    // REALISTIC
    marketCap: 3500000000000       // REALISTIC $3.5T
  });
  
  console.log("NVDA Realistic Data:", realisticTest);
  
  return {
    fakeDataCaught: nvidiaTest.errors.length > 0,
    realisticDataPassed: realisticTest.errors.length === 0
  };
};