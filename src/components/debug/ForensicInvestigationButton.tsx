import { Button } from "@/components/ui/button";
import { forensicAPIInvestigation } from "@/utils/forensicAPIInvestigation";
import { toast } from "sonner";

export const ForensicInvestigationButton = () => {
  const runInvestigation = async () => {
    toast.info("🔍 Starting API Forensic Investigation...");
    try {
      const result = await forensicAPIInvestigation();
      toast.success("Investigation complete! Check console for detailed results.");
      console.log("🎯 INVESTIGATION RESULT:", result);
    } catch (error) {
      toast.error("Investigation failed: " + error);
      console.error("🚨 INVESTIGATION FAILED:", error);
    }
  };

  return (
    <div className="p-4 border-2 border-destructive bg-destructive/10 rounded-lg">
      <h3 className="text-lg font-bold text-destructive mb-2">🚨 API FORENSIC INVESTIGATION</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Run comprehensive investigation to find root cause of all API failures
      </p>
      <Button 
        onClick={runInvestigation}
        variant="destructive"
        className="w-full"
      >
        🔍 RUN FORENSIC INVESTIGATION NOW
      </Button>
    </div>
  );
};