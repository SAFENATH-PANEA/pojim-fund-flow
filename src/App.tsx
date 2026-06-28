import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyShares from './pages/MyShares';
import Loans from './pages/Loans';
import Penalties from './pages/Penalties';
import Projects from './pages/Projects';
import FinancialSummary from './pages/FinancialSummary';
import Notifications from './pages/Notifications';
import AdminManagement from './pages/AdminManagement';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="shares" element={<MyShares />} />
              <Route path="loans" element={<Loans />} />
              <Route path="penalties" element={<Penalties />} />
              <Route path="projects" element={<Projects />} />
              <Route path="summary" element={<FinancialSummary />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="admin/members" element={<AdminManagement />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
