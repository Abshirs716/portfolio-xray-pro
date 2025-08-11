import { Portfolio, PortfolioValue, PortfolioMetrics } from '../entities/Portfolio';
import { Holding, HoldingValue } from '../entities/Holding';
import { Transaction, TransactionSummary } from '../entities/Transaction';

export interface IPortfolioService {
  // Portfolio Management
  getPortfolio(portfolioId: string): Promise<Portfolio | null>;
  getPrimaryPortfolio(userId: string): Promise<Portfolio | null>;
  getUserPortfolios(userId: string): Promise<Portfolio[]>;
  createPortfolio(portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Portfolio>;
  updatePortfolio(portfolioId: string, updates: Partial<Portfolio>): Promise<Portfolio>;
  deletePortfolio(portfolioId: string): Promise<void>;

  // Holdings Management
  getHoldings(portfolioId: string): Promise<Holding[]>;
  getHolding(portfolioId: string, symbol: string): Promise<Holding | null>;
  updateHolding(holding: Holding): Promise<Holding>;
  deleteHolding(holdingId: string): Promise<void>;

  // Transactions Management
  getTransactions(portfolioId: string): Promise<Transaction[]>;
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction>;
  deleteTransaction(transactionId: string): Promise<void>;
  getTransactionSummary(portfolioId: string): Promise<TransactionSummary>;

  // Portfolio History
  getPortfolioValueAt(portfolioId: string, date: Date): Promise<number>;
  getPortfolioHistory(portfolioId: string, days: number): Promise<Array<{date: Date, value: number}>>;
  storePortfolioSnapshot(portfolioId: string, value: number, date?: Date): Promise<void>;
}