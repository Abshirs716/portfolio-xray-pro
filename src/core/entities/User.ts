export interface User {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  riskTolerance?: RiskTolerance;
  investmentExperience?: InvestmentExperience;
  createdAt: Date;
  updatedAt: Date;
}

export enum RiskTolerance {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
  VERY_AGGRESSIVE = 'very_aggressive'
}

export enum InvestmentExperience {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface UserPreferences {
  defaultCurrency: string;
  notifications: {
    priceAlerts: boolean;
    portfolioUpdates: boolean;
    marketNews: boolean;
  };
  dashboardLayout: string[];
  theme: 'light' | 'dark';
}