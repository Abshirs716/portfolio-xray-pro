import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Overview from "@/components/Views/Overview";
import Predictions from "@/components/Views/Predictions";
import RiskAnalysis from "@/components/Views/RiskAnalysis";
import MarketSentiment from "@/components/Views/MarketSentiment";
import Recommendations from "@/components/Views/Recommendations";
import Sentiment from "@/components/Views/Sentiment";
import AppLayout from "@/components/Navigation/AppLayout";

type ViewType = 'overview' | 'predictions' | 'technical' | 'risk' | 'sentiment' | 'recommendations' | 'transactions';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for view in state (from navigation) or URL params
    const state = location.state as { view?: ViewType } | null;
    const urlParams = new URLSearchParams(location.search);
    const viewFromUrl = urlParams.get('view') as ViewType;
    
    const targetView = state?.view || viewFromUrl;
    if (targetView && ['overview', 'predictions', 'technical', 'risk', 'sentiment', 'recommendations'].includes(targetView)) {
      setCurrentView(targetView);
    }
  }, [location]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'predictions':
        return <Predictions />;
      case 'technical':
        return <Sentiment />; // Technical analysis component
      case 'risk':
        return <RiskAnalysis />;
      case 'sentiment':
        return <MarketSentiment />;
      case 'recommendations':
        return <Recommendations />;
      default:
        return <Overview />;
    }
  };

  const handleViewChange = (view: ViewType) => {
    if (view === 'transactions') {
      // Navigate to the dedicated transactions route
      navigate('/transactions');
    } else {
      setCurrentView(view);
    }
  };

  return (
    <AppLayout currentView={currentView} onViewChange={handleViewChange}>
      {renderCurrentView()}
    </AppLayout>
  );
};

export default Index;
