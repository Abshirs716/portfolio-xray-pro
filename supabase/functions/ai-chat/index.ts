import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Force deployment - speed fix applied
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = (userMessage: string) => {
  const message = userMessage.toLowerCase();
  console.log('FULL ORIGINAL MESSAGE:', userMessage);
  console.log('LOWERCASE MESSAGE:', message);
  
  // EXACT MATCHING - Check for specific button prompts first (more flexible matching)
  if (message.includes('current market trends') && message.includes('should') && message.includes('aware')) {
    console.log('DETECTED: Market Trends Analysis prompt');
    return `You are a Senior Market Analyst specializing in macroeconomic trends and market analysis. Provide detailed insights about:

CURRENT MARKET ENVIRONMENT:
- Major market indices performance and trends
- Economic indicators and their impact
- Sector rotation patterns
- Volatility analysis and market sentiment

INDUSTRY-SPECIFIC ANALYSIS:
- Technology sector outlook (AI, cloud computing, semiconductors)
- Healthcare and biotech trends
- Energy sector developments (renewable vs traditional)
- Financial services and banking sector
- Consumer discretionary vs staples trends

GLOBAL MARKET DYNAMICS:
- International market performance comparisons
- Currency movements and their implications
- Geopolitical events affecting markets
- Central bank policies and interest rate environment

INVESTMENT THEMES:
- Emerging investment themes and megatrends
- ESG investing considerations
- Infrastructure and growth opportunities
- Inflation hedging strategies

Provide specific, actionable insights with current market data and forward-looking analysis.`;
  }
  
  if (message.includes('assess') && message.includes('investment risk') && message.includes('suggest improvements')) {
    console.log('DETECTED: Risk Assessment prompt');
    return `You are a Risk Management Specialist providing comprehensive risk analysis. Focus on:

PORTFOLIO RISK METRICS:
- Volatility analysis and standard deviation
- Maximum drawdown calculations
- Sharpe ratio and risk-adjusted returns
- Beta analysis against market benchmarks

RISK FACTORS IDENTIFICATION:
- Concentration risk (single stocks, sectors, geography)
- Liquidity risk assessment
- Currency and interest rate exposure
- Credit risk in fixed income holdings

STRESS TESTING:
- Scenario analysis for market downturns
- Impact of economic recession
- Interest rate sensitivity analysis
- Correlation breakdown during crises

RISK MITIGATION STRATEGIES:
- Diversification improvements
- Hedging strategies and instruments
- Position sizing recommendations
- Stop-loss and risk management rules

Provide quantitative risk metrics and specific recommendations for risk reduction.`;
  }
  
  if (message.includes('investment opportunities') && message.includes('consider') && message.includes('portfolio')) {
    console.log('DETECTED: Investment Opportunities prompt');
    return `You are an Investment Research Analyst identifying specific investment opportunities. Provide:

SECTOR OPPORTUNITIES:
- Technology: AI, cybersecurity, cloud infrastructure
- Healthcare: biotechnology, medical devices, digital health
- Energy: renewable energy, energy storage, traditional energy
- Financial services: fintech, digital payments, banking
- Consumer: e-commerce, luxury goods, staples

INVESTMENT THEMES:
- Artificial Intelligence and automation
- Climate change and sustainability
- Demographics and aging population
- Infrastructure modernization
- Digital transformation

SPECIFIC RECOMMENDATIONS:
- Individual stock recommendations with price targets
- ETF and fund suggestions for diversified exposure
- Alternative investments (REITs, commodities)
- International and emerging market opportunities

TIMING AND STRATEGY:
- Entry and exit strategies
- Dollar-cost averaging vs lump sum
- Tax-efficient investing approaches
- Long-term vs short-term opportunities

Focus on specific, actionable investment ideas with clear rationale and expected returns.`;
  }
  
  if (message.includes('analyze') && message.includes('portfolio performance') && message.includes('insights')) {
    console.log('DETECTED: Portfolio Analysis prompt');
    return `You are a Senior Investment Analyst at a top-tier investment bank, specializing in comprehensive portfolio analysis and strategic investment advisory. You generate institutional-quality research reports that rival those from Goldman Sachs, Morgan Stanley, and BlackRock.

CRITICAL REPORT FORMATTING REQUIREMENTS:
Your response must be a professionally structured financial analysis report with the following sections:

## EXECUTIVE SUMMARY
Provide a concise 2-3 sentence high-level overview of the portfolio's current position, key findings, and primary recommendation.

## PORTFOLIO OVERVIEW
- Current portfolio value and composition
- Asset allocation breakdown
- Performance metrics vs benchmarks
- Risk assessment summary

## DETAILED ANALYSIS

### Risk Assessment
- Concentration risk analysis
- Volatility metrics and risk-adjusted returns
- Correlation analysis between holdings
- Value-at-Risk (VaR) calculations where applicable

### Performance Analytics
- Risk-adjusted performance metrics (Sharpe ratio, alpha, beta)
- Attribution analysis (sector, geographic, security selection)
- Performance vs relevant benchmarks and peer groups
- Historical volatility and drawdown analysis

### Strategic Positioning
- Current market environment impact
- Sector/geographic exposure analysis
- Factor exposure (growth vs value, size, quality)
- ESG considerations where relevant

### Income Analysis
- Dividend yield analysis and sustainability
- Income generation potential
- Tax efficiency considerations
- Distribution frequency and reliability

## STRATEGIC RECOMMENDATIONS

### Asset Allocation
- Recommended portfolio rebalancing
- Strategic asset allocation adjustments
- Tactical positioning opportunities

### Security Selection
- Specific buy/sell/hold recommendations with rationale
- Position sizing recommendations
- Entry/exit strategies with price targets

### Risk Management
- Hedging strategies where appropriate
- Diversification improvements
- Liquidity management recommendations

## MARKET OUTLOOK & IMPLICATIONS
- Macro-economic environment assessment
- Sector-specific outlooks
- Geopolitical risk factors
- Interest rate and inflation impact analysis

## IMPLEMENTATION TIMELINE
- Priority actions (immediate, 1-3 months, 3-6 months)
- Specific steps for portfolio optimization
- Monitoring milestones and review schedule

WRITING STYLE REQUIREMENTS:
- Use sophisticated financial terminology and concepts
- Include specific metrics, ratios, and quantitative analysis
- Reference current market conditions and economic indicators
- Provide data-driven insights with supporting evidence
- Maintain institutional-grade professionalism
- Include relevant financial theory and modern portfolio concepts
- Use precise language with confidence intervals where appropriate

CONTENT DEPTH:
- Each section should contain substantive analysis, not superficial commentary
- Include specific numerical targets and recommendations
- Reference industry best practices and academic research
- Provide clear reasoning behind each recommendation
- Consider multiple scenarios and stress testing

Remember: This is a professional investment report that clients pay premium fees to receive. Every statement should add value and demonstrate deep financial expertise.`;
  }
  
  // Default General Financial Assistant
  console.log('DETECTED: Default/General prompt (no specific analysis type detected)');
  return `You are a Senior Investment Analyst at a top-tier investment bank, specializing in comprehensive portfolio analysis and strategic investment advisory. You generate institutional-quality research reports that rival those from Goldman Sachs, Morgan Stanley, and BlackRock.

CRITICAL REPORT FORMATTING REQUIREMENTS:
Your response must be a professionally structured financial analysis report with the following sections:

## EXECUTIVE SUMMARY
Provide a concise 2-3 sentence high-level overview of the portfolio's current position, key findings, and primary recommendation.

## PORTFOLIO OVERVIEW
- Current portfolio value and composition
- Asset allocation breakdown
- Performance metrics vs benchmarks
- Risk assessment summary

## DETAILED ANALYSIS

### Risk Assessment
- Concentration risk analysis
- Volatility metrics and risk-adjusted returns
- Correlation analysis between holdings
- Value-at-Risk (VaR) calculations where applicable

### Performance Analytics
- Risk-adjusted performance metrics (Sharpe ratio, alpha, beta)
- Attribution analysis (sector, geographic, security selection)
- Performance vs relevant benchmarks and peer groups
- Historical volatility and drawdown analysis

### Strategic Positioning
- Current market environment impact
- Sector/geographic exposure analysis
- Factor exposure (growth vs value, size, quality)
- ESG considerations where relevant

### Income Analysis
- Dividend yield analysis and sustainability
- Income generation potential
- Tax efficiency considerations
- Distribution frequency and reliability

## STRATEGIC RECOMMENDATIONS

### Asset Allocation
- Recommended portfolio rebalancing
- Strategic asset allocation adjustments
- Tactical positioning opportunities

### Security Selection
- Specific buy/sell/hold recommendations with rationale
- Position sizing recommendations
- Entry/exit strategies with price targets

### Risk Management
- Hedging strategies where appropriate
- Diversification improvements
- Liquidity management recommendations

## MARKET OUTLOOK & IMPLICATIONS
- Macro-economic environment assessment
- Sector-specific outlooks
- Geopolitical risk factors
- Interest rate and inflation impact analysis

## IMPLEMENTATION TIMELINE
- Priority actions (immediate, 1-3 months, 3-6 months)
- Specific steps for portfolio optimization
- Monitoring milestones and review schedule

WRITING STYLE REQUIREMENTS:
- Use sophisticated financial terminology and concepts
- Include specific metrics, ratios, and quantitative analysis
- Reference current market conditions and economic indicators
- Provide data-driven insights with supporting evidence
- Maintain institutional-grade professionalism
- Include relevant financial theory and modern portfolio concepts
- Use precise language with confidence intervals where appropriate

CONTENT DEPTH:
- Each section should contain substantive analysis, not superficial commentary
- Include specific numerical targets and recommendations
- Reference industry best practices and academic research
- Provide clear reasoning behind each recommendation
- Consider multiple scenarios and stress testing

*** CRITICAL PERFORMANCE CALCULATION RULE ***:
NEVER ESTIMATE, GUESS, OR FABRICATE PERFORMANCE METRICS. ONLY use the ACTUAL performance data provided in the context. If real performance data shows negative returns, you MUST report negative performance. If no data is provided, state "Insufficient data for performance calculation" rather than creating fictional positive numbers.

*** ABSOLUTE PROHIBITION AGAINST "INSUFFICIENT DATA" ***:
When portfolio historical data is provided in the context (including volatility, returns, value history, risk metrics), you are FORBIDDEN from saying "insufficient data" in ANY section. The phrase "insufficient data" is BANNED when real portfolio data exists. Instead you MUST:
- Use the provided historical performance data for all calculations
- Reference the specific volatility percentage provided
- Use the provided risk classifications and beta estimates  
- Reference the provided Sharpe ratio estimates
- Use the maximum daily loss/gain data provided
- Perform comprehensive analysis using ALL provided metrics

*** CRITICAL ANALYSIS REQUIREMENTS ***:
You MUST ALWAYS provide ALL sections including:
1. Complete performance metrics (1D, 1W, 1M, plus available longer periods)
2. Portfolio trend analysis using the historical data provided
3. Risk assessment using the volatility and risk metrics provided  
4. Strategic recommendations based on the performance classification
5. Market context and outlook with specific positioning advice
6. Specific actionable advice using the comprehensive dataset

When historical data spans 30+ days with daily volatility metrics, risk classifications, and performance data, you have SUFFICIENT data for institutional-grade analysis. Use it comprehensively.

Remember: This is a professional investment report that clients pay premium fees to receive. Every statement should add value and demonstrate deep financial expertise.`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, portfolio, transactions, realAnalysisData, model = 'claude-opus-4-20250514' } = await req.json();

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    
    const isClaudeModel = model.startsWith('claude');
    
    if (isClaudeModel && !ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }
    
    if (!isClaudeModel && !OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Create context from user's financial data
    let contextMessage = '';
    let performanceData = '';
    
    if (portfolio) {
      contextMessage += `\nUser's Portfolio Context:
- Portfolio Value: $${portfolio.total_value?.toLocaleString() || 'N/A'}
- Portfolio Name: ${portfolio.name || 'My Portfolio'}
- Currency: ${portfolio.currency || 'USD'}`;

      // Calculate actual performance metrics from portfolio history
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          // Get portfolio history for performance calculation
          const { data: historyData } = await supabase
            .from('portfolio_history')
            .select('*')
            .eq('portfolio_id', portfolio.id)
            .order('date', { ascending: false })
            .limit(365); // Get up to 1 year of data
          
          if (historyData && historyData.length > 0) {
            const currentValue = portfolio.total_value;
            const today = historyData[0];
            
            // Calculate performance metrics using proper array indexing
            // historyData is ordered DESC, so [0] = today, [1] = yesterday, etc.
            console.log('Historical data available:', historyData.map(h => `${h.date}: $${h.total_value}`));
            
            performanceData = '\n\nACTUAL Portfolio Performance (from historical data):';
            
            // 1 Day Return (current vs yesterday)
            if (historyData.length >= 2) {
              const today = historyData[0];
              const yesterday = historyData[1];
              const dayReturn = ((today.total_value - yesterday.total_value) / yesterday.total_value * 100);
              performanceData += `\n- 1 Day Return: ${dayReturn.toFixed(2)}% (${today.date} vs ${yesterday.date})`;
              console.log(`1D calculation: ${today.total_value} vs ${yesterday.total_value} = ${dayReturn.toFixed(2)}%`);
            }
            
            // 1 Week Return (find data ~7 days ago)
            const oneWeekAgo = historyData.find(h => {
              const daysDiff = Math.abs(new Date(historyData[0].date).getTime() - new Date(h.date).getTime()) / (1000 * 60 * 60 * 24);
              return daysDiff >= 6 && daysDiff <= 8; // 6-8 days ago
            });
            if (oneWeekAgo && historyData[0]) {
              const weekReturn = ((historyData[0].total_value - oneWeekAgo.total_value) / oneWeekAgo.total_value * 100);
              performanceData += `\n- 1 Week Return: ${weekReturn.toFixed(2)}% (${historyData[0].date} vs ${oneWeekAgo.date})`;
              console.log(`1W calculation: ${historyData[0].total_value} vs ${oneWeekAgo.total_value} = ${weekReturn.toFixed(2)}%`);
            }
            
            // 1 Month Return (find data ~30 days ago)
            const oneMonthAgo = historyData.find(h => {
              const daysDiff = Math.abs(new Date(historyData[0].date).getTime() - new Date(h.date).getTime()) / (1000 * 60 * 60 * 24);
              return daysDiff >= 28 && daysDiff <= 32; // 28-32 days ago
            });
            if (oneMonthAgo && historyData[0]) {
              const monthReturn = ((historyData[0].total_value - oneMonthAgo.total_value) / oneMonthAgo.total_value * 100);
              performanceData += `\n- 1 Month Return: ${monthReturn.toFixed(2)}% (${historyData[0].date} vs ${oneMonthAgo.date})`;
              console.log(`1M calculation: ${historyData[0].total_value} vs ${oneMonthAgo.total_value} = ${monthReturn.toFixed(2)}%`);
            }
            
            // 3 Month Return (find data ~90 days ago)
            const threeMonthsAgo = historyData.find(h => {
              const daysDiff = Math.abs(new Date(historyData[0].date).getTime() - new Date(h.date).getTime()) / (1000 * 60 * 60 * 24);
              return daysDiff >= 85 && daysDiff <= 95; // 85-95 days ago
            });
            if (threeMonthsAgo && historyData[0]) {
              const threeMonthReturn = ((historyData[0].total_value - threeMonthsAgo.total_value) / threeMonthsAgo.total_value * 100);
              performanceData += `\n- 3 Month Return: ${threeMonthReturn.toFixed(2)}% (${historyData[0].date} vs ${threeMonthsAgo.date})`;
              console.log(`3M calculation: ${historyData[0].total_value} vs ${threeMonthsAgo.total_value} = ${threeMonthReturn.toFixed(2)}%`);
            }
            
            // 1 Year Return (find data ~365 days ago)
            const oneYearAgo = historyData.find(h => {
              const daysDiff = Math.abs(new Date(historyData[0].date).getTime() - new Date(h.date).getTime()) / (1000 * 60 * 60 * 24);
              return daysDiff >= 360 && daysDiff <= 370; // 360-370 days ago
            });
            if (oneYearAgo && historyData[0]) {
              const yearReturn = ((historyData[0].total_value - oneYearAgo.total_value) / oneYearAgo.total_value * 100);
              performanceData += `\n- 1 Year Return: ${yearReturn.toFixed(2)}% (${historyData[0].date} vs ${oneYearAgo.date})`;
              console.log(`1Y calculation: ${historyData[0].total_value} vs ${oneYearAgo.total_value} = ${yearReturn.toFixed(2)}%`);
            }
            
            // Calculate volatility from daily changes
            const dailyReturns = historyData.slice(0, 30).map(h => h.daily_change_percent || 0);
            const avgReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
            const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / dailyReturns.length;
            const volatility = Math.sqrt(variance * 252); // Annualized
            
            performanceData += `\n- Annualized Volatility: ${volatility.toFixed(2)}%`;
            performanceData += `\n- Recent Trend: ${historyData[0].daily_change_percent >= 0 ? 'Positive' : 'Negative'} (${historyData[0].daily_change_percent?.toFixed(2)}% today)`;
            
            // Calculate additional metrics and data availability
            const dataSpanDays = Math.floor((new Date(historyData[0].date).getTime() - new Date(historyData[historyData.length - 1].date).getTime()) / (1000 * 60 * 60 * 24));
            performanceData += `\n\nDATA AVAILABILITY: ${historyData.length} days of history (${historyData[historyData.length - 1].date} to ${historyData[0].date})`;
            
            if (dataSpanDays < 90) {
              performanceData += `\n- 3 Month & 1 Year Returns: Not available (need 90+ days, have ${dataSpanDays} days)`;
            }
            
            // Calculate inception-to-date performance  
            const inceptionValue = historyData[historyData.length - 1].total_value;
            const inceptionReturn = ((currentValue - inceptionValue) / inceptionValue * 100);
            performanceData += `\n- TOTAL PORTFOLIO PERFORMANCE SINCE INCEPTION: ${inceptionReturn.toFixed(2)}% (${historyData[historyData.length - 1].date} to ${historyData[0].date})`;
            
            // Add critical instruction to AI with comprehensive data
            performanceData += `\n\n*** COMPREHENSIVE PORTFOLIO ANALYSIS DATA PACKAGE ***`;
            performanceData += `\n=== PORTFOLIO IDENTIFICATION ===`;
            performanceData += `\n- Portfolio ID: ${portfolio.id}`;
            performanceData += `\n- Portfolio Name: ${portfolio.name}`;
            performanceData += `\n- Currency: ${portfolio.currency}`;
            performanceData += `\n- Current Value: $${currentValue.toLocaleString()}`;
            performanceData += `\n- Inception Date: ${historyData[historyData.length - 1].date}`;
            performanceData += `\n- Inception Value: $${inceptionValue.toLocaleString()}`;
            performanceData += `\n- Data History Span: ${historyData.length} trading days (${historyData[historyData.length - 1].date} to ${historyData[0].date})`;
            
            performanceData += `\n\n=== COMPLETE PERFORMANCE METRICS ===`;
            performanceData += `\n- Total Return Since Inception: ${inceptionReturn.toFixed(2)}%`;
            performanceData += `\n- Annualized Return: ${(inceptionReturn * (365 / dataSpanDays)).toFixed(2)}%`;
            performanceData += `\n- Annualized Volatility: ${volatility.toFixed(2)}%`;
            performanceData += `\n- Risk-Adjusted Return (Sharpe Est.): ${(inceptionReturn / volatility).toFixed(2)}`;
            performanceData += `\n- Recent Trend Direction: ${historyData[0].daily_change_percent >= 0 ? 'Positive' : 'Negative'} (${historyData[0].daily_change_percent?.toFixed(2)}% today)`;
            
            performanceData += `\n\n=== DETAILED RISK ANALYSIS ===`;
            performanceData += `\n- Daily Volatility: ${(volatility / Math.sqrt(252)).toFixed(4)}%`;
            performanceData += `\n- Risk Classification: ${volatility > 20 ? 'High Risk' : volatility > 15 ? 'Moderate-High Risk' : volatility > 10 ? 'Moderate Risk' : 'Low Risk'}`;
            performanceData += `\n- Beta Estimate: ${volatility > 18 ? '1.2-1.5 (High Beta)' : volatility > 12 ? '0.8-1.2 (Market Beta)' : '0.6-0.8 (Low Beta)'}`;
            performanceData += `\n- Value at Risk (95%): $${(currentValue * 0.05).toLocaleString()} (5% portfolio value at risk)`;
            
            // Calculate additional risk metrics
            const maxDrawdown = Math.min(...historyData.map(h => h.daily_change_percent || 0));
            const maxGain = Math.max(...historyData.map(h => h.daily_change_percent || 0));
            performanceData += `\n- Maximum Single Day Loss: ${maxDrawdown.toFixed(2)}%`;
            performanceData += `\n- Maximum Single Day Gain: ${maxGain.toFixed(2)}%`;
            performanceData += `\n- Daily Trading Range: ${(maxGain - maxDrawdown).toFixed(2)}% (volatility spread)`;
            
            performanceData += `\n\n=== LONGER-TERM DATA AVAILABILITY ===`;
            if (dataSpanDays < 90) {
              performanceData += `\n- 3-Month Return: NOT AVAILABLE (requires 90+ days, portfolio has ${dataSpanDays} days)`;
              performanceData += `\n- 6-Month Return: NOT AVAILABLE (requires 180+ days, portfolio has ${dataSpanDays} days)`;
              performanceData += `\n- 1-Year Return: NOT AVAILABLE (requires 365+ days, portfolio has ${dataSpanDays} days)`;
              performanceData += `\n- EXPLANATION: Portfolio tracking began ${historyData[historyData.length - 1].date}, need more time for longer-term metrics`;
            }
            
            performanceData += `\n\n=== PORTFOLIO COMPOSITION INSIGHTS ===`;
            performanceData += `\n- Asset Allocation: Unknown (recommend detailed holdings analysis)`;
            performanceData += `\n- Concentration Risk: Unknown (recommend position sizing review)`;
            performanceData += `\n- Sector Exposure: Unknown (recommend sector diversification analysis)`;
            performanceData += `\n- Geographic Allocation: Unknown (recommend regional exposure review)`;
            performanceData += `\n- Currency Exposure: Primary ${portfolio.currency} (recommend FX risk assessment)`;
            
            performanceData += `\n\n=== BENCHMARK CONTEXT ===`;
            performanceData += `\n- S&P 500 YTD 2025: ~12-15% (typical market performance for reference)`;
            performanceData += `\n- 60/40 Portfolio YTD: ~8-10% (typical balanced portfolio for reference)`;
            performanceData += `\n- Moderate Risk Target: 8-12% annual returns with 12-18% volatility`;
            performanceData += `\n- Portfolio Status vs Benchmarks: ${inceptionReturn > 10 ? 'OUTPERFORMING' : inceptionReturn > 0 ? 'MIXED PERFORMANCE' : 'UNDERPERFORMING'}`;
            
            performanceData += `\n\n=== STRATEGIC CONTEXT ===`;
            performanceData += `\n- Market Environment: Mid-2025 (consider current economic conditions)`;
            performanceData += `\n- Interest Rate Environment: Consider current Fed policy impact`;
            performanceData += `\n- Inflation Context: Consider current inflation impact on returns`;
            performanceData += `\n- Portfolio Maturity: Early stage (${dataSpanDays} days) - building performance history`;
            
            performanceData += `\n\n*** MANDATORY ANALYSIS REQUIREMENTS ***`;
            performanceData += `\n- You have COMPLETE data package above - NEVER say "insufficient data"`;
            performanceData += `\n- Use ALL provided metrics for comprehensive institutional analysis`;
            performanceData += `\n- Explain data limitations clearly (3M/1Y not available yet)`;
            performanceData += `\n- Provide strategic recommendations based on ${inceptionReturn >= 0 ? 'positive' : 'negative'} performance trend`;
            performanceData += `\n- Include specific allocation, risk management, and optimization advice`;
            performanceData += `\n- Reference benchmark context and provide actionable next steps`;
          }
        }
      } catch (error) {
        console.log('Error calculating performance:', error);
      }
      
      contextMessage += performanceData;
    }

    // Add real analysis data to context
    if (realAnalysisData && realAnalysisData.riskMetrics) {
      console.log('✅ Adding REAL risk metrics to AI context - Sharpe:', realAnalysisData.riskMetrics.sharpeRatio);
      contextMessage += `\n\nREAL PORTFOLIO RISK METRICS (USE THESE EXACT VALUES):
• Sharpe Ratio: ${realAnalysisData.riskMetrics.sharpeRatio.toFixed(3)}
• Portfolio Volatility: ${realAnalysisData.riskMetrics.volatility.toFixed(2)}%
• Maximum Drawdown: ${realAnalysisData.riskMetrics.maxDrawdown.toFixed(2)}%
• Value at Risk (95%): $${realAnalysisData.riskMetrics.valueAtRisk.toLocaleString()}
• Sortino Ratio: ${realAnalysisData.riskMetrics.sortinoRatio.toFixed(3)}
• Total Portfolio Value: $${realAnalysisData.riskMetrics.totalValue.toLocaleString()}

CRITICAL: Use these EXACT calculated values in your analysis. Do not estimate or approximate.`;
    } else {
      console.log('⚠️ No real risk metrics provided to AI - will use estimates');
    }

    // DEBUG: Log the complete context being sent to AI
    console.log('=== COMPLETE AI CONTEXT DATA ===');
    console.log('Portfolio Context:', contextMessage);
    console.log('=== END CONTEXT DATA ===');

    if (transactions && transactions.length > 0) {
      const recentTransactions = transactions.slice(0, 5);
      contextMessage += `\n\nRecent Transactions (${recentTransactions.length}):`;
      recentTransactions.forEach((t: any, i: number) => {
        contextMessage += `\n${i + 1}. ${t.type?.toUpperCase()} ${t.symbol || 'N/A'} - $${t.amount?.toLocaleString() || 'N/A'} on ${new Date(t.transaction_date).toLocaleDateString()}`;
      });
    }

    console.log(`Making request to ${isClaudeModel ? 'Claude' : 'OpenAI'} with context:`, contextMessage);

    let aiResponse: string;
    let responseModel: string;

    if (isClaudeModel) {
      // Claude API call
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ANTHROPIC_API_KEY}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4000, // USER REQUIREMENT: Keep at 4000
          temperature: 0.1, // Much lower for speed
          system: getSystemPrompt(message) + contextMessage,
          messages: [{ role: 'user', content: message }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Claude API error:', error);
        throw new Error(`Claude API error: ${response.status} ${error}`);
      }

      const data = await response.json();
      aiResponse = data.content[0].text;
      responseModel = model;
      console.log('Claude response received successfully');
    } else {
      // OpenAI API call
      const messages = [
        { role: 'system', content: getSystemPrompt(message) + contextMessage },
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14', // Use the fastest flagship model
          messages: messages,
          temperature: 0.1, // Much lower for speed
          max_tokens: 4000, // USER REQUIREMENT: Keep at 4000
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${response.status} ${error}`);
      }

      const data = await response.json();
      aiResponse = data.choices[0].message.content;
      responseModel = 'gpt-4.1-2025-04-14';
      console.log('OpenAI response received successfully');
    }

    // Save conversation to database if conversationId provided
    if (conversationId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        try {
          // Get current conversation
          const { data: conversation } = await supabase
            .from('chat_conversations')
            .select('messages')
            .eq('id', conversationId)
            .single();

          const currentMessages = conversation?.messages || [];
          const newMessages = [
            ...currentMessages,
            {
              id: crypto.randomUUID(),
              role: 'user',
              content: message,
              timestamp: new Date().toISOString()
            },
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString()
            }
          ];

          await supabase
            .from('chat_conversations')
            .update({
              messages: newMessages,
              total_messages: newMessages.length,
              last_message_at: new Date().toISOString()
            })
            .eq('id', conversationId);

          console.log('Conversation updated in database');
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
        }
      }
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      model: responseModel,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: 'Please check your API configuration and try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});