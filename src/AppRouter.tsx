import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenantIndex from './pages/TenantIndex';
import LandingInstitucional from './pages/LandingInstitucional/ui/LandingInstitucional';

// ====== ROUTER PRINCIPAL ======
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingInstitucional />} />
        <Route path="*" element={<TenantIndex />} />
      </Routes>
    </Router>
  );
}
