import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

/**
 * Real-time Status Indicator Component
 * 
 * Shows the current connection status for real-time updates
 */
export const RealtimeStatus = () => {
  const { isConnected, connectionState } = useConnectionStatus();

  const getStatusColor = () => {
    switch (connectionState) {
      case 'SUBSCRIBED':
        return 'bg-success';
      case 'CHANNEL_ERROR':
      case 'TIMED_OUT':
        return 'bg-destructive';
      case 'CONNECTING':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'SUBSCRIBED':
        return 'Live Updates Active';
      case 'CHANNEL_ERROR':
        return 'Connection Error';
      case 'TIMED_OUT':
        return 'Connection Timeout';
      case 'CONNECTING':
        return 'Connecting...';
      case 'CLOSED':
        return 'Disconnected';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <Badge 
      variant={isConnected ? "default" : "destructive"} 
      className="space-x-2 px-3 py-1 font-medium"
    >
      {isConnected ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span className="text-sm">{getStatusText()}</span>
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
    </Badge>
  );
};

export default RealtimeStatus;