import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InstitutionalPromptsService } from '@/components/ai/InstitutionalPromptsService';
import { realRiskAnalysisService } from '@/services/realRiskAnalysisService';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  analysisType?: 'portfolio' | 'market' | 'risk' | 'opportunities';
  confidenceScore?: number;
}

interface AIResponse {
  response: string;
  model: string;
  timestamp: string;
  error?: string;
}

export const useRealtimeAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    message: string, 
    analysisType: 'portfolio' | 'market' | 'risk' | 'opportunities' = 'portfolio',
    portfolio?: any,
    transactions?: any[]
  ) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Get real risk metrics for portfolio analysis
      let riskMetrics = null;
      if (analysisType === 'portfolio' && portfolio?.id) {
        try {
          riskMetrics = await realRiskAnalysisService.getRealRiskMetrics(portfolio.id);
          console.log('✅ Real risk metrics loaded for AI analysis:', riskMetrics);
        } catch (error) {
          console.warn('⚠️ Could not load real risk metrics, using portfolio data only:', error);
        }
      }

      // Get institutional prompt
      const institutionalPrompt = InstitutionalPromptsService.getInstitutionalPrompt(analysisType);
      
      console.log('📤 Sending AI request with:', {
        analysisType,
        hasPortfolio: !!portfolio,
        hasTransactions: !!transactions,
        hasRiskMetrics: !!riskMetrics,
        transactionCount: transactions?.length || 0
      });

      // Enhanced request body with real risk metrics
      const requestBody = {
        message: riskMetrics ? 
          `${institutionalPrompt}\n\nACTUAL CALCULATED RISK METRICS:\n- Sharpe Ratio: ${riskMetrics.sharpeRatio.toFixed(3)}\n- Portfolio Beta: ${riskMetrics.portfolioBeta.toFixed(3)}\n- Annualized Volatility: ${riskMetrics.volatility.toFixed(2)}%\n- Maximum Drawdown: ${riskMetrics.maxDrawdown.toFixed(2)}%\n- Sortino Ratio: ${riskMetrics.sortinoRatio.toFixed(3)}\n- Calmar Ratio: ${riskMetrics.calmarRatio.toFixed(3)}\n- Information Ratio: ${riskMetrics.informationRatio.toFixed(3)}\n- Up Capture Ratio: ${riskMetrics.upCaptureRatio.toFixed(1)}%\n- Down Capture Ratio: ${riskMetrics.downCaptureRatio.toFixed(1)}%\n- Value at Risk (95%): $${riskMetrics.valueAtRisk.toLocaleString()}\n- Expected Shortfall: $${riskMetrics.expectedShortfall.toLocaleString()}\n- Concentration Risk: ${riskMetrics.concentrationRisk.toFixed(1)}% in largest position\n- Sector Concentration: ${riskMetrics.sectorConcentration.toFixed(1)}% in Technology sector\n- Risk Score: ${riskMetrics.riskScore.toFixed(1)}/10\n\nUSE THESE EXACT VALUES in your analysis - do not estimate or approximate.` 
          : institutionalPrompt,
        model: 'gpt-4.1-2025-04-14',
        portfolio,
        transactions,
        riskMetrics
      };

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: requestBody
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Clean the response to remove any instructional content
      const cleanResponse = InstitutionalPromptsService.sanitizeAnalysisOutput(data.response);

      // Add AI response to messages
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: cleanResponse,
        timestamp: data.timestamp,
        analysisType,
        confidenceScore: riskMetrics?.riskScore ? Math.min(95, 85 + (10 - riskMetrics.riskScore)) : 85
      }]);

      console.log('✅ AI analysis completed with real risk metrics');

      return {
        response: cleanResponse,
        model: data.model || 'gpt-4.1-2025-04-14',
        timestamp: data.timestamp || new Date().toISOString()
      };

    } catch (error: any) {
      console.error('❌ Error in AI chat:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I apologize, but I encountered an error while generating the analysis. Please try again. Error: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading
  };
};