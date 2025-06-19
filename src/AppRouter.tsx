import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import TenantIndex from './pages/TenantIndex'
// import ProtectedLanding from './pages/PruebasAcro/ProtectedLanding'
// import OpenAIChatPage from './pages/tenants/kokitos/OpenAIChatPage'
import LandingChatInteractivoPage from './pages/LandingChatInteractivoPage'
import LandingInstitucional from './pages/LandingInstitucional/ui/LandingInstitucional'

// ====== ROUTER PRINCIPAL ======
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingInstitucional />} />
        {/* <Route path="/landing" element={<TenantIndex />} /> */}
        {/* <Route path="/kokitos/openai-chat" element={<OpenAIChatPage />} /> */}
        <Route path="/landing/chat-interactivo" element={<LandingChatInteractivoPage />} />
        {/* <Route path="/pruebas" element={<ProtectedLanding />} /> */}
        {/* <Route path="*" element={<TenantIndex />} /> */}
      </Routes>
    </Router>
  )
}
