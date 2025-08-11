#!/bin/bash

echo "🚀 Deploying Real Market Data Edge Function"

# Step 1: Create function if it doesn't exist
echo "📁 Creating edge function..."
supabase functions new real-market-data 2>/dev/null || echo "Function already exists"

# Step 2: Deploy the function
echo "📤 Deploying edge function..."
supabase functions deploy real-market-data --no-verify-jwt

# Step 3: Set secrets (you need to replace with actual keys)
echo "🔑 Setting API secrets..."
echo "IMPORTANT: Replace these with your actual API keys!"
echo "Run these commands with your real keys:"
echo ""
echo "supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key-here"
echo "supabase secrets set ALPHA_VANTAGE_API_KEY=your-alpha-key-here"
echo "supabase secrets set FMP_API_KEY=your-fmp-key-here"
echo ""

# Step 4: List functions to verify
echo "✅ Verifying deployment..."
supabase functions list

# Step 5: Get project info for testing
echo "📊 Project info for testing:"
supabase status