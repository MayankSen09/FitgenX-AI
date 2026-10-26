import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppStore } from '../../store/useAppStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Route protection wrapper. Ensures that only authenticated users can access
 * private routes, redirecting unauthenticated users to the login screen,
 * and users without an athlete profile to the onboarding/details screen.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { profile } = useAppStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-secondary text-xs uppercase tracking-widest font-bold">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile || !profile.name || !profile.name.trim()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
