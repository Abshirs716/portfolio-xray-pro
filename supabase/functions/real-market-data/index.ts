import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbol } = await req.json()
    console.log(`🚀 REAL market data request for: ${symbol}`)
    
    // Get REAL API key
    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY')
    
    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('Alpha Vantage API key not configured')
    }

    // 🎯 REAL API CALL TO ALPHA VANTAGE!
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Check for API errors
    if (data['Error Message']) {
      throw new Error(`Invalid symbol: ${symbol}`)
    }
    
    if (data['Note']) {
      throw new Error('API rate limit reached. Please try again later.')
    }

    // Extract REAL data
    const quote = data['Global Quote']
    
    if (!quote || !quote['05. price']) {
      throw new Error('No data available for symbol')
    }

    // 🎉 Return REAL market data!
    const realMarketData = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: parseInt(quote['06. volume']),
      timestamp: new Date().toISOString(),
      source: 'alphavantage-real', // This is ACTUALLY real now!
      isRealData: true // 🚀 No more fake data!
    }

    console.log('✅ REAL DATA:', realMarketData)

    return new Response(
      JSON.stringify(realMarketData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error fetching real market data:', error)
    
    // Return error (no more fake fallbacks!)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        isRealData: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})