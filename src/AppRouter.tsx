import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TenantIndex from './pages/TenantIndex'
import ProtectedLanding from './pages/PruebasAcro/ProtectedLanding'
import OpenAIChatPage from './pages/tenants/kokitos/OpenAIChatPage'

// ====== ROUTER PRINCIPAL ======
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedLanding />} />
        <Route path="/landing" element={<TenantIndex />} />
        <Route path="/kokitos/openai-chat" element={<OpenAIChatPage />} />
        <Route path="*" element={<TenantIndex />} />
      </Routes>
    </Router>
  )
}
