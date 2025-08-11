import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Initialize institutional PDF system
import './components/ai/InstitutionalIntegration'

createRoot(document.getElementById("root")!).render(<App />);
