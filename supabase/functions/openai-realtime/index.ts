import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Setting up OpenAI Realtime WebSocket proxy');

    // Create WebSocket connection to OpenAI
    const openaiUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17";
    
    // Upgrade HTTP connection to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    let openaiWs: WebSocket | null = null;

    socket.onopen = async () => {
      console.log('Client WebSocket connected');
      
      try {
        // Connect to OpenAI Realtime API
        openaiWs = new WebSocket(openaiUrl, {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1",
          },
        });

        openaiWs.onopen = () => {
          console.log('Connected to OpenAI Realtime API');
        };

        openaiWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Message from OpenAI:', data.type);
            
            // Forward OpenAI messages to client
            socket.send(event.data);
          } catch (error) {
            console.error('Error parsing OpenAI message:', error);
          }
        };

        openaiWs.onerror = (error) => {
          console.error('OpenAI WebSocket error:', error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'OpenAI connection error'
          }));
        };

        openaiWs.onclose = () => {
          console.log('OpenAI WebSocket closed');
          socket.close();
        };

      } catch (error) {
        console.error('Error connecting to OpenAI:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to connect to OpenAI'
        }));
      }
    };

    socket.onmessage = (event) => {
      try {
        console.log('Message from client:', event.data);
        
        // Forward client messages to OpenAI
        if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(event.data);
        } else {
          console.error('OpenAI WebSocket not ready');
        }
      } catch (error) {
        console.error('Error forwarding message to OpenAI:', error);
      }
    };

    socket.onclose = () => {
      console.log('Client WebSocket closed');
      if (openaiWs) {
        openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
      if (openaiWs) {
        openaiWs.close();
      }
    };

    return response;

  } catch (error) {
    console.error('Error in openai-realtime function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});