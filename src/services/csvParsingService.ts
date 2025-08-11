import { TransactionType } from '@/core/entities/Transaction';
import * as XLSX from 'xlsx';

export interface ParsedTransaction {
  type: TransactionType;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  transaction_date: Date;
  notes?: string;
  currency: string;
  fees: number;
}

export class CSVParsingService {
  static async parseFile(file: File): Promise<ParsedTransaction[]> {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      const content = await file.text();
      return this.parseCSV(content);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return this.parseExcel(file);
    } else {
      throw new Error('Unsupported file format. Please use CSV or Excel files.');
    }
  }
  
  static async parseExcel(file: File): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Use the first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must contain at least a header row and one data row');
          }
          
          // Convert to CSV-like format for parsing
          const csvContent = jsonData.map((row: any[]) => 
            row.map(cell => String(cell || '')).join(',')
          ).join('\n');
          
          const transactions = this.parseCSV(csvContent);
          resolve(transactions);
        } catch (error) {
          reject(new Error(`Error parsing Excel file: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading Excel file'));
      reader.readAsArrayBuffer(file);
    });
  }
  
  static parseCSV(csvContent: string): ParsedTransaction[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const transactions: ParsedTransaction[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) continue;
      
      const transaction = this.parseTransactionRow(headers, values);
      if (transaction) {
        transactions.push(transaction);
      }
    }
    
    return transactions;
  }
  
  private static parseTransactionRow(headers: string[], values: string[]): ParsedTransaction | null {
    try {
      const getColumnValue = (possibleNames: string[]): string | undefined => {
        for (const name of possibleNames) {
          const index = headers.findIndex(h => h.includes(name));
          if (index !== -1 && values[index]) {
            return values[index];
          }
        }
        return undefined;
      };
      
      // Map common column names
      const typeValue = getColumnValue(['type', 'action', 'transaction_type']);
      const symbolValue = getColumnValue(['symbol', 'ticker', 'stock', 'security']);
      const quantityValue = getColumnValue(['quantity', 'shares', 'amount_shares', 'qty']);
      const priceValue = getColumnValue(['price', 'unit_price', 'share_price', 'price_per_share']);
      const amountValue = getColumnValue(['amount', 'total', 'total_amount', 'value']);
      const dateValue = getColumnValue(['date', 'transaction_date', 'trade_date']);
      const notesValue = getColumnValue(['notes', 'description', 'memo']);
      const currencyValue = getColumnValue(['currency', 'curr']) || 'USD';
      const feesValue = getColumnValue(['fees', 'commission', 'fee']) || '0';
      
      // Parse and validate required fields
      const type = this.parseTransactionType(typeValue);
      if (!type) return null;
      
      const date = this.parseDate(dateValue);
      if (!date) return null;
      
      const amount = parseFloat(amountValue || '0');
      if (isNaN(amount) || amount === 0) return null;
      
      return {
        type,
        symbol: symbolValue?.toUpperCase(),
        quantity: quantityValue ? parseFloat(quantityValue) : undefined,
        price: priceValue ? parseFloat(priceValue) : undefined,
        amount,
        transaction_date: date,
        notes: notesValue,
        currency: currencyValue,
        fees: parseFloat(feesValue) || 0
      };
    } catch (error) {
      console.error('Error parsing transaction row:', error);
      return null;
    }
  }
  
  private static parseTransactionType(value?: string): TransactionType | null {
    if (!value) return null;
    
    const normalized = value.toLowerCase().trim();
    
    if (normalized.includes('buy') || normalized.includes('purchase')) return TransactionType.BUY;
    if (normalized.includes('sell') || normalized.includes('sale')) return TransactionType.SELL;
    if (normalized.includes('dividend') || normalized.includes('div')) return TransactionType.DIVIDEND;
    if (normalized.includes('deposit') || normalized.includes('cash in')) return TransactionType.DEPOSIT;
    if (normalized.includes('withdrawal') || normalized.includes('cash out')) return TransactionType.WITHDRAWAL;
    if (normalized.includes('fee') || normalized.includes('commission')) return TransactionType.FEE;
    if (normalized.includes('split')) return TransactionType.SPLIT;
    
    return null;
  }
  
  private static parseDate(value?: string): Date | null {
    if (!value) return null;
    
    const stringValue = String(value).trim();
    if (!stringValue) return null;
    
    // Check if it's an Excel serial date number (5-digit number)
    if (/^\d{5}$/.test(stringValue)) {
      // Excel serial date conversion (Excel epoch starts Jan 1, 1900)
      const excelDate = parseInt(stringValue);
      if (excelDate > 25567) { // Unix epoch start in Excel serial days
        const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
        if (jsDate.getFullYear() > 1900 && jsDate.getFullYear() < 2100) {
          return jsDate;
        }
      }
    }
    
    // Try MM/DD/YYYY format
    const dateMatch = stringValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
      const [, month, day, year] = dateMatch;
      const parsedYear = parseInt(year);
      if (parsedYear >= 1900 && parsedYear <= 2100) {
        return new Date(parsedYear, parseInt(month) - 1, parseInt(day));
      }
    }
    
    // Try YYYY-MM-DD format
    const isoMatch = stringValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const parsedYear = parseInt(year);
      if (parsedYear >= 1900 && parsedYear <= 2100) {
        return new Date(parsedYear, parseInt(month) - 1, parseInt(day));
      }
    }
    
    // Try standard Date parsing as last resort with validation
    try {
      const date = new Date(stringValue);
      if (!isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100) {
        return date;
      }
    } catch (error) {
      console.warn('Date parsing failed for value:', stringValue);
    }
    
    return null;
  }
  
  
  static generateSampleCSV(): string {
    return `Type,Symbol,Quantity,Price,Amount,Date,Notes
buy,AAPL,10,150.50,1505.00,2024-01-15,Apple stock purchase
sell,MSFT,5,300.00,1500.00,2024-01-20,Microsoft partial sale
dividend,GOOGL,,,,50.00,2024-01-25,Quarterly dividend
deposit,,,,,2000.00,2024-01-01,Initial deposit`;
  }
  
  static generateSampleExcel(): Uint8Array {
    const data = [
      ['Type', 'Symbol', 'Quantity', 'Price', 'Amount', 'Date', 'Notes'],
      ['buy', 'AAPL', 10, 150.50, 1505.00, '2024-01-15', 'Apple stock purchase'],
      ['sell', 'MSFT', 5, 300.00, 1500.00, '2024-01-20', 'Microsoft partial sale'],
      ['dividend', 'GOOGL', '', '', 50.00, '2024-01-25', 'Quarterly dividend'],
      ['deposit', '', '', '', 2000.00, '2024-01-01', 'Initial deposit']
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    
    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  }

  static getSupportedFormats(): string[] {
    return ['.csv', '.xlsx', '.xls'];
  }
}

// Forward compatibility alias
export const FileParsingService = CSVParsingService;