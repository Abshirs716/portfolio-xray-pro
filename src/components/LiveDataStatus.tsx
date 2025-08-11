import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Wifi, WifiOff, Clock } from 'lucide-react';

interface LiveDataStatusProps {
  isLive: boolean;
  lastUpdated?: string;
  source?: string;
  errors?: string[];
}

export const LiveDataStatus: React.FC<LiveDataStatusProps> = ({
  isLive,
  lastUpdated,
  source,
  errors = []
}) => {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Wifi className="w-4 h-4 text-emerald-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="font-semibold">
              {isLive ? 'Live Market Data' : 'Live Data Unavailable'}
            </span>
            <Badge variant={isLive ? 'default' : 'destructive'}>
              {isLive ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {source && (
          <p className="text-xs text-muted-foreground mt-2">
            Source: {source}
          </p>
        )}
        
        {!isLive && errors.length > 0 && (
          <div className="mt-3 p-2 bg-destructive/10 rounded border border-destructive/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Live Data Sources Failed:
              </span>
            </div>
            <ul className="text-xs text-destructive space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
            <p className="text-xs text-destructive mt-2 font-medium">
              🚨 NO FALLBACK DATA PROVIDED - WAITING FOR LIVE SOURCES
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};