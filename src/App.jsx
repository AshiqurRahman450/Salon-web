import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketingHome from './pages/MarketingHome';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerApp from './pages/CustomerApp';
import SalonDetails from './pages/SalonDetails';
import CustomerAppointments from './pages/CustomerAppointments';
import SalonDashboard from './pages/SalonDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
// Import other pages as they are built...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<CustomerApp />} />
        <Route path="/app/salon/:id" element={<SalonDetails />} />
        <Route path="/app/appointments" element={<CustomerAppointments />} />
        <Route path="/salon-dashboard" element={<SalonDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* We will add routes for dashboards here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
