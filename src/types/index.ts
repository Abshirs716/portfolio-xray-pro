// ============= Core Type Definitions =============

// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription_tier: 'free' | 'professional' | 'enterprise';
  created_at: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Portfolio & Financial Data Types
export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  total_value: number;
  currency: string;
  created_at: string;
  updated_at: string;
  performance: PortfolioPerformance;
}

export interface PortfolioPerformance {
  daily_return: number;
  weekly_return: number;
  monthly_return: number;
  yearly_return: number;
  total_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto' | 'commodity';
  quantity: number;
  purchase_price: number;
  current_price: number;
  market_value: number;
  weight: number; // Portfolio weight percentage
  sector?: string;
  country?: string;
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  pe_ratio?: number;
  timestamp: string;
}

export interface ChartData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// AI Analysis Types
export interface AIAnalysis {
  id: string;
  user_id: string;
  type: 'portfolio' | 'market' | 'document' | 'risk';
  prompt: string;
  response: string;
  confidence_score: number;
  insights: AIInsight[];
  recommendations: AIRecommendation[];
  created_at: string;
}

export interface AIInsight {
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
}

export interface AIRecommendation {
  action: 'buy' | 'sell' | 'hold' | 'rebalance';
  symbol?: string;
  reason: string;
  expected_return?: number;
  risk_level: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
}

// Chat & Conversation Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  analysis_id?: string; // Link to related analysis
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// Document Analysis Types
export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: 'financial_report' | 'earnings' | 'analysis' | 'research' | 'other';
  size: number;
  url: string;
  upload_date: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis?: DocumentAnalysis;
}

export interface DocumentAnalysis {
  summary: string;
  key_metrics: KeyMetric[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  extracted_data: Record<string, any>;
  insights: AIInsight[];
}

export interface KeyMetric {
  name: string;
  value: number | string;
  unit?: string;
  category: string;
}

// Risk Analysis Types
export interface RiskAnalysis {
  portfolio_id: string;
  overall_score: number; // 1-10 scale
  volatility_risk: number;
  concentration_risk: number;
  sector_risk: number;
  geographic_risk: number;
  recommendations: string[];
  calculated_at: string;
}

// Subscription & Billing Types
export interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id?: string;
}

export interface UsageMetrics {
  user_id: string;
  ai_queries_used: number;
  ai_queries_limit: number;
  documents_analyzed: number;
  documents_limit: number;
  api_calls_used: number;
  api_calls_limit: number;
  period_start: string;
  period_end: string;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Component Props Types
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export interface ChartProps {
  data: ChartData[];
  type: 'line' | 'candlestick' | 'bar' | 'area';
  height?: number;
  timeframe?: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  indicators?: string[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Theme & UI Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface AnalysisRequest {
  type: 'portfolio' | 'market' | 'document';
  prompt: string;
  portfolio_id?: string;
  document_id?: string;
  symbols?: string[];
}

// Export all types for easy importing
export type * from './index';