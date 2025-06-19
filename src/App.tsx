
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/HomePage';
import PasswordSetup from '@/components/PasswordSetup';
import MVPTestingDashboard from '@/components/MVPTestingDashboard';
import LandingPage from '@/components/LandingPage';
import LoginRedirect from '@/components/LoginRedirect';
import AppPage from '@/components/AppPage';
import ErrorPage from '@/components/ErrorPage';
import SupportPage from '@/components/SupportPage';
import NotFound from '@/pages/NotFound';
import RoleSelection from '@/components/RoleSelection';
import PlayerLinking from '@/components/PlayerLinking';
import PlayerDashboard from '@/components/PlayerDashboard';
import CoachHome from '@/components/CoachHome';
import ProtectedRoute from '@/components/ProtectedRoute';
import RouteSafetyGuard from '@/components/RouteSafetyGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouteSafetyGuard>
          <TooltipProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <Routes>
              {/* Landing page is the homepage */}
              <Route path="/" element={<LandingPage />} />
              {/* Login redirect handler */}
              <Route path="/login" element={<LoginRedirect />} />
              {/* App page with token handling */}
              <Route path="/app" element={<AppPage />} />
              {/* Support page */}
              <Route path="/support" element={<SupportPage />} />
              {/* Error page */}
              <Route path="/error" element={<ErrorPage />} />
              {/* Password setup route - this is what parents click from email */}
              <Route path="/password-setup" element={<PasswordSetup />} />
              
              {/* Role selection for new users */}
              <Route path="/select-role" element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              } />
              
              {/* Player linking for parents */}
              <Route path="/link-player" element={
                <ProtectedRoute requireRole="Parent">
                  <PlayerLinking />
                </ProtectedRoute>
              } />
              
              {/* Player dashboard for parents */}
              <Route path="/players/:playerId/dashboard" element={
                <ProtectedRoute requireRole="Parent">
                  <PlayerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Coach home dashboard */}
              <Route path="/coach/home" element={
                <ProtectedRoute requireRole="Coach">
                  <CoachHome />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <HomePage />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              <Route path="/testing" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <MVPTestingDashboard />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              
              {/* Create player route (could redirect to dashboard create flow) */}
              <Route path="/create-player" element={
                <ProtectedRoute>
                  <>
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <HomePage />
                    </main>
                  </>
                </ProtectedRoute>
              } />
              {/* Catch-all route for 404s */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </div>
        </TooltipProvider>
      </RouteSafetyGuard>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
