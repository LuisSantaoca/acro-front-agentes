import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'  // ← importa tus variables CSS por tenant
import './index.css'
import AppRouter from './AppRouter'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
