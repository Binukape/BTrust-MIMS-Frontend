import { Navigate, Outlet } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />;
  return <Outlet />;
}
