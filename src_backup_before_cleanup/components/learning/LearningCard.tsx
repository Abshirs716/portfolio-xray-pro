import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, LucideIcon } from "lucide-react";

interface LearningCardProps {
  title: string;
  description: string;
  path: string;
  icon?: LucideIcon;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime?: string;
  className?: string;
}

export const LearningCard = ({ 
  title, 
  description, 
  path, 
  icon: Icon = BookOpen,
  difficulty = "Beginner",
  estimatedTime = "5-10 min",
  className = ""
}: LearningCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-success/10 text-success border-success/30";
      case "Intermediate": return "bg-warning/10 text-warning border-warning/30";
      case "Advanced": return "bg-destructive/10 text-destructive border-destructive/30";
      default: return "bg-secondary/10 text-secondary border-secondary/30";
    }
  };

  return (
    <Card className={`p-4 bg-card-gradient border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md group ${className}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{estimatedTime}</span>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate(path)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <span className="text-xs">Learn More</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Card>
  );
};