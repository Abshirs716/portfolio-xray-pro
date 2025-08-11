import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type ViewType = 'overview' | 'predictions' | 'technical' | 'risk' | 'sentiment' | 'recommendations' | 'transactions'

interface MenuItem {
  id: ViewType
  label: string
  icon: string
  description: string
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Portfolio Overview', icon: '📊', description: 'Real-time portfolio metrics' },
  { id: 'transactions', label: 'Transactions', icon: '💳', description: 'Manage your trades & holdings' },
  { id: 'predictions', label: 'AI Predictions', icon: '🔮', description: 'Price forecasts & targets' },
  { id: 'technical', label: 'Technical Analysis', icon: '📈', description: 'Charts & indicators' },
  { id: 'risk', label: 'Risk Analysis', icon: '⚠️', description: 'Portfolio risk metrics' },
  { id: 'sentiment', label: 'Market Sentiment', icon: '🎭', description: 'News & social analysis' },
  { id: 'recommendations', label: 'AI Recommendations', icon: '💡', description: 'Personalized insights' }
]

interface AppLayoutProps {
  children: React.ReactNode
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export default function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleViewChange = (viewId: ViewType) => {
    onViewChange(viewId)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold bg-financial-gradient bg-clip-text text-transparent">
              Quantum Wealth AI
            </h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {menuItems.find(item => item.id === currentView)?.label}
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div className={`fixed left-0 top-16 bottom-0 w-80 bg-background/95 backdrop-blur-lg border-r border-border transform transition-transform duration-300 z-40 ${
        menuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                currentView === item.id 
                  ? 'bg-primary/10 border border-primary/30 text-primary' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}