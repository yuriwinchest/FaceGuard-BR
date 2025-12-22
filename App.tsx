import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import LiveFeed from './pages/LiveFeed';
import Registration from './pages/Registration';
import IdentifiedPeople from './pages/IdentifiedPeople';
import Settings from './pages/Settings';
import ModelDownloads from './pages/ModelDownloads';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InstallDetails from './pages/InstallDetails';
import './GlobalStyles.css';

// Helper for transitions or persistent layouts if needed
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

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LiveFeed /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Registration /></PageWrapper>} />
        <Route path="/people" element={<PageWrapper><IdentifiedPeople /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/settings/models" element={<PageWrapper><ModelDownloads /></PageWrapper>} />
        <Route path="/settings/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
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