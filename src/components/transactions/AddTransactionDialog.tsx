import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Loader2, Upload, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PortfolioService from '@/services/portfolioService';
import { CSVParsingService, ParsedTransaction } from '@/services/csvParsingService';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioId?: string;
  onSuccess: () => void;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onOpenChange,
  portfolioId,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'file'>('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
  const [formData, setFormData] = useState({
    type: 'buy',
    symbol: '',
    quantity: '',
    price: '',
    amount: '',
    transaction_date: new Date(),
    notes: '',
    currency: 'USD'
  });

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate amount when quantity or price changes
    if (field === 'quantity' || field === 'price') {
      const quantity = field === 'quantity' ? parseFloat(value as string) : parseFloat(formData.quantity);
      const price = field === 'price' ? parseFloat(value as string) : parseFloat(formData.price);
      
      if (!isNaN(quantity) && !isNaN(price)) {
        setFormData(prev => ({
          ...prev,
          amount: (quantity * price).toFixed(2)
        }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'buy',
      symbol: '',
      quantity: '',
      price: '',
      amount: '',
      transaction_date: new Date(),
      notes: '',
      currency: 'USD'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !portfolioId) {
      toast({
        title: "Error",
        description: "Missing user or portfolio information",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        user_id: user.id,
        portfolio_id: portfolioId,
        type: formData.type,
        symbol: formData.symbol || undefined,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        amount: parseFloat(formData.amount),
        transaction_date: formData.transaction_date.toISOString(),
        notes: formData.notes || undefined,
        currency: formData.currency,
        fees: 0
      };

      await PortfolioService.addTransaction(transactionData);

      toast({
        title: "Transaction added!",
        description: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} transaction for ${formData.symbol || 'N/A'} has been recorded.`,
      });

      resetForm();
      onSuccess();

    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error adding transaction",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔵 handleFileSelect called');
    const file = event.target.files?.[0];
    console.log('🔵 Selected file:', file);
    
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    console.log('🔵 File selected:', file.name, file.type, file.size);
    const fileName = file.name.toLowerCase();
    const supportedFormats = CSVParsingService.getSupportedFormats();
    const isSupported = supportedFormats.some(format => fileName.endsWith(format));

    if (!isSupported) {
      console.log('❌ Unsupported file format:', fileName);
      toast({
        title: "Invalid file type",
        description: `Please select a supported file: ${supportedFormats.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    
    try {
      console.log('🔵 Starting file parsing...');
      const parsed = await CSVParsingService.parseFile(file);
      console.log('✅ File parsed successfully, transactions:', parsed.length);
      setParsedTransactions(parsed);
      
      toast({
        title: "File parsed successfully",
        description: `Found ${parsed.length} transactions`,
      });
    } catch (error: any) {
      console.error('❌ Error parsing file:', error);
      toast({
        title: "Error parsing file",
        description: error.message || "Please check your file format",
        variant: "destructive",
      });
      setSelectedFile(null);
      setParsedTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    console.log('🔵 Starting file upload process...');
    console.log('🔵 selectedFile:', selectedFile?.name);
    console.log('🔵 user:', user?.id);
    console.log('🔵 portfolioId:', portfolioId);
    console.log('🔵 parsedTransactions:', parsedTransactions.length);
    
    if (!selectedFile || !user || !portfolioId) {
      console.log('❌ Missing required data for upload');
      toast({
        title: "Upload Error",
        description: "Missing file, user, or portfolio information",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔵 Uploading file to Supabase storage...');
      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('transaction-files')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('✅ File uploaded to storage successfully');
      console.log('🔵 Processing transactions in batch...');

      // Prepare all transaction data for batch insert
      const transactionDataArray = parsedTransactions.map(transaction => ({
        user_id: user.id,
        portfolio_id: portfolioId,
        type: transaction.type,
        symbol: transaction.symbol,
        quantity: transaction.quantity,
        price: transaction.price,
        amount: transaction.amount,
        transaction_date: transaction.transaction_date.toISOString(),
        notes: transaction.notes,
        currency: transaction.currency,
        fees: transaction.fees
      }));

      console.log(`🔵 Batch inserting ${transactionDataArray.length} transactions...`);
      
      // Add all transactions in a single batch operation
      await PortfolioService.addTransactionsBatch(transactionDataArray);

      console.log('✅ All transactions processed successfully');
      toast({
        title: "Transactions imported successfully!",
        description: `Added ${parsedTransactions.length} transactions to your portfolio.`,
      });

      setSelectedFile(null);
      setParsedTransactions([]);
      onSuccess();

    } catch (error: any) {
      console.error('❌ File upload/processing error:', error);
      toast({
        title: "Error importing transactions",
        description: error.message || "Something went wrong during import",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = CSVParsingService.generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadSampleExcel = () => {
    const excelData = CSVParsingService.generateSampleExcel();
    const blob = new Blob([excelData], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record transactions manually or upload a CSV or Excel file to import multiple transactions at once.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={uploadMethod} onValueChange={(value) => setUploadMethod(value as 'manual' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="file">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                      <SelectItem value="dividend">Dividend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Symbol */}
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.001"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Share</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>

              {/* Total Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>

              {/* Transaction Date */}
              <div className="space-y-2">
                <Label>Transaction Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.transaction_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.transaction_date ? (
                        format(formData.transaction_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.transaction_date}
                      onSelect={(date) => date && handleInputChange('transaction_date', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this transaction..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !formData.amount}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Transaction
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-4">
              {/* Hidden File Input */}
              <input
                id="csvFile"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {/* File Upload Area */}
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background" 
                onClick={() => {
                  console.log('🔵 Upload area clicked');
                  const fileInput = document.getElementById('csvFile') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                    console.log('🔵 File input triggered');
                  } else {
                    console.log('❌ File input not found');
                  }
                }}>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <div className="text-base font-medium">
                    Upload CSV or Excel File
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click here to select your file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>
              </div>
              
              {/* Test Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('🔵 Test button clicked');
                  const fileInput = document.getElementById('csvFile') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                    console.log('🔵 File input triggered from button');
                  } else {
                    console.log('❌ File input not found from button');
                  }
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                TEST: Choose File
              </Button>
            </div>

            {/* Sample File Downloads */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">CSV Template</p>
                    <p className="text-xs text-muted-foreground">Sample format</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadSampleCSV}>
                  <Download className="mr-1 h-3 w-3" />
                  CSV
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium">Excel Template</p>
                    <p className="text-xs text-muted-foreground">Sample format</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadSampleExcel}>
                  <Download className="mr-1 h-3 w-3" />
                  Excel
                </Button>
              </div>
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Selected File: {selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {parsedTransactions.length} transactions found
                  </p>
                </div>

                {parsedTransactions.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border rounded">
                    <table className="w-full text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Type</th>
                          <th className="p-2 text-left">Symbol</th>
                          <th className="p-2 text-left">Qty</th>
                          <th className="p-2 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedTransactions.slice(0, 5).map((tx, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{tx.type}</td>
                            <td className="p-2">{tx.symbol || '-'}</td>
                            <td className="p-2">{tx.quantity || '-'}</td>
                            <td className="p-2">${tx.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedTransactions.length > 5 && (
                      <p className="text-xs text-muted-foreground p-2 text-center">
                        ... and {parsedTransactions.length - 5} more transactions
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleFileUpload} 
                disabled={isLoading || !selectedFile || parsedTransactions.length === 0}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Import {parsedTransactions.length} Transactions
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};