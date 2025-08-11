import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/hooks/usePortfolio';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types';

interface AIResponse {
  response: string;
  model: string;
  timestamp: string;
  error?: string;
}

/**
 * useAIChat Hook
 * 
 * Manages AI chat conversations with real OpenAI integration.
 * Includes conversation persistence and financial context.
 */
export const useAIChat = (conversationId?: string) => {
  const { user } = useAuth();
  const { portfolio, transactions } = usePortfolio();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, model: string = 'gpt-4o-mini'): Promise<AIResponse> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);

    try {
      console.log('Sending message to AI:', message, 'with model:', model);

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          conversationId,
          model,
          portfolio: portfolio ? {
            id: portfolio.id,
            total_value: portfolio.total_value,
            name: portfolio.name,
            currency: portfolio.currency
          } : null,
          transactions: transactions?.slice(0, 10) || []
        }
      });

      if (error) {
        console.error('AI chat error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      console.log('AI response received:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        response: data.response,
        model: data.model || 'gpt-4',
        timestamp: data.timestamp || new Date().toISOString()
      };

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      toast({
        title: "AI Chat Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, portfolio, transactions, conversationId, toast]);

  const createConversation = useCallback(async (title?: string): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: title || `Chat ${new Date().toLocaleDateString()}`,
          messages: [],
          total_messages: 0,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data.id;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }, [user]);

  const getConversation = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }, [user]);

  const getUserConversations = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('id, title, last_message_at, total_messages')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }, [user]);

  return {
    sendMessage,
    createConversation,
    getConversation,
    getUserConversations,
    isLoading
  };
};