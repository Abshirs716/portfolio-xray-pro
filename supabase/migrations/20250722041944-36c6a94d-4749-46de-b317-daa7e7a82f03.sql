-- Fix RLS policies for chat_conversations table
-- First, check if the table exists and drop existing policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON chat_conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON chat_conversations;

-- Ensure RLS is enabled
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies
CREATE POLICY "Users can view their own conversations" 
ON chat_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
ON chat_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON chat_conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON chat_conversations 
FOR DELETE 
USING (auth.uid() = user_id);