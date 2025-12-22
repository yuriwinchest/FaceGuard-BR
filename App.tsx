import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { supabase } from './supabaseClient';
import LiveFeed from './pages/LiveFeed';
import Registration from './pages/Registration';
import IdentifiedPeople from './pages/IdentifiedPeople';
import Settings from './pages/Settings';
import ModelDownloads from './pages/ModelDownloads';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InstallDetails from './pages/InstallDetails';
import Auth from './pages/Auth';
import './GlobalStyles.css';

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-dark font-display text-white shadow-2xl relative">
      <Toaster
        position="top-center"
        richColors
        theme="dark"
        toastOptions={{
          style: { background: '#1c271f', border: '1px solid rgba(19, 236, 91, 0.2)', color: '#fff' },
        }}
      />
      {children}
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen w-full bg-background-dark flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!session) return <Navigate to="/auth" />;

  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/" element={<ProtectedRoute><PageWrapper><LiveFeed /></PageWrapper></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute><PageWrapper><Registration /></PageWrapper></ProtectedRoute>} />
        <Route path="/people" element={<ProtectedRoute><PageWrapper><IdentifiedPeople /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/models" element={<ProtectedRoute><PageWrapper><ModelDownloads /></PageWrapper></ProtectedRoute>} />
        <Route path="/settings/privacy" element={<ProtectedRoute><PageWrapper><PrivacyPolicy /></PageWrapper></ProtectedRoute>} />
        <Route path="/install" element={<PageWrapper><InstallDetails /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="h-full w-full overflow-hidden"
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <HashRouter>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </HashRouter>
  );
}