import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/common/mobile-fixes.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />
  // </StrictMode>,
)
