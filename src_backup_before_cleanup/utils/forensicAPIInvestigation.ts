import { supabase } from "@/integrations/supabase/client";

export const forensicAPIInvestigation = async () => {
  console.log("🔍 ========== API FORENSIC INVESTIGATION ==========");
  
  // 1. CHECK SUPABASE VAULT (using available methods)
  console.log("\n1️⃣ CHECKING SUPABASE CLIENT ACCESS:");
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log("User auth:", userError ? `FAILED: ${userError.message}` : "SUCCESS");
    console.log("User ID:", user?.user?.id || "No user");
  } catch (e) {
    console.error("Auth check error:", e);
  }
  
  // 2. CHECK EDGE FUNCTION SECRETS VIA DEBUG ENDPOINT
  console.log("\n2️⃣ CALLING DEBUG EDGE FUNCTION:");
  try {
    const { data, error } = await supabase.functions.invoke('debug-secrets', {
      body: { investigation: true }
    });
    
    if (error) {
      console.error("❌ Debug function failed:", error);
    } else {
      console.log("✅ Debug function response:", data);
      
      // Analyze the results
      if (data.apiTests) {
        console.log("\n📊 API TEST RESULTS:");
        
        // Anthropic/Claude Analysis
        if (data.apiTests.anthropic) {
          console.log(`🤖 CLAUDE: ${data.apiTests.anthropic.keyFound ? '🔑 Key Found' : '❌ No Key'}`);
          if (data.apiTests.anthropic.keyFound) {
            console.log(`   Status: ${data.apiTests.anthropic.status || 'Unknown'}`);
            console.log(`   Key Length: ${data.apiTests.anthropic.keyLength}`);
            if (data.apiTests.anthropic.error) {
              console.log(`   ❌ Error: ${data.apiTests.anthropic.error}`);
            }
            if (data.apiTests.anthropic.body) {
              console.log(`   Response:`, data.apiTests.anthropic.body);
            }
          }
        }
        
        // Alpha Vantage Analysis
        if (data.apiTests.alphaVantage) {
          console.log(`📈 ALPHA VANTAGE: ${data.apiTests.alphaVantage.keyFound ? '🔑 Key Found' : '❌ No Key'}`);
          if (data.apiTests.alphaVantage.keyFound) {
            console.log(`   Status: ${data.apiTests.alphaVantage.status || 'Unknown'}`);
            console.log(`   Rate Limited: ${data.apiTests.alphaVantage.rateLimited ? '⚠️ YES' : '✅ NO'}`);
            if (data.apiTests.alphaVantage.body) {
              console.log(`   Response Sample:`, JSON.stringify(data.apiTests.alphaVantage.body).substring(0, 200));
            }
          }
        }
        
        // FMP Analysis
        if (data.apiTests.fmp) {
          console.log(`💼 FMP: ${data.apiTests.fmp.keyFound ? '🔑 Key Found' : '❌ No Key'}`);
          if (data.apiTests.fmp.keyFound) {
            console.log(`   Status: ${data.apiTests.fmp.status || 'Unknown'}`);
            if (data.apiTests.fmp.body) {
              console.log(`   Response Sample:`, JSON.stringify(data.apiTests.fmp.body).substring(0, 200));
            }
          }
        }
        
        // OpenAI Analysis
        if (data.apiTests.openai) {
          console.log(`🧠 OPENAI: ${data.apiTests.openai.keyFound ? '🔑 Key Found' : '❌ No Key'}`);
          if (data.apiTests.openai.keyFound) {
            console.log(`   Status: ${data.apiTests.openai.status || 'Unknown'}`);
          }
        }
      }
      
      // Show available environment variables
      if (data.apiRelatedVars) {
        console.log("\n🔐 API-RELATED ENVIRONMENT VARIABLES:");
        Object.entries(data.apiRelatedVars).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
      }
      
      // Show recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        console.log("\n💡 RECOMMENDATIONS:");
        data.recommendations.forEach((rec: string) => {
          console.log(`   ${rec}`);
        });
      }
    }
  } catch (e) {
    console.error("Debug function call error:", e);
  }
  
  // 3. TEST MARKET DATA FUNCTION DIRECTLY
  console.log("\n3️⃣ TESTING MARKET DATA FUNCTION:");
  try {
    const { data: marketData, error: marketError } = await supabase.functions.invoke('real-market-data', {
      body: { symbol: 'AAPL', type: 'quote' }
    });
    
    if (marketError) {
      console.error("❌ Market data function failed:", marketError);
    } else {
      console.log("✅ Market data function response:", marketData);
    }
  } catch (e) {
    console.error("Market data function error:", e);
  }
  
  // 4. CHECK LOCAL ENVIRONMENT
  console.log("\n4️⃣ CHECKING CLIENT ENVIRONMENT:");
  console.log("Window location:", window.location.href);
  console.log("User agent:", navigator.userAgent);
  console.log("Supabase client initialized:", !!supabase);
  
  console.log("\n🔍 ========== END INVESTIGATION ==========");
  
  return "Investigation complete - check console for full details";
};

// Helper function to find keys by patterns
const findKeyByPatterns = (secrets: any, patterns: string[]): string | null => {
  for (const [key, value] of Object.entries(secrets)) {
    for (const pattern of patterns) {
      if (key.toLowerCase().includes(pattern.toLowerCase()) && value) {
        console.log(`Found key matching '${pattern}': ${key}`);
        return value as string;
      }
    }
  }
  return null;
};

// Make it available globally for easy access
(window as any).forensicAPIInvestigation = forensicAPIInvestigation;