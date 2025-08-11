import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/audioUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const connectToRealtime = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use voice chat",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Connecting to OpenAI Realtime...');
      
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Connect to our edge function WebSocket proxy
      const wsUrl = `wss://hutmrnnfwxzflftwvmha.functions.supabase.co/openai-realtime`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        toast({
          title: "Voice Chat Ready",
          description: "You can now speak with the AI",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data.type);

          switch (data.type) {
            case 'session.created':
              console.log('Session created, sending session update');
              // Send session configuration
              wsRef.current?.send(JSON.stringify({
                type: 'session.update',
                session: {
                  modalities: ["text", "audio"],
                  instructions: "You are a helpful AI financial analyst. Provide clear, concise advice about investments, portfolio management, and financial markets. Be conversational and friendly.",
                  voice: "alloy",
                  input_audio_format: "pcm16",
                  output_audio_format: "pcm16",
                  input_audio_transcription: {
                    model: "whisper-1"
                  },
                  turn_detection: {
                    type: "server_vad",
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 1000
                  },
                  temperature: 0.8,
                  max_response_output_tokens: "inf"
                }
              }));
              break;

            case 'session.updated':
              console.log('Session updated successfully');
              startRecording();
              break;

            case 'response.audio.delta':
              if (data.delta && audioContextRef.current) {
                setAiSpeaking(true);
                // Convert base64 to Uint8Array
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await playAudioData(audioContextRef.current, bytes);
              }
              break;

            case 'response.audio.done':
              console.log('Audio response complete');
              setAiSpeaking(false);
              break;

            case 'response.audio_transcript.delta':
              if (data.delta) {
                setTranscript(prev => prev + data.delta);
              }
              break;

            case 'response.audio_transcript.done':
              console.log('Transcript complete:', transcript);
              break;

            case 'input_audio_buffer.speech_started':
              console.log('User started speaking');
              break;

            case 'input_audio_buffer.speech_stopped':
              console.log('User stopped speaking');
              break;

            case 'error':
              console.error('WebSocket error:', data);
              toast({
                title: "Voice Chat Error",
                description: data.message || "Connection error",
                variant: "destructive",
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsRecording(false);
        setAiSpeaking(false);
        
        if (audioRecorderRef.current) {
          audioRecorderRef.current.stop();
          audioRecorderRef.current = null;
        }
      };

    } catch (error) {
      console.error('Error connecting to realtime:', error);
      toast({
        title: "Connection Failed",
        description: "Could not start voice chat",
        variant: "destructive",
      });
    }
  }, [user, toast, transcript]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Starting audio recording...');
      
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);
      console.log('Recording started successfully');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting from realtime chat');
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsConnected(false);
    setIsRecording(false);
    setAiSpeaking(false);
    setTranscript('');
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending text message:', text);
      
      wsRef.current.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text
            }
          ]
        }
      }));
      
      wsRef.current.send(JSON.stringify({
        type: 'response.create'
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectToRealtime,
    disconnect,
    sendTextMessage,
    isConnected,
    isRecording,
    aiSpeaking,
    transcript
  };
};