// src/services/parsers/multiCustodianParser.ts
import { ParseResult, Holding, CustodianDetection } from '../../types/portfolio';

interface CustodianPattern {
  name: string;
  confidence: number;
  format: string;
  headers: string[];
  requiredFields: string[];
  columnMappings: Record<string, string>;
}

interface DetectionResult {
  custodian: string;
  confidence: number;
  format: string;
  columnMappings: Record<string, string>;
}

export class MultiCustodianParser {
  private custodianPatterns: CustodianPattern[] = [
    {
      name: "Charles Schwab",
      confidence: 95,
      format: "schwab_standard",
      headers: ["Symbol", "Description", "Quantity", "Price", "Position Value"],
      requiredFields: ["Symbol", "Quantity", "Price"],
      columnMappings: {
        symbol: "Symbol",
        name: "Description", 
        shares: "Quantity",
        currentPrice: "Price",
        marketValue: "Position Value"
      }
    },
    {
      name: "Fidelity",
      confidence: 90,
      format: "fidelity_standard",
      headers: ["Symbol", "Description", "Quantity", "Last Price", "Current Value"],
      requiredFields: ["Symbol", "Quantity", "Last Price"],
      columnMappings: {
        symbol: "Symbol",
        name: "Description",
        shares: "Quantity", 
        currentPrice: "Last Price",
        marketValue: "Current Value"
      }
    },
    {
      name: "TD Ameritrade",
      confidence: 85,
      format: "td_standard",
      headers: ["Symbol", "Quantity", "Average Price", "Market Value"],
      requiredFields: ["Symbol", "Quantity"],
      columnMappings: {
        symbol: "Symbol",
        shares: "Quantity",
        averageCost: "Average Price",
        marketValue: "Market Value"
      }
    },
    {
      name: "Interactive Brokers",
      confidence: 80,
      format: "ib_standard", 
      headers: ["Symbol", "Quantity", "Mult", "Price", "Market Value"],
      requiredFields: ["Symbol", "Quantity", "Price"],
      columnMappings: {
        symbol: "Symbol",
        shares: "Quantity",
        currentPrice: "Price",
        marketValue: "Market Value"
      }
    },
    {
      name: "E*TRADE",
      confidence: 80,
      format: "etrade_standard",
      headers: ["Symbol", "Qty", "Price Paid", "Last Price", "Value"],
      requiredFields: ["Symbol", "Qty"],
      columnMappings: {
        symbol: "Symbol",
        shares: "Qty",
        averageCost: "Price Paid",
        currentPrice: "Last Price", 
        marketValue: "Value"
      }
    }
  ];

  detectCustodian(headers: string[], csvContent: string): DetectionResult {
    let bestMatch: DetectionResult = {
      custodian: "Unknown",
      confidence: 0,
      format: "custom",
      columnMappings: {}
    };

    const headerStr = headers.join(' ').toLowerCase();
    const contentLower = csvContent.toLowerCase();

    for (const pattern of this.custodianPatterns) {
      let score = 0;
      let maxScore = pattern.requiredFields.length;

      // Check for custodian name in content
      if (contentLower.includes(pattern.name.toLowerCase())) {
        score += 2;
        maxScore += 2;
      }

      // Check for required field matches
      for (const field of pattern.requiredFields) {
        if (headers.some(h => h.toLowerCase().includes(field.toLowerCase()))) {
          score += 1;
        }
      }

      const confidence = (score / maxScore) * 100;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          custodian: pattern.name,
          confidence: Math.min(confidence, pattern.confidence),
          format: pattern.format,
          columnMappings: pattern.columnMappings
        };
      }
    }

    return bestMatch;
  }

  parseCSV(csvContent: string): ParseResult {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        return {
          success: false,
          holdings: [],
          metadata: {
            custodianDetected: "Unknown",
            confidence: 0,
            rowsProcessed: 0,
            rowsSkipped: 0,
            errors: ["File appears to be empty or invalid"],
            warnings: []
          },
          dataXRay: {
            originalColumns: [],
            mappedColumns: {},
            unmappedColumns: [],
            sampleData: []
          }
        };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const detection = this.detectCustodian(headers, csvContent);
      
      const holdings: Holding[] = [];
      const errors: string[] = [];
      let rowsProcessed = 0;
      let rowsSkipped = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        
        if (values.length < 3 || !values[0]) {
          rowsSkipped++;
          continue;
        }

        try {
          const holding: Holding = {
            symbol: values[0] || '',
            name: values[1] || '',
            shares: this.parseNumber(values[2]) || 0,
            averageCost: this.parseNumber(values[3]) || 0,
            currentPrice: this.parseNumber(values[4]) || 0,
            marketValue: this.parseNumber(values[5]) || 0,
            costBasis: 0,
            unrealizedGain: 0,
            unrealizedGainPercent: 0
          };

          // Calculate derived values
          if (holding.shares && holding.averageCost) {
            holding.costBasis = holding.shares * holding.averageCost;
          }
          
          if (holding.marketValue && holding.costBasis) {
            holding.unrealizedGain = holding.marketValue - holding.costBasis;
            holding.unrealizedGainPercent = (holding.unrealizedGain / holding.costBasis) * 100;
          }

          holdings.push(holding);
          rowsProcessed++;
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error}`);
          rowsSkipped++;
        }
      }

      return {
        success: true,
        holdings,
        metadata: {
          custodianDetected: detection.custodian,
          confidence: detection.confidence,
          rowsProcessed,
          rowsSkipped,
          errors,
          warnings: []
        },
        dataXRay: {
          originalColumns: headers,
          mappedColumns: detection.columnMappings,
          unmappedColumns: headers.filter(h => !Object.values(detection.columnMappings).includes(h)),
          sampleData: holdings.slice(0, 3)
        }
      };

    } catch (error) {
      return {
        success: false,
        holdings: [],
        metadata: {
          custodianDetected: "Unknown",
          confidence: 0,
          rowsProcessed: 0,
          rowsSkipped: 0,
          errors: [`Parse error: ${error}`],
          warnings: []
        },
        dataXRay: {
          originalColumns: [],
          mappedColumns: {},
          unmappedColumns: [],
          sampleData: []
        }
      };
    }
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private parseNumber(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(/[$,()]/g, '').trim();
    const isNegative = value.includes('(') || value.startsWith('-');
    const num = parseFloat(cleaned);
    return isNegative && num > 0 ? -num : num || 0;
  }
}

export const multiCustodianParser = new MultiCustodianParser();