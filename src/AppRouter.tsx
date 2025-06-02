import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TenantIndex from './pages/TenantIndex'

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<TenantIndex />} />
      </Routes>
    </Router>
  )
}
