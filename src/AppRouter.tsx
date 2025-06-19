// Archivo: src/AppRouter.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importaciones de componentes de páginas activas
import LandingChatInteractivoPage from './pages/LandingChatInteractivoPage'
import LandingInstitucional from './pages/LandingInstitucional/ui/LandingInstitucional'
import KokitosCase from './pages/tenants/kokitos/KokitosCase' // Nueva página creada

// ====== ROUTER PRINCIPAL DEL APLICATIVO ======
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que carga la landing institucional */}
        <Route path="/" element={<LandingInstitucional />} />

        {/* Ruta específica para el chat interactivo */}
        <Route path="/landing/chat-interactivo" element={<LandingChatInteractivoPage />} />

        {/* NUEVA Ruta para página de caso de éxito Kokitos */}
        <Route path="/kokitos" element={<KokitosCase />} />

        {/*
          Rutas comentadas temporalmente, activar según necesidad:
          <Route path="/landing" element={<TenantIndex />} />
          <Route path="/kokitos/openai-chat" element={<OpenAIChatPage />} />
          <Route path="/pruebas" element={<ProtectedLanding />} />
          <Route path="*" element={<TenantIndex />} />
        */}
      </Routes>
    </Router>
  )
}
