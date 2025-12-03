import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LiveFeed from './pages/LiveFeed';
import Registration from './pages/Registration';
import IdentifiedPeople from './pages/IdentifiedPeople';
import Settings from './pages/Settings';
import ModelDownloads from './pages/ModelDownloads';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Helper for transitions or persistent layouts if needed
const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-dark font-display text-white shadow-2xl">
      {children}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LiveFeed />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/people" element={<IdentifiedPeople />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/models" element={<ModelDownloads />} />
          <Route path="/settings/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}