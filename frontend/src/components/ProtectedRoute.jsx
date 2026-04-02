import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleRoutes = {
  DONOR:    '/donor',
  PATIENT:  '/patient',
  HOSPITAL: '/hospital',
  ADMIN:    '/admin',
};

export default function ProtectedRoute({ children, role }) {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  if (role && currentUser.role !== role) {
    return <Navigate to={roleRoutes[currentUser.role] || '/'} replace />;
  }

  return children;
}
