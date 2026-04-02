import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar           from './components/Navbar';
import ProtectedRoute   from './components/ProtectedRoute';
import HomePage         from './pages/HomePage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import DonorDashboard   from './pages/DonorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard   from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        <Route path="/donor"  element={
          <ProtectedRoute role="DONOR"><DonorDashboard /></ProtectedRoute>
        } />
        <Route path="/patient" element={
          <ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>
        } />
        <Route path="/hospital" element={
          <ProtectedRoute role="HOSPITAL"><HospitalDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
