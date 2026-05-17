import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import NgoDashboard from './pages/ngo/NgoDashboard';
import CreateProject from './pages/ngo/CreateProject';
import MyProjects from './pages/ngo/MyProjects';
import CorporateDashboard from './pages/corporate/CorporateDashboard';
import Marketplace from './pages/corporate/Marketplace';
import SentRequests from './pages/corporate/SentRequests';
import IncomingRequests from './pages/ngo/IncomingRequests';
import Wallet from './pages/ngo/Wallet';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserList from './pages/admin/UserList';
import AdminFinance from './pages/admin/AdminFinance';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ngo', 'admin']} />}>
            <Route path="/dashboard/ngo" element={<NgoDashboard />} />
            <Route path="/dashboard/ngo/create-project" element={<CreateProject />} />
            <Route path="/dashboard/ngo/projects" element={<MyProjects />} />
            <Route path="/dashboard/ngo/requests" element={<IncomingRequests />} />
            <Route path="/dashboard/ngo/wallet" element={<Wallet />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['corporate', 'admin']} />}>
            <Route path="/dashboard/corporate" element={<CorporateDashboard />} />
            <Route path="/dashboard/corporate/marketplace" element={<Marketplace />} />
            <Route path="/dashboard/corporate/portfolio" element={<SentRequests />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users/:role" element={<UserList />} />
            <Route path="/admin/finance" element={<AdminFinance />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
