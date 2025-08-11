import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { MessageCircle, Send, Bot, User, Loader2, Brain, Mic, MicOff, Maximize2, Plus, Sparkles, TrendingUp, AlertTriangle, BarChart3, Paperclip } from "lucide-react";
import { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";
import { useRealtimeAIChat } from "@/hooks/useRealtimeAIChat";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { EnhancedAnalysisDisplay } from "./EnhancedAnalysisDisplay";
import { InstitutionalPromptsService } from './InstitutionalPromptsService';

interface ChatInterfaceProps {
  title?: string;
  placeholder?: string;
  className?: string;
}

export interface ChatInterfaceRef {
  triggerAnalysis: (message: string) => void;
}

/**
 * ChatInterface Component
 * 
 * A sophisticated AI chat interface for financial analysis conversations.
 * Features real OpenAI integration, typing indicators, and message persistence.
 */
export const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({ 
  title = "AI Financial Analyst",
  placeholder = "Ask about your portfolio, market trends, or financial analysis...",
  className 
}, ref) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, sendMessage, clearMessages, isLoading: aiLoading } = useRealtimeAIChat();
  const { 
    connectToRealtime, 
    disconnect, 
    sendTextMessage, 
    isConnected, 
    isRecording, 
    aiSpeaking, 
    transcript 
  } = useRealtimeChat();
  
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const [isCombinedDialogOpen, setIsCombinedDialogOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Array<{url: string, name: string, type: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modelDisplayNames = {
    'gpt-4o-mini': 'GPT-4o Mini (Fast)',
    'gpt-4.1-2025-04-14': 'GPT-4.1',
    'chatgpt-agent': '🤖 ChatGPT Agent (Actions)',
    'o3-2025-04-16': '🧠 OpenAI o3 (Reasoning)',
    'gpt-4o-realtime-preview-2024-12-17': '🎤 OpenAI Realtime (Voice)',
    'claude-sonnet-4-20250514': 'Claude Sonnet 4',
    'claude-opus-4-20250514': 'Claude Opus 4',
    'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku'
  };

  const isRealtimeMode = selectedModel === 'gpt-4o-realtime-preview-2024-12-17';

  // Initialize conversation on mount
  useEffect(() => {
    if (user && !conversationId) {
      setConversationId('demo-conversation');
    }
  }, [user, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAnalysisType = (content: string): 'portfolio' | 'market' | 'risk' | 'opportunities' => {
    const lowerContent = content.toLowerCase();
    
    // Portfolio Analysis Detection
    if (lowerContent.includes('portfolio') || lowerContent.includes('asset allocation') || 
        lowerContent.includes('performance attribution') || lowerContent.includes('holdings')) return 'portfolio';
    
    // Market Trends Detection  
    if (lowerContent.includes('market') || lowerContent.includes('forecast') || 
        lowerContent.includes('trends') || lowerContent.includes('macro') || 
        lowerContent.includes('outlook')) return 'market';
    
    // Risk Assessment Detection
    if (lowerContent.includes('risk') || lowerContent.includes('volatility') || 
        lowerContent.includes('stress') || lowerContent.includes('var') || 
        lowerContent.includes('drawdown')) return 'risk';
    
    // Investment Opportunities Detection
    if (lowerContent.includes('opportunities') || lowerContent.includes('recommend') || 
        lowerContent.includes('alpha') || lowerContent.includes('tactical') || 
        lowerContent.includes('strategic')) return 'opportunities';
    
    return 'portfolio'; // Default to portfolio analysis
  };

  const getAnalysisTitle = (content: string): string => {
    const analysisType = getAnalysisType(content);
    const titles = {
      'portfolio': 'PORTFOLIO ANALYSIS REPORT',
      'market': 'MARKET TRENDS ANALYSIS',  
      'risk': 'RISK ASSESSMENT REPORT',
      'opportunities': 'INVESTMENT OPPORTUNITIES ANALYSIS',
      'comprehensive': 'COMPREHENSIVE INVESTMENT ANALYSIS'
    };
    return titles[analysisType];
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Expose triggerAnalysis method via ref
  useImperativeHandle(ref, () => ({
    triggerAnalysis: (message: string) => {
      setInput(message);
      // Use setTimeout to ensure the input is set before sending
      setTimeout(() => {
        if (!message.trim() || !user) return;

        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          conversation_id: conversationId || 'demo',
          role: 'user',
          content: message,
          timestamp: new Date().toISOString()
        };

        // Clear previous messages for fresh analysis
        clearMessages();
        setInput('');
        setIsTyping(true);

        sendMessage(message, getAnalysisType(message)).then(aiResponse => {
          // Response is already cleaned by the hook

          toast({
            title: "Analysis Complete",
            description: "Your financial analysis is ready",
            duration: 2000,
          });
        }).catch(error => {
          console.error('Analysis error:', error);
        }).finally(() => {
          setIsTyping(false);
        });
      }, 100);
    }
  }), [user, conversationId, selectedModel, sendMessage, clearMessages, setInput, setIsTyping, toast]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    if (isRealtimeMode && isConnected) {
      // Send text message via realtime WebSocket
      sendTextMessage(input);
      setInput('');
      return;
    }

    // Include attached files in the message
    let messageContent = input;
    if (attachedFiles.length > 0) {
      messageContent += '\n\nAttached files:\n';
      attachedFiles.forEach(file => {
        messageContent += `- ${file.name} (${file.type}): ${file.url}\n`;
      });
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: conversationId || 'demo',
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    // Clear previous messages for fresh analysis
    clearMessages();
    const currentInput = messageContent;
    setInput('');
    setAttachedFiles([]); // Clear attached files
    setIsTyping(true);

    try {
      const aiResponse = await sendMessage(currentInput, getAnalysisType(currentInput));

      // Show success feedback
      toast({
        title: "AI Response",
        description: "Financial analysis complete",
        duration: 2000,
      });

    } catch (error: any) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // System now uses InstitutionalPromptsService for all prompts and sanitization

  const analysisOptions = [
    { 
      id: 'portfolio', 
      label: 'Portfolio Analysis', 
      icon: BarChart3
    },
    { 
      id: 'market', 
      label: 'Market Trends', 
      icon: TrendingUp
    },
    { 
      id: 'risk', 
      label: 'Risk Assessment', 
      icon: AlertTriangle
    },
    { 
      id: 'opportunities', 
      label: 'Investment Opportunities', 
      icon: Sparkles
    }
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCombinedAnalysis = async () => {
    if (selectedAnalysisTypes.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one analysis type",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use AI analysis",
        variant: "destructive",
      });
      return;
    }

    const selectedPrompts = analysisOptions
      .filter(option => selectedAnalysisTypes.includes(option.id))
      .map(option => option.label);

    const combinedPrompt = `Please provide a comprehensive analysis covering: ${selectedPrompts.join(', ')}. Include detailed insights for each area and how they relate to my overall financial situation.`;
    
    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      conversation_id: conversationId || 'demo',
      role: 'user',
      content: combinedPrompt,
      timestamp: new Date().toISOString()
    };

    // Clear previous messages for fresh analysis
    clearMessages();
    setSelectedAnalysisTypes([]);
    setIsCombinedDialogOpen(false);
    setIsTyping(true);

    try {
      const aiResponse = await sendMessage(combinedPrompt, 'portfolio');

      // Show success feedback
      toast({
        title: "Combined Analysis Complete",
        description: "Your comprehensive analysis is ready",
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Combined analysis error:', error);

      toast({
        title: "Analysis Error",
        description: "Failed to generate combined analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleExpandResponse = (messageContent: string) => {
    // Direct users to use the PDF download instead of the broken new tab
    toast({
      title: "Professional PDF Available",
      description: "Use the PDF download button (📄 PDF) in the analysis display above for a beautifully formatted report",
      duration: 4000,
    });
  };

  const handleFileUploaded = (url: string, fileName: string, fileType: string) => {
    setAttachedFiles(prev => [...prev, { url, name: fileName, type: fileType }]);
    setIsFileUploadOpen(false);
  };

  // Show welcome message only when no messages exist
  const showWelcomePrompt = messages.length === 0;

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">Advanced financial analysis powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">⚡ GPT-4o Mini (Fast)</SelectItem>
              <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1</SelectItem>
              <SelectItem value="chatgpt-agent">🤖 ChatGPT Agent</SelectItem>
              <SelectItem value="o3-2025-04-16">🧠 OpenAI o3</SelectItem>
              <SelectItem value="gpt-4o-realtime-preview-2024-12-17">🎤 Voice Chat</SelectItem>
              <SelectItem value="claude-sonnet-4-20250514">Claude Sonnet 4</SelectItem>
              <SelectItem value="claude-opus-4-20250514">Claude Opus 4</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="bg-success/10 text-success text-xs">
            <div className="w-1.5 h-1.5 bg-success rounded-full mr-1.5" />
            Ready
          </Badge>
        </div>
      </div>

      {/* Quick Actions - Always Visible */}
      <div className="p-4 border-b border-border/10 bg-muted/30">
        <div className="flex flex-wrap gap-2 mb-3">
          {analysisOptions.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              size="sm"
              disabled={isTyping || aiLoading}
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Authentication Required",
                    description: "Please log in to use AI analysis",
                    variant: "destructive",
                  });
                  return;
                }

                // Immediate visual feedback
                toast({
                  title: "Analysis Starting",
                  description: `Generating ${option.label}...`,
                  duration: 1000,
                });

                clearMessages();
                setIsTyping(true);

                sendMessage(`Generate ${option.label}`, option.id as any).then(aiResponse => {

                  toast({
                    title: "Analysis Complete",
                    description: "Your financial analysis is ready",
                    duration: 2000,
                  });
                }).catch(error => {
                  console.error('Analysis error:', error);
                }).finally(() => {
                  setIsTyping(false);
                });
              }}
              className="text-xs h-8 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <option.icon className="h-3 w-3" />
              {isTyping && option.label === 'Portfolio Analysis' ? 'Analyzing...' : option.label}
            </Button>
          ))}
        </div>
        
        {/* Combined Analysis */}
        <div className="flex items-center gap-2">
         <Dialog open={isCombinedDialogOpen} onOpenChange={setIsCombinedDialogOpen}>
             <DialogTrigger asChild>
               <Button variant="secondary" size="sm" className="text-xs gap-1.5">
                 <Plus className="h-3 w-3" />
                 Multi-Analysis
               </Button>
             </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Combined Analysis</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Select multiple analysis types to get comprehensive insights:
                </p>
                {analysisOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={selectedAnalysisTypes.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAnalysisTypes(prev => [...prev, option.id]);
                        } else {
                          setSelectedAnalysisTypes(prev => prev.filter(id => id !== option.id));
                        }
                      }}
                    />
                    <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </label>
                  </div>
                ))}
                <Button 
                  onClick={handleCombinedAnalysis} 
                  className="w-full"
                  disabled={selectedAnalysisTypes.length === 0}
                >
                  Generate Combined Analysis
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <span className="text-xs text-muted-foreground">
            Get combined insights across multiple areas
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {/* Welcome Message */}
            {showWelcomePrompt && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Financial Analyst</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                  I can analyze your portfolio, explain market trends, assess risk, and provide personalized investment insights. Use the quick actions above to get started.
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className="space-y-3">
                {message.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl p-4">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="mt-2 text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">AI Financial Analysis</span>
                          <Badge variant="outline" className="text-xs">
                            {modelDisplayNames[selectedModel]?.replace(/[🤖🧠🎤]/g, '').trim() || selectedModel}
                          </Badge>
                        </div>
                        {/* Professional Analysis Display for AI Responses */}
                        <EnhancedAnalysisDisplay 
                          content={message.content}
                          timestamp={message.timestamp}
                          analysisType={getAnalysisType(message.content)}
                          title={getAnalysisTitle(message.content)}
                          confidenceScore={85}
                          onAskQuestion={(question) => {
                            setInput(question);
                            // Auto-focus textarea after setting the question
                            setTimeout(() => textareaRef.current?.focus(), 100);
                          }}
                        />
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Use PDF button above for formatted report
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {(isTyping || aiLoading) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-4 w-4 text-primary animate-spin" />
                </div>
                <Card className="p-4 bg-card border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing your financial data...</span>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Floating Quick Actions - Always visible when scrolled */}
      {!showWelcomePrompt && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border/20 z-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {analysisOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Authentication Required",
                      description: "Please log in to use AI analysis",
                      variant: "destructive",
                    });
                    return;
                  }

                  clearMessages();
                  setIsTyping(true);

                  sendMessage(`Generate ${option.label}`, option.id as any).then(aiResponse => {

                    toast({
                      title: "Analysis Complete",
                      description: "Your financial analysis is ready",
                      duration: 2000,
                    });
                  }).catch(error => {
                    console.error('Analysis error:', error);
                  }).finally(() => {
                    setIsTyping(false);
                  });
                }}
                className="text-xs h-8 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
              >
                <option.icon className="h-3 w-3" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border/20 bg-card/50">
        {/* Attached Files Display */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                📎 {file.name}
                <button
                  onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        
        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 resize-none min-h-[60px] text-sm bg-background"
            disabled={isTyping || !user}
          />
          <div className="flex flex-col gap-2">
            <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-3"
                  disabled={!user}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <FileUpload 
                  onFileUploaded={handleFileUploaded}
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.txt,.doc,.docx"
                  maxSize={10}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping || aiLoading || !user}
              className="px-6"
              size="default"
            >
              {(isTyping || aiLoading) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';