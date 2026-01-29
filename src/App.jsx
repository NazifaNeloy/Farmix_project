import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { BatchProvider } from './context/BatchContext';
import ProtectedRoute from './components/ProtectedRoute';
import VoiceAssistant from './components/VoiceAssistant';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const OurApproachPage = lazy(() => import('./pages/OurApproachPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HarvestPage = lazy(() => import('./pages/HarvestPage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const RiskAnalysisPage = lazy(() => import('./pages/RiskAnalysisPage'));
const CommunityMapPage = lazy(() => import('./pages/CommunityMapPage'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BatchProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/approach" element={<OurApproachPage />} />
                    <Route path="/problem" element={<ProblemPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/harvest"
                      element={
                        <ProtectedRoute>
                          <HarvestPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/scanner"
                      element={
                        <ProtectedRoute>
                          <ScannerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/risk-analysis"
                      element={
                        <ProtectedRoute>
                          <RiskAnalysisPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/community-map"
                      element={
                        <ProtectedRoute>
                          <CommunityMapPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
            <VoiceAssistant />
          </Router>
        </BatchProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
