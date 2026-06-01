import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SystemIntelligence from './components/SystemIntelligence';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Reporting from './pages/Reporting';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  if (isInitializing) {
    return <SystemIntelligence onComplete={() => setIsInitializing(false)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
