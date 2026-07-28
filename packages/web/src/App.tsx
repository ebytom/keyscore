import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingSpinner } from './components/ui/loading-spinner';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./pages/auth/Login'));
const RegisterPage = lazy(() => import('./pages/auth/Register'));
const OAuthCallbackPage = lazy(() => import('./pages/auth/OAuthCallback'));
const ExtensionSuccessPage = lazy(() => import('./pages/auth/ExtensionSuccess'));
const DashboardPage = lazy(() => import('./pages/dashboard/Dashboard'));
const ResumesPage = lazy(() => import('./pages/dashboard/Resumes'));
const SettingsPage = lazy(() => import('./pages/dashboard/Settings'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* OAuth callback (no layout) */}
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Extension success page (no layout) */}
        <Route path="/extension-success" element={<ExtensionSuccessPage />} />

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
