import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MetricCardProps } from "@/types";
import { cn } from "@/lib/utils";

/**
 * MetricCard Component
 * 
 * A reusable card component for displaying financial metrics with trends and icons.
 * Features hover animations, loading states, and semantic color coding.
 * 
 * @param title - The metric title (e.g., "Portfolio Value")
 * @param value - The metric value (can be string or number)
 * @param change - The change amount/percentage
 * @param trend - Visual trend indicator ('up', 'down', 'neutral')
 * @param icon - React icon component
 * @param loading - Loading state flag
 * @param className - Additional CSS classes
 */
export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  loading = false,
  className 
}: MetricCardProps) => {
  if (loading) {
    return (
      <Card className={cn("p-6 bg-card-gradient border-border", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn(
      "p-6 bg-card-gradient border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};