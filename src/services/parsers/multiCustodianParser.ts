// src/services/parsers/multiCustodianParser.ts - Universal Custodian Parser

import { CustodianDetection, ParsedHolding } from '../../types/portfolio';

interface CustodianPattern {
  name: string;
  format: string;
  requiredHeaders: string[];
  optionalHeaders: string[];
  columnMappings: Record<string, string[]>;
}

class MultiCustodianParser {
  private custodianPatterns: CustodianPattern[] = [
    {
      name: 'Charles Schwab',
      format: 'Standard Schwab Export',
      requiredHeaders: ['Symbol', 'Description', 'Quantity'],
      optionalHeaders: ['Price', 'Position Value', 'Cost Basis'],
      columnMappings: {
        symbol: ['Symbol', 'Ticker'],
        description: ['Description', 'Security Description', 'Name'],
        shares: ['Quantity', 'Shares', 'Units'],
        price: ['Price', 'Last Price', 'Current Price'],
        marketValue: ['Position Value', 'Market Value', 'Value'],
        costBasis: ['Cost Basis', 'Total Cost']
      }
    },
    {
      name: 'Fidelity',
      format: 'Fidelity NetBenefits',
      requiredHeaders: ['Symbol', 'Security Name', 'Shares'],
      optionalHeaders: ['Current Value', 'Cost Basis Total'],
      columnMappings: {
        symbol: ['Symbol', 'Ticker'],
        description: ['Security Name', 'Description'],
        shares: ['Shares', 'Quantity'],
        price: ['Last Price', 'Current Price'],
        marketValue: ['Current Value', 'Market Value'],
        costBasis: ['Cost Basis Total', 'Total Cost Basis']
      }
    },
    {
      name: 'TD Ameritrade',
      format: 'TD Ameritrade Export',
      requiredHeaders: ['SYMBOL', 'DESCRIPTION', 'QTY'],
      optionalHeaders: ['LAST PRICE', 'MKT VALUE'],
      columnMappings: {
        symbol: ['SYMBOL', 'Symbol'],
        description: ['DESCRIPTION', 'Description'],
        shares: ['QTY', 'QUANTITY', 'Quantity'],
        price: ['LAST PRICE', 'Last Price'],
        marketValue: ['MKT VALUE', 'Market Value'],
        costBasis: ['COST', 'Cost Basis']
      }
    },
    {
      name: 'Interactive Brokers',
      format: 'IB Portfolio Export',
      requiredHeaders: ['Symbol', 'Position', 'Market Price'],
      optionalHeaders: ['Market Value', 'Average Cost'],
      columnMappings: {
        symbol: ['Symbol', 'Ticker'],
        description: ['Description', 'Security Name'],
        shares: ['Position', 'Quantity', 'Shares'],
        price: ['Market Price', 'Last Price'],
        marketValue: ['Market Value', 'Value'],
        costBasis: ['Cost Basis', 'Average Cost']
      }
    },
    {
      name: 'E*Trade',
      format: 'E*Trade Portfolio',
      requiredHeaders: ['Symbol', 'Qty', 'Price'],
      optionalHeaders: ['Market Value', 'Total Cost'],
      columnMappings: {
        symbol: ['Symbol', 'Ticker'],
        description: ['Product', 'Description'],
        shares: ['Qty', 'Quantity'],
        price: ['Price', 'Last Price'],
        marketValue: ['Market Value', 'Current Value'],
        costBasis: ['Total Cost', 'Cost Basis']
      }
    }
  ];

  async detectCustodian(csvContent: string): Promise<CustodianDetection> {
    console.log('🔍 Starting custodian detection...');
    
    const headers = this.extractHeaders(csvContent);
    console.log('📋 Detected headers:', headers);

    let bestMatch: CustodianDetection = {
      custodian: 'Custom Format',
      confidence: 0,
      format: 'Unknown Format',
      columnMappings: {} // Always provide columnMappings
    };

    // Check each custodian pattern
    for (const pattern of this.custodianPatterns) {
      const confidence = this.calculateConfidence(headers, pattern);
      console.log(`🎯 ${pattern.name}: ${confidence}% match`);
      
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          custodian: pattern.name,
          confidence,
          format: pattern.format,
          columnMappings: this.createMappings(headers, pattern)
        };
      }
    }

    // If no good match, try generic detection
    if (bestMatch.confidence < 50) {
      bestMatch = this.genericDetection(headers);
    }

    console.log(`✅ Best match: ${bestMatch.custodian} (${bestMatch.confidence}% confidence)`);
    return bestMatch;
  }

  private extractHeaders(csvContent: string): string[] {
    const lines = csvContent.split('\n');
    
    // Skip comment lines
    let headerLine = '';
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && !line.startsWith('//')) {
        headerLine = line;
        break;
      }
    }

    // Parse CSV headers (handle quoted fields)
    const headers: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < headerLine.length; i++) {
      const char = headerLine[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        headers.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) {
      headers.push(current.trim());
    }

    return headers.map(h => h.replace(/^"|"$/g, '').trim());
  }

  private calculateConfidence(headers: string[], pattern: CustodianPattern): number {
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
    let matchScore = 0;
    let totalWeight = 0;

    // Check required headers (weight: 60%)
    for (const required of pattern.requiredHeaders) {
      totalWeight += 60 / pattern.requiredHeaders.length;
      if (normalizedHeaders.some(h => h === required.toLowerCase())) {
        matchScore += 60 / pattern.requiredHeaders.length;
      }
    }

    // Check optional headers (weight: 40%)
    for (const optional of pattern.optionalHeaders) {
      totalWeight += 40 / pattern.optionalHeaders.length;
      if (normalizedHeaders.some(h => h === optional.toLowerCase())) {
        matchScore += 40 / pattern.optionalHeaders.length;
      }
    }

    return Math.round((matchScore / totalWeight) * 100);
  }

  private createMappings(headers: string[], pattern: CustodianPattern): Record<string, string> {
    const mappings: Record<string, string> = {};
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    for (const [field, possibleColumns] of Object.entries(pattern.columnMappings)) {
      for (const column of possibleColumns) {
        const index = normalizedHeaders.findIndex(h => h === column.toLowerCase());
        if (index !== -1) {
          mappings[field] = headers[index];
          break;
        }
      }
    }

    return mappings;
  }

  private genericDetection(headers: string[]): CustodianDetection {
    const mappings: Record<string, string> = {};
    const normalizedHeaders = headers.map(h => h.toLowerCase());

    // Generic patterns for common fields
    const patterns = {
      symbol: ['symbol', 'ticker', 'stock', 'security'],
      description: ['description', 'name', 'security name', 'company'],
      shares: ['quantity', 'shares', 'qty', 'units', 'position'],
      price: ['price', 'last price', 'current price', 'market price'],
      marketValue: ['market value', 'value', 'current value', 'position value'],
      costBasis: ['cost basis', 'cost', 'total cost', 'book value']
    };

    let confidence = 0;
    for (const [field, keywords] of Object.entries(patterns)) {
      for (let i = 0; i < headers.length; i++) {
        const header = normalizedHeaders[i];
        if (keywords.some(kw => header.includes(kw))) {
          mappings[field] = headers[i];
          confidence += 15;
          break;
        }
      }
    }

    return {
      custodian: 'Custom Format',
      confidence: Math.min(confidence, 65),
      format: 'Generic CSV Format',
      columnMappings: mappings // Always return mappings
    };
  }

  async parseCustodianData(csvContent: string, detection: CustodianDetection): Promise<ParsedHolding[]> {
    console.log(`📊 Parsing ${detection.custodian} format...`);
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = this.extractHeaders(csvContent);
    const headerIndex = lines.findIndex(line => {
      const lineHeaders = this.extractHeaders(line);
      return lineHeaders.length > 0 && lineHeaders[0] === headers[0];
    });

    if (headerIndex === -1) {
      throw new Error('Could not find header row');
    }

    const dataLines = lines.slice(headerIndex + 1);
    const holdings: ParsedHolding[] = [];
    const mappings = detection.columnMappings || {}; // Ensure mappings is never undefined

    // Find column indices
    const columnIndices: Record<string, number> = {};
    for (const [field, columnName] of Object.entries(mappings)) {
      const index = headers.findIndex(h => h === columnName);
      if (index !== -1) {
        columnIndices[field] = index;
      }
    }

    // Parse each data row
    for (const line of dataLines) {
      if (!line.trim() || line.startsWith('#')) continue;

      const values = this.parseCSVLine(line);
      if (values.length < headers.length) continue;

      try {
        const holding: ParsedHolding = {
          symbol: this.getValue(values, columnIndices.symbol, ''),
          description: this.getValue(values, columnIndices.description, ''),
          shares: this.parseNumber(this.getValue(values, columnIndices.shares, '0')),
          price: this.parseNumber(this.getValue(values, columnIndices.price, '0')),
          marketValue: this.parseNumber(this.getValue(values, columnIndices.marketValue, '0')),
          costBasis: columnIndices.costBasis !== undefined 
            ? this.parseNumber(this.getValue(values, columnIndices.costBasis, '0'))
            : undefined
        };

        // Skip if essential data is missing
        if (holding.symbol && holding.shares > 0) {
          // Calculate market value if not provided
          if (!holding.marketValue && holding.price) {
            holding.marketValue = holding.shares * holding.price;
          }
          holdings.push(holding);
        }
      } catch (error) {
        console.warn('Failed to parse row:', line, error);
      }
    }

    console.log(`✅ Successfully parsed ${holdings.length} holdings`);
    return holdings;
  }

  private parseCSVLine(line: string): string[] {
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
  }

  private getValue(values: string[], index: number | undefined, defaultValue: string): string {
    if (index === undefined || index < 0 || index >= values.length) {
      return defaultValue;
    }
    return values[index] || defaultValue;
  }

  private parseNumber(value: string): number {
    // Remove currency symbols, commas, and parentheses
    const cleaned = value
      .replace(/[$,]/g, '')
      .replace(/[()]/g, '')
      .trim();
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
}

export const multiCustodianParser = new MultiCustodianParser();