import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TechnicalAnalysisLearning = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-4xl font-bold mb-4">Technical Analysis Learning</h1>
        <p className="mb-6">Learn about technical analysis, chart patterns, and trading indicators.</p>
        
        {/* Apply Your Knowledge Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-primary/20 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Apply Your Knowledge</h2>
          <p className="text-muted-foreground mb-4">
            Practice technical analysis with your actual portfolio and market data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/', { state: { view: 'technical' } })} className="w-full">
              View Your Technical Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/transactions')} className="w-full">
              Track More Symbols
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysisLearning;