import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/services/auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { refetch } = useCurrentUser();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      // Fetch user data then redirect
      refetch().then(() => {
        navigate('/dashboard');
      });
    } else {
      navigate('/login?error=missing_tokens');
    }
  }, [searchParams, navigate, setTokens, refetch]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
