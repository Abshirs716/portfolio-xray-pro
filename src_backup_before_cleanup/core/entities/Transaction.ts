export interface Transaction {
  id: string;
  portfolioId: string;
  userId: string;
  type: TransactionType;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount: number;
  fees: number;
  transactionDate: Date;
  notes?: string;
  currency: string;
  createdAt: Date;
}

export enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DIVIDEND = 'dividend',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  FEE = 'fee',
  SPLIT = 'split'
}

export interface TransactionSummary {
  totalBuys: number;
  totalSells: number;
  totalDividends: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalFees: number;
  netCashFlow: number;
  realizedGainLoss: number;
}