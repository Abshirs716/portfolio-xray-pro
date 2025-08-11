import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Bot, Zap } from 'lucide-react';

interface ClaudeStatusProps {
  source?: string;
  lastUpdated?: string;
  compact?: boolean;
}

export const ClaudeStatusIndicator: React.FC<ClaudeStatusProps> = ({ 
  source, 
  lastUpdated, 
  compact = false 
}) => {
  const [isClaudeActive, setIsClaudeActive] = useState(false);

  useEffect(() => {
    const checkClaudeStatus = () => {
      // Check if any recent data is from OpenAI GPT-4.1
      const isFromOpenAI = source?.includes('OpenAI GPT-4.1') || 
                           source?.includes('gpt-4.1') ||
                           source?.includes('OpenAI');
      setIsClaudeActive(isFromOpenAI);
    };

    checkClaudeStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkClaudeStatus, 30000);
    return () => clearInterval(interval);
  }, [source]);

  if (compact) {
    return isClaudeActive ? (
      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 animate-pulse">
        <Bot className="w-3 h-3 mr-1" />
        OpenAI Live
      </Badge>
    ) : null;
  }

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
      isClaudeActive 
        ? 'bg-emerald-50 border-emerald-200 animate-fade-in' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        {isClaudeActive ? (
          <>
            <div className="relative">
              <Bot className="w-5 h-5 text-emerald-600" />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-3 h-3 text-emerald-500 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="font-medium text-emerald-700">OpenAI GPT-4.1 Active</p>
              <p className="text-sm text-emerald-600">
                AI-powered real market data
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    • Updated {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
          </>
        ) : (
          <>
            <Bot className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-600">OpenAI GPT-4.1</p>
              <p className="text-sm text-gray-500">Waiting for data...</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};