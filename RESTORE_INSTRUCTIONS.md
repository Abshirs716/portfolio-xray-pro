# 🔄 RESTORE INSTRUCTIONS - Smart Finance Wizard AI

## Quick Restore Process

### 1. Clone Repository
```bash
git clone https://github.com/Abshirs716/smart-finance-wizard-ai.git
cd smart-finance-wizard-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase
- Create new Supabase project at https://supabase.com
- Copy project URL and anon key
- Run database migrations from `supabase/migrations/`
- Deploy edge functions from `supabase/functions/`

### 4. Configure Secrets
Go to Supabase Dashboard > Settings > Edge Functions > Secrets and add:
- `OPENAI_API_KEY` - Your OpenAI API key
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `ALPHA_VANTAGE_API_KEY` - Your Alpha Vantage key (optional)

### 5. Update Configuration
Update `src/integrations/supabase/client.ts` with your Supabase details

### 6. Run Development Server
```bash
npm run dev
```

## ✅ Verify Working State
After restore, confirm these features work:
- Login/authentication
- Portfolio dashboard loads
- Market data displays correctly
- AI analysis generates results
- Charts and visualizations render

## 🔧 Troubleshooting
If something doesn't work:
1. Check Supabase edge function logs
2. Verify all secrets are set correctly
3. Ensure database migrations ran successfully
4. Check browser console for errors

## 📞 Support
- Lovable docs: https://docs.lovable.dev/
- Supabase docs: https://supabase.com/docs
- Original working state backed up: July 28, 2025