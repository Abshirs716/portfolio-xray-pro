import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/hooks/usePortfolio';
import { AlertTriangle } from 'lucide-react';

/**
 * ❌ DISABLED Sample Data Button Component
 * 
 * This component is DISABLED to prevent adding fake data.
 * User should only use their REAL uploaded transaction data.
 */
export const SampleDataButton = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "🚨 Sample Data Disabled",
      description: "Use your real uploaded transaction file instead of demo data!",
      variant: "destructive",
    });
  };

  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="space-x-2 opacity-50"
      disabled
    >
      <AlertTriangle className="h-4 w-4" />
      <span>Sample Data Disabled</span>
    </Button>
  );
};

export default SampleDataButton;