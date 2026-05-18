import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PageLoader } from './components/ui';
import { UserRole } from './types';

// Public pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SigninPage = lazy(() => import('./pages/auth/SigninPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));

// App pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const LeadsPage = lazy(() => import('./pages/leads/LeadsPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0d14' }}>
            <PageLoader />
          </div>
        }>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Protected app */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  <UsersPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161b27',
            color: '#e8edf5',
            border: '1px solid #2a3347',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#161b27' } },
          error: { iconTheme: { primary: '#f05252', secondary: '#161b27' } },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
