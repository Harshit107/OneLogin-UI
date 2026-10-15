import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoadingFallback } from './components/LoadingFallback';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { FEATURE_FLAGS } from './config/featureFlags';

// Route-based Code-Splitting
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const OAuthConsentPage = lazy(() => import('./pages/OAuthConsentPage').then(m => ({ default: m.OAuthConsentPage })));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage').then(m => ({ default: m.PlaygroundPage })));

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(8, 12, 21, 0.6);
  backdrop-filter: blur(12px);
  padding: 24px 32px;
  font-size: 0.8rem;
  color: #64748b;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 640px) {
    justify-content: center;
    text-align: center;
  }
`;

const FooterBadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
`;

/**
 * Route Guard for Admin-only pages
 */
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token, isAdmin, isLoading } = useAuth();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (!isAdmin && !isLoading) {
    return <Navigate to="/profile" replace />;
  }
  return children;
};

/**
 * Route Guard for Guest-only pages (Auth/Login/Register)
 * If already logged in, redirect to /profile (or OAuth consent if client_id present)
 */
const GuestRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token } = useAuth();
  const location = window.location;
  if (token) {
    const searchParams = new URLSearchParams(location.search);
    const clientId = searchParams.get('client_id');
    const redirectUri = searchParams.get('redirect_uri');
    if (clientId && redirectUri) {
      return <Navigate to={`/oauth/authorize?${searchParams.toString()}`} replace />;
    }
    return <Navigate to="/profile" replace />;
  }
  return children;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <BrowserRouter>
          <AppContainer>
            {/* Header Navigation */}
            <Navbar />

            {/* Main Content Area with Code-Splitting Suspense */}
            <MainContent>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <GuestRoute>
                        <AuthPage />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <GuestRoute>
                        <AuthPage />
                      </GuestRoute>
                    }
                  />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        {FEATURE_FLAGS.ENABLE_ADMIN_PORTAL ? <AdminPage /> : <Navigate to="/profile" replace />}
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/developer/projects"
                    element={
                      <AdminRoute>
                        <ProjectsPage />
                      </AdminRoute>
                    }
                  />
                  <Route path="/oauth/authorize" element={<OAuthConsentPage />} />
                  <Route
                    path="/playground"
                    element={
                      <AdminRoute>
                        {FEATURE_FLAGS.ENABLE_PLAYGROUND ? <PlaygroundPage /> : <Navigate to="/profile" replace />}
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </MainContent>

            {/* Footer */}
            <Footer>
              <FooterInner>
                <p>© {new Date().getFullYear()} OneLogin Single Sign-On Platform. Styled with styled-components.</p>
                <FooterBadgeGroup>
                  <span>OAuth 2.0 PKCE</span>
                  <span>•</span>
                  <span>Zero-Trust Architecture</span>
                  <span>•</span>
                  <span>Cross-Domain SSO</span>
                </FooterBadgeGroup>
              </FooterInner>
            </Footer>
          </AppContainer>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
