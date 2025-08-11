import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview"
import { AssetAllocation } from "@/components/charts/AssetAllocation"
import { PerformanceChart } from "@/components/charts/PerformanceChart"
import { SymbolsGrid } from "@/components/charts/SymbolsGrid"
import { SectorAllocation } from "@/components/charts/SectorAllocation"
import { RiskMetrics } from "@/components/risk/RiskMetrics"
import { InstitutionalPortfolioWidget } from "@/components/ai/InstitutionalPortfolioWidget"
import { DashboardSection } from "@/components/Dashboard/DashboardSection"
import { DashboardGrid } from "@/components/Dashboard/DashboardGrid"
import { LearningCard } from "@/components/learning/LearningCard"
import { usePortfolioMetrics } from "@/hooks/usePortfolioMetrics"
import { TrendingUp, BarChart3, PieChart, Shield, Zap, Wallet, BookOpen } from "lucide-react"


const Overview = () => {
  const { portfolio } = usePortfolioMetrics();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Portfolio Dashboard
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real-time insights and professional investment management powered by AI
          </p>
        </div>

        {/* Portfolio Overview Section */}
        <DashboardSection 
          title="Portfolio Overview" 
          subtitle="Your portfolio performance and key metrics"
          icon={Wallet}
        >
          <PortfolioOverview />
        </DashboardSection>

        {/* Portfolio Analysis Section */}
        <DashboardSection 
          title="Portfolio Analysis" 
          subtitle="In-depth analysis of your investments and risk profile"
          icon={BarChart3}
        >
          <DashboardGrid columns={2}>
            <PerformanceChart />
            <RiskMetrics />
          </DashboardGrid>
          
          <div className="mt-6">
            <InstitutionalPortfolioWidget />
          </div>
        </DashboardSection>

        {/* Asset Allocation Section */}
        <DashboardSection 
          title="Asset Allocation" 
          subtitle="Diversification breakdown and sector analysis"
          icon={PieChart}
        >
          <DashboardGrid columns={2}>
            <AssetAllocation />
            <SectorAllocation />
          </DashboardGrid>
        </DashboardSection>

        {/* Holdings Details Section */}
        <DashboardSection 
          title="Holdings Details" 
          subtitle="Individual stock performance in your portfolio"
          icon={TrendingUp}
        >
          <SymbolsGrid />
        </DashboardSection>

        {/* Learning Section */}
        <DashboardSection
          title="Learn Investment Basics"
          subtitle="Enhance your investment knowledge with guided tutorials"
          icon={BookOpen}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LearningCard
              title="Portfolio Analysis"
              description="Learn how to analyze portfolio performance, diversification, and risk metrics effectively"
              path="/learn/portfolio-analysis"
              difficulty="Beginner"
              estimatedTime="8-12 min"
            />
            <LearningCard
              title="Asset Allocation"
              description="Understand different asset classes and how to build a balanced investment portfolio"
              path="/learn/asset-allocation"
              difficulty="Intermediate"
              estimatedTime="10-15 min"
            />
            <LearningCard
              title="Performance Metrics"
              description="Master key performance indicators like Sharpe ratio, alpha, beta, and tracking error"
              path="/learn/performance-metrics"
              difficulty="Advanced"
              estimatedTime="15-20 min"
            />
          </div>
        </DashboardSection>
      </div>
    </div>
  )
}

export default Overview