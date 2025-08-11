import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { DataVerification } from "@/utils/dataVerification";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";
import AIPredictionsLearning from "./pages/learn/AIPredictions";
import AIRecommendationsLearning from "./pages/learn/AIRecommendations";
import MarketSentimentLearning from "./pages/learn/MarketSentiment";
import RiskAnalysisLearning from "./pages/learn/RiskAnalysis";
import TechnicalAnalysisLearning from "./pages/learn/TechnicalAnalysis";
import PortfolioAnalysisLearning from "./pages/learn/PortfolioAnalysis";
import AssetAllocationLearning from "./pages/learn/AssetAllocation";
import PerformanceMetricsLearning from "./pages/learn/PerformanceMetrics";

// Create QueryClient with default options to prevent context issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // 🚨 EMERGENCY: Start global fake data monitoring (temporarily disabled)
  useEffect(() => {
    console.log('🚨 Fake data monitoring temporarily disabled during fix...');
    // const stopMonitoring = DataVerification.startContinuousMonitoring();
    // return stopMonitoring;
  }, []);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/transactions" 
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/ai-predictions" 
                  element={
                    <ProtectedRoute>
                      <AIPredictionsLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/ai-recommendations" 
                  element={
                    <ProtectedRoute>
                      <AIRecommendationsLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/market-sentiment" 
                  element={
                    <ProtectedRoute>
                      <MarketSentimentLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/risk-analysis" 
                  element={
                    <ProtectedRoute>
                      <RiskAnalysisLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/technical-analysis" 
                  element={
                    <ProtectedRoute>
                      <TechnicalAnalysisLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/portfolio-analysis" 
                  element={
                    <ProtectedRoute>
                      <PortfolioAnalysisLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/asset-allocation" 
                  element={
                    <ProtectedRoute>
                      <AssetAllocationLearning />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn/performance-metrics" 
                  element={
                    <ProtectedRoute>
                      <PerformanceMetricsLearning />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
