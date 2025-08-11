// ============= API Service Layer =============

import { APIResponse, PaginatedResponse, MarketData, Portfolio, User, AIAnalysis } from "@/types";

/**
 * Base API Configuration
 * 
 * This service layer provides a unified interface for all API calls.
 * It handles authentication, error handling, and response formatting.
 * 
 * TODO: After Supabase integration:
 * - Replace with Supabase client
 * - Add authentication headers
 * - Implement real-time subscriptions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class APIService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add auth headers after Supabase integration
          // 'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ============= Authentication APIs =============
  
  async login(email: string, password: string): Promise<APIResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; name: string }): Promise<APIResponse<User>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<APIResponse<void>> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<APIResponse<User>> {
    return this.request('/auth/me');
  }

  // ============= Portfolio APIs =============

  async getPortfolios(): Promise<APIResponse<Portfolio[]>> {
    return this.request('/portfolios');
  }

  async getPortfolio(id: string): Promise<APIResponse<Portfolio>> {
    return this.request(`/portfolios/${id}`);
  }

  async createPortfolio(portfolio: Partial<Portfolio>): Promise<APIResponse<Portfolio>> {
    return this.request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(portfolio),
    });
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<APIResponse<Portfolio>> {
    return this.request(`/portfolios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePortfolio(id: string): Promise<APIResponse<void>> {
    return this.request(`/portfolios/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Market Data APIs =============

  async getMarketData(symbols: string[]): Promise<APIResponse<MarketData[]>> {
    const symbolsQuery = symbols.join(',');
    return this.request(`/market/data?symbols=${symbolsQuery}`);
  }

  async getHistoricalData(
    symbol: string, 
    timeframe: string = '1M'
  ): Promise<APIResponse<any[]>> {
    return this.request(`/market/historical/${symbol}?timeframe=${timeframe}`);
  }

  async searchSymbols(query: string): Promise<APIResponse<any[]>> {
    return this.request(`/market/search?q=${encodeURIComponent(query)}`);
  }

  // ============= AI Analysis APIs =============

  async createAnalysis(request: {
    type: string;
    prompt: string;
    context?: any;
  }): Promise<APIResponse<AIAnalysis>> {
    return this.request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAnalyses(page: number = 1, limit: number = 10): Promise<PaginatedResponse<AIAnalysis>> {
    const response = await this.request<PaginatedResponse<AIAnalysis>>(
      `/ai/analyses?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getAnalysis(id: string): Promise<APIResponse<AIAnalysis>> {
    return this.request(`/ai/analyses/${id}`);
  }

  // ============= Document APIs =============

  async uploadDocument(file: File, type: string): Promise<APIResponse<{ id: string; url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async analyzeDocument(documentId: string): Promise<APIResponse<AIAnalysis>> {
    return this.request(`/documents/${documentId}/analyze`, {
      method: 'POST',
    });
  }

  // ============= Chat APIs =============

  async sendMessage(conversationId: string, message: string): Promise<APIResponse<any>> {
    return this.request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message }),
    });
  }

  async getConversations(): Promise<APIResponse<any[]>> {
    return this.request('/chat/conversations');
  }

  async createConversation(title?: string): Promise<APIResponse<any>> {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }
}

// Export singleton instance
export const apiService = new APIService();

// ============= Mock Data Service (Remove after Supabase integration) =============

/**
 * MockDataService
 * 
 * Provides sample data for development and demonstration.
 * This will be replaced with real API calls after Supabase integration.
 */
class MockDataService {
  async getPortfolioData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalValue: 2400000,
      dailyChange: 0.125,
      monthlyReturn: 0.082,
      riskScore: 7.4,
      aiConfidence: 0.94,
      assets: [
        { symbol: 'AAPL', value: 480000, weight: 0.20 },
        { symbol: 'GOOGL', value: 360000, weight: 0.15 },
        { symbol: 'TSLA', value: 240000, weight: 0.10 },
        { symbol: 'MSFT', value: 312000, weight: 0.13 },
        { symbol: 'AMZN', value: 288000, weight: 0.12 },
      ]
    };
  }

  async getMarketInsights() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        type: 'opportunity',
        title: 'Tech Sector Rally',
        description: 'AI analysis suggests a potential 15% upside in tech sector ETFs based on recent earnings reports and market sentiment.',
        confidence: 0.87,
        impact: 'high'
      },
      {
        type: 'risk',
        title: 'Energy Sector Volatility',
        description: 'Elevated volatility detected in energy sector. Consider reducing exposure by 5-10%.',
        confidence: 0.92,
        impact: 'medium'
      }
    ];
  }

  async getChatResponse(message: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      "Based on your portfolio analysis, I recommend diversifying your tech holdings to reduce concentration risk.",
      "The current market conditions suggest a cautious approach to new investments. Focus on blue-chip stocks.",
      "Your portfolio's Sharpe ratio of 0.85 indicates good risk-adjusted returns. Consider maintaining current allocation.",
      "I've identified several undervalued assets in the healthcare sector that align with your risk profile.",
      "Market volatility is expected to increase next quarter. Consider hedging strategies for your equity exposure."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const mockDataService = new MockDataService();