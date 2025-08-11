-- Enable real-time for portfolios table
ALTER TABLE public.portfolios REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.portfolios;

-- Enable real-time for transactions table  
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.transactions;

-- Enable real-time for ai_analyses table
ALTER TABLE public.ai_analyses REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.ai_analyses;

-- Enable real-time for chat_conversations table
ALTER TABLE public.chat_conversations REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.chat_conversations;