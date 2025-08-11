import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("🔍 FORENSIC INVESTIGATION: Checking all available secrets...")
    
    // Get all environment variables
    const allEnvVars = Deno.env.toObject()
    
    // Filter for API-related keys
    const apiKeyVars: Record<string, string> = {}
    const keyPatterns = [
      'ANTHROPIC', 'CLAUDE', 'ALPHA', 'FMP', 'OPENAI', 'API_KEY', 'api_key', 'Financial'
    ]
    
    for (const [key, value] of Object.entries(allEnvVars)) {
      if (keyPatterns.some(pattern => key.toUpperCase().includes(pattern.toUpperCase()))) {
        // Mask the actual key value for security
        apiKeyVars[key] = value ? `KEY_PRESENT (length: ${value.length})` : 'EMPTY'
      }
    }

    // Test each key with actual API calls
    const apiTests = {
      anthropic: null as any,
      alphaVantage: null as any,
      fmp: null as any,
      openai: null as any
    }

    // Test Anthropic/Claude
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY') || 
                        Deno.env.get('Financial AI Analyst - Advanced SaaS Platform_Anthropic') ||
                        Deno.env.get('Anthropic_API_Key') ||
                        Deno.env.get('Anthropic API Key')
    
    if (anthropicKey) {
      try {
        console.log("🤖 Testing Anthropic API...")
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            messages: [{ role: 'user', content: 'Reply with just "API_TEST_SUCCESS"' }],
            max_tokens: 20
          })
        })
        
        apiTests.anthropic = {
          status: anthropicResponse.status,
          statusText: anthropicResponse.statusText,
          headers: Object.fromEntries(anthropicResponse.headers.entries()),
          body: anthropicResponse.status === 200 ? await anthropicResponse.json() : await anthropicResponse.text(),
          keyFound: true,
          keyLength: anthropicKey.length
        }
      } catch (e) {
        apiTests.anthropic = { error: e.message, keyFound: true, keyLength: anthropicKey.length }
      }
    } else {
      apiTests.anthropic = { error: 'No Anthropic key found', keyFound: false }
    }

    // Test Alpha Vantage
    const alphaKey = Deno.env.get('ALPHA_VANTAGE_API_KEY') || Deno.env.get('Alpha Vantage')
    if (alphaKey) {
      try {
        console.log("📈 Testing Alpha Vantage API...")
        const alphaResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${alphaKey}`)
        const alphaData = await alphaResponse.json()
        
        apiTests.alphaVantage = {
          status: alphaResponse.status,
          body: alphaData,
          keyFound: true,
          keyLength: alphaKey.length,
          rateLimited: alphaData.Note?.includes('call frequency') || alphaData.Information?.includes('call frequency')
        }
      } catch (e) {
        apiTests.alphaVantage = { error: e.message, keyFound: true, keyLength: alphaKey.length }
      }
    } else {
      apiTests.alphaVantage = { error: 'No Alpha Vantage key found', keyFound: false }
    }

    // Test FMP
    const fmpKey = Deno.env.get('FMP_API_KEY')
    if (fmpKey) {
      try {
        console.log("💼 Testing FMP API...")
        const fmpResponse = await fetch(`https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=${fmpKey}`)
        const fmpData = await fmpResponse.json()
        
        apiTests.fmp = {
          status: fmpResponse.status,
          body: fmpData,
          keyFound: true,
          keyLength: fmpKey.length
        }
      } catch (e) {
        apiTests.fmp = { error: e.message, keyFound: true, keyLength: fmpKey.length }
      }
    } else {
      apiTests.fmp = { error: 'No FMP key found', keyFound: false }
    }

    // Test OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('OpenAI API Key')
    if (openaiKey) {
      try {
        console.log("🧠 Testing OpenAI API...")
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
          }
        })
        
        apiTests.openai = {
          status: openaiResponse.status,
          keyFound: true,
          keyLength: openaiKey.length,
          body: openaiResponse.status === 200 ? 'API accessible' : await openaiResponse.text()
        }
      } catch (e) {
        apiTests.openai = { error: e.message, keyFound: true, keyLength: openaiKey.length }
      }
    } else {
      apiTests.openai = { error: 'No OpenAI key found', keyFound: false }
    }

    const investigationResult = {
      timestamp: new Date().toISOString(),
      totalEnvVars: Object.keys(allEnvVars).length,
      apiRelatedVars: apiKeyVars,
      allEnvVarKeys: Object.keys(allEnvVars).sort(),
      apiTests,
      denoVersion: Deno.version,
      recommendations: []
    }

    // Generate recommendations based on findings
    if (!apiTests.anthropic.keyFound) {
      investigationResult.recommendations.push("❌ CRITICAL: No Anthropic API key found in any expected location")
    } else if (apiTests.anthropic.status !== 200) {
      investigationResult.recommendations.push(`❌ Anthropic API failing with status ${apiTests.anthropic.status}`)
    }

    if (!apiTests.alphaVantage.keyFound) {
      investigationResult.recommendations.push("⚠️ Alpha Vantage API key missing")
    } else if (apiTests.alphaVantage.rateLimited) {
      investigationResult.recommendations.push("⚠️ Alpha Vantage rate limited - need additional keys or rotation")
    }

    if (!apiTests.fmp.keyFound) {
      investigationResult.recommendations.push("⚠️ FMP API key missing")
    }

    console.log("🔍 INVESTIGATION COMPLETE:", investigationResult)

    return new Response(JSON.stringify(investigationResult, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('🚨 Investigation failed:', error)
    return new Response(
      JSON.stringify({ error: 'Investigation failed', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})