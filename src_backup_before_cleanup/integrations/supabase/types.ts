export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_analyses: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string
          data_sources: Json | null
          detailed_analysis: Json | null
          id: string
          portfolio_id: string | null
          recommendations: Json | null
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          detailed_analysis?: Json | null
          id?: string
          portfolio_id?: string | null
          recommendations?: Json | null
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          data_sources?: Json | null
          detailed_analysis?: Json | null
          id?: string
          portfolio_id?: string | null
          recommendations?: Json | null
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insight_templates: {
        Row: {
          action_items: Json | null
          applicable_scenarios: Json | null
          category: string
          confidence_level: number | null
          content: string
          created_at: string | null
          id: number
          insight_type: string
          title: string
        }
        Insert: {
          action_items?: Json | null
          applicable_scenarios?: Json | null
          category: string
          confidence_level?: number | null
          content: string
          created_at?: string | null
          id?: number
          insight_type: string
          title: string
        }
        Update: {
          action_items?: Json | null
          applicable_scenarios?: Json | null
          category?: string
          confidence_level?: number | null
          content?: string
          created_at?: string | null
          id?: number
          insight_type?: string
          title?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          context_data: Json | null
          created_at: string
          id: string
          last_message_at: string | null
          messages: Json
          title: string | null
          total_messages: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          messages?: Json
          title?: string | null
          total_messages?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          messages?: Json
          title?: string | null
          total_messages?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_type: string | null
          extracted_data: Json | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          portfolio_id: string | null
          processed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          portfolio_id?: string | null
          processed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          portfolio_id?: string | null
          processed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_benchmarks: {
        Row: {
          benchmark_name: string
          benchmark_type: string
          current_value: number | null
          description: string | null
          expense_ratio: number | null
          five_year_return: number | null
          id: number
          last_updated: string | null
          one_year_return: number | null
          three_year_return: number | null
          ticker_symbol: string | null
          ytd_return: number | null
        }
        Insert: {
          benchmark_name: string
          benchmark_type: string
          current_value?: number | null
          description?: string | null
          expense_ratio?: number | null
          five_year_return?: number | null
          id?: number
          last_updated?: string | null
          one_year_return?: number | null
          three_year_return?: number | null
          ticker_symbol?: string | null
          ytd_return?: number | null
        }
        Update: {
          benchmark_name?: string
          benchmark_type?: string
          current_value?: number | null
          description?: string | null
          expense_ratio?: number | null
          five_year_return?: number | null
          id?: number
          last_updated?: string | null
          one_year_return?: number | null
          three_year_return?: number | null
          ticker_symbol?: string | null
          ytd_return?: number | null
        }
        Relationships: []
      }
      holdings: {
        Row: {
          avg_cost: number
          created_at: string | null
          id: string
          portfolio_id: string | null
          shares: number
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_cost: number
          created_at?: string | null
          id?: string
          portfolio_id?: string | null
          shares: number
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_cost?: number
          created_at?: string | null
          id?: string
          portfolio_id?: string | null
          shares?: number
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_strategies: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          max_drawdown: number | null
          rebalance_frequency: string | null
          risk_level: string | null
          strategy_name: string
          suitable_for: Json | null
          target_return: number | null
          typical_allocation: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          max_drawdown?: number | null
          rebalance_frequency?: string | null
          risk_level?: string | null
          strategy_name: string
          suitable_for?: Json | null
          target_return?: number | null
          typical_allocation?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          max_drawdown?: number | null
          rebalance_frequency?: string | null
          risk_level?: string | null
          strategy_name?: string
          suitable_for?: Json | null
          target_return?: number | null
          typical_allocation?: Json | null
        }
        Relationships: []
      }
      market_sectors: {
        Row: {
          created_at: string | null
          description: string | null
          dividend_yield_avg: number | null
          id: number
          sector_code: string
          sector_name: string
          typical_pe_ratio: number | null
          volatility_level: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dividend_yield_avg?: number | null
          id?: number
          sector_code: string
          sector_name: string
          typical_pe_ratio?: number | null
          volatility_level?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dividend_yield_avg?: number | null
          id?: number
          sector_code?: string
          sector_name?: string
          typical_pe_ratio?: number | null
          volatility_level?: string | null
        }
        Relationships: []
      }
      portfolio_history: {
        Row: {
          created_at: string
          daily_change: number | null
          daily_change_percent: number | null
          date: string
          id: string
          portfolio_id: string
          total_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_change?: number | null
          daily_change_percent?: number | null
          date: string
          id?: string
          portfolio_id: string
          total_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_change?: number | null
          daily_change_percent?: number | null
          date?: string
          id?: string
          portfolio_id?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_history_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_primary: boolean | null
          name: string
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          investment_experience: string | null
          phone: string | null
          risk_tolerance: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_prices: {
        Row: {
          created_at: string | null
          high: number | null
          id: string
          low: number | null
          open: number | null
          price: number
          symbol: string
          timestamp: string | null
          volume: number | null
        }
        Insert: {
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price: number
          symbol: string
          timestamp?: string | null
          volume?: number | null
        }
        Update: {
          created_at?: string | null
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price?: number
          symbol?: string
          timestamp?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          fees: number | null
          id: string
          notes: string | null
          portfolio_id: string | null
          price: number | null
          quantity: number | null
          symbol: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          portfolio_id?: string | null
          price?: number | null
          quantity?: number | null
          symbol?: string | null
          transaction_date?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          portfolio_id?: string | null
          price?: number | null
          quantity?: number | null
          symbol?: string | null
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_and_store_portfolio_history: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
