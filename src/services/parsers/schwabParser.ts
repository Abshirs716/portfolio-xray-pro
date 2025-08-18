// src/services/parsers/schwabParser.ts - Charles Schwab CSV Parser

import { ParsedHolding } from '../../types/portfolio';

export class SchwabParser {
  parse(csvContent: string): ParsedHolding[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const holdings: ParsedHolding[] = [];
    
    // Find the header row (usually starts with "Symbol")
    let headerIndex = -1;
    let headers: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Symbol') && line.includes('Description')) {
        headerIndex = i;
        headers = this.parseCSVLine(line);
        break;
      }
    }
    
    if (headerIndex === -1) {
      throw new Error('Could not find Schwab CSV headers');
    }
    
    // Map header names to indices
    const columnMap: Record<string, number> = {};
    headers.forEach((header, index) => {
      columnMap[header.trim()] = index;
    });
    
    // Parse data rows
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('Total') || line.startsWith('Cash')) continue;
      
      const values = this.parseCSVLine(line);
      if (values.length < headers.length) continue;
      
      try {
        const holding: ParsedHolding = {
          symbol: this.getValue(values, columnMap['Symbol'], ''),
          description: this.getValue(values, columnMap['Description'], ''),
          shares: this.parseNumber(this.getValue(values, columnMap['Quantity'], '0')),
          price: this.parseNumber(this.getValue(values, columnMap['Price'], '0')),
          marketValue: this.parseNumber(this.getValue(values, columnMap['Position Value'], '0')),
          costBasis: columnMap['Cost Basis'] !== undefined 
            ? this.parseNumber(this.getValue(values, columnMap['Cost Basis'], '0'))
            : undefined
        };
        
        // Skip cash positions and empty symbols
        if (holding.symbol && holding.symbol !== 'Cash' && holding.shares > 0) {
          holdings.push(holding);
        }
      } catch (error) {
        console.warn(`Failed to parse row ${i}:`, error);
      }
    }
    
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

export const schwabParser = new SchwabParser();