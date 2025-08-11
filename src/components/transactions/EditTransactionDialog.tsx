import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PortfolioService from '@/services/portfolioService';

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
  onSuccess: () => void;
}

export const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  // Populate form with transaction data
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'buy',
        symbol: transaction.symbol || '',
        quantity: transaction.quantity?.toString() || '',
        price: transaction.price?.toString() || '',
        amount: transaction.amount?.toString() || '',
        transaction_date: transaction.transaction_date ? new Date(transaction.transaction_date) : new Date(),
        notes: transaction.notes || '',
        currency: transaction.currency || 'USD'
      });
    }
  }, [transaction]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction?.id) {
      toast({
        title: "Error",
        description: "Transaction ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const transactionData = {
        type: formData.type,
        symbol: formData.symbol || undefined,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        amount: parseFloat(formData.amount),
        transaction_date: formData.transaction_date.toISOString(),
        notes: formData.notes || undefined,
        currency: formData.currency
      };

      await PortfolioService.updateTransaction(transaction.id, transactionData);

      toast({
        title: "Transaction updated!",
        description: `Transaction for ${formData.symbol || 'N/A'} has been updated successfully.`,
      });

      onSuccess();

    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error updating transaction",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details of this investment transaction.
          </DialogDescription>
        </DialogHeader>
        
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
              Update Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};