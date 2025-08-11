import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to monitor real-time connection status
 */
export const useConnectionStatus = () => {
  const [connectionState, setConnectionState] = useState('CLOSED');
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setConnectionState('CLOSED');
      setIsConnected(false);
      return;
    }

    // Create a test channel to monitor connection status
    const statusChannel = supabase
      .channel('connection-status')
      .on('presence', { event: 'sync' }, () => {
        setConnectionState('SUBSCRIBED');
        setIsConnected(true);
      })
      .on('presence', { event: 'join' }, () => {
        setConnectionState('SUBSCRIBED');
        setIsConnected(true);
      })
      .on('presence', { event: 'leave' }, () => {
        setConnectionState('CLOSED');
        setIsConnected(false);
      })
      .subscribe((status) => {
        console.log('Realtime connection status:', status);
        setConnectionState(status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Cleanup
    return () => {
      supabase.removeChannel(statusChannel);
    };
  }, [user]);

  return {
    connectionState,
    isConnected
  };
};

export default useConnectionStatus;