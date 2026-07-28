import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/services/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProtectedRoute() {
  const { isAuthenticated, accessToken } = useAuthStore();
  const location = useLocation();

  // Fetch current user if we have a token but need to verify session
  const { isLoading, isError } = useCurrentUser();

  // If we have a token, wait for user fetch to complete
  if (accessToken && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // No token or fetch failed - redirect to login
  if (!accessToken || isError || !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
