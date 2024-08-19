import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/Login';
import DashboardLayout from './partials/DasboardLayout';
import LogoutButton from './components/Logout';
import './App.css'
import MyAccountPage from './pages/MyAccount';
import SharedCardPage from './pages/SharedCard';
import TransactionsPage from './pages/Transactions';
import SettingsPage from './pages/Settings';
import QaPage from './pages/Qa';
import PrePaidCardPage from './pages/PrePaidCard';
import DepositPage from './pages/Deposit';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
                <Route element={<DashboardLayout/>} >
                    <Route path="/" element={<ProtectedRoute><MyAccountPage /></ProtectedRoute>} />
                    <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
                    <Route path="/pre-paid-card" element={<ProtectedRoute><PrePaidCardPage /></ProtectedRoute>} />
                    <Route path="/shared-card" element={<ProtectedRoute><SharedCardPage /></ProtectedRoute>} />
                    <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                    <Route path="/qa" element={<ProtectedRoute><QaPage /></ProtectedRoute>} />
                </Route>
          <Route path="/logout" element={<LogoutButton />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
