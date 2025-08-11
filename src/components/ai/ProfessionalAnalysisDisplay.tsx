import { InstitutionalAnalysisDisplay } from "./InstitutionalAnalysisDisplay";

interface ProfessionalAnalysisDisplayProps {
  content: string;
  timestamp: string;
  analysisType?: 'portfolio' | 'market' | 'risk' | 'opportunities' | 'comprehensive';
  title?: string;
  confidenceScore?: number;
  onAskQuestion?: (question: string) => void;
}

export function ProfessionalAnalysisDisplay({ 
  content, 
  timestamp, 
  analysisType = 'comprehensive',
  title,
  confidenceScore,
  onAskQuestion 
}: ProfessionalAnalysisDisplayProps) {
  return (
    <InstitutionalAnalysisDisplay
      content={content}
      analysisType={analysisType}
      timestamp={timestamp}
      title={title}
      confidenceScore={confidenceScore}
      onAskQuestion={onAskQuestion}
    />
  );
}