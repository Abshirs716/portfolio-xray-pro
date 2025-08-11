import React, { useState } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowUpDown, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog';
import { EditTransactionDialog } from '@/components/transactions/EditTransactionDialog';
import { RealtimeStatus } from '@/components/RealtimeStatus';

/**
 * Transactions Page Component
 * 
 * Complete transaction management interface with CRUD operations,
 * filtering, searching, and real-time data.
 */
const Transactions = () => {
  const { transactions, portfolio, isLoading, refetch } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter and sort transactions
  const filteredTransactions = transactions
    ?.filter(transaction => {
      const matchesSearch = 
        transaction.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    ?.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'symbol':
          comparison = (a.symbol || '').localeCompare(b.symbol || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    }) || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'dividend':
        return <DollarSign className="h-4 w-4 text-primary" />;
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'buy':
        return 'default';
      case 'sell':
        return 'destructive';
      case 'dividend':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  // Calculate summary stats
  const totalInvested = filteredTransactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSold = filteredTransactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDividends = filteredTransactions
    .filter(t => t.type === 'dividend')
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>/</span>
                <span>Transactions</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-financial-gradient bg-clip-text text-transparent">
              Transaction Management
            </h1>
            <p className="text-muted-foreground text-lg">
              View and manage your investment transactions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowAddDialog(true)} className="space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
            <RealtimeStatus />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalInvested)}
              </div>
              <p className="text-xs text-muted-foreground">
                From buy transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalSold)}
              </div>
              <p className="text-xs text-muted-foreground">
                From sell transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dividends</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalDividends)}
              </div>
              <p className="text-xs text-muted-foreground">
                From dividend payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} of {transactions?.length || 0} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low)</SelectItem>
                  <SelectItem value="symbol-asc">Symbol (A-Z)</SelectItem>
                  <SelectItem value="symbol-desc">Symbol (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {formatDate(transaction.transaction_date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadgeVariant(transaction.type)} className="space-x-1">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize">{transaction.type}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-semibold">
                          {transaction.symbol || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.quantity ? transaction.quantity.toLocaleString() : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.price ? formatCurrency(transaction.price) : '-'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {transaction.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTransaction(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        portfolioId={portfolio?.id}
        onSuccess={() => {
          refetch();
          setShowAddDialog(false);
        }}
      />

      <EditTransactionDialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        transaction={editingTransaction}
        onSuccess={() => {
          refetch();
          setEditingTransaction(null);
        }}
      />
    </div>
  );
};

export default Transactions;