import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MonitoringProvider } from './context/MonitoringContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Motors from './pages/Motors';
import LiveMonitoring from './pages/LiveMonitoring';
import Analytics from './pages/Analytics';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import FaultHistory from './pages/FaultHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <MonitoringProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/motors" element={<Motors />} />
            <Route path="/live-monitoring" element={<LiveMonitoring />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
            <Route path="/fault-history" element={<FaultHistory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </MonitoringProvider>
  );
}

export default App;
