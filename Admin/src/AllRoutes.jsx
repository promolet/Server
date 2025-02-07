import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BillingPage from '../src/Pages/Billing/billing.jsx';
import Dashbord from './Pages/Dashbord.jsx';
import Register from './Pages/Auth/Register.jsx';
import Login from './Pages/Auth/Login.jsx';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken'); // Check token directly

  return token ? element : <Navigate to="/login" replace />;
};

function AllRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Dashbord />} />} />
        <Route path="/billing/:id" element={<ProtectedRoute element={<BillingPage />} />} />
        <Route path="/auth" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AllRoutes;
