import { Navigate } from 'react-router-dom';
import useAuth from '../context/useAuth';

// Redirects to /login if not authenticated
// Redirects to /dashboard if authenticated but not admin (for admin-only routes)
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="font-display text-brand-orange text-3xl tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
