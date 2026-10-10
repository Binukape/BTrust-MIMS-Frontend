import { Navigate, Route, Routes } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Layout from '../components/shared/Layout.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import DashboardPage from '../pages/customer/DashboardPage.jsx';
import DepositWithdrawPage from '../pages/customer/DepositWithdrawPage.jsx';
import FixedDepositPage from '../pages/customer/FixedDepositPage.jsx';
import TransactionHistoryPage from '../pages/customer/TransactionHistoryPage.jsx';
import AssignedCustomersPage from '../pages/agent/AssignedCustomersPage.jsx';
import CustomerRegistrationPage from '../pages/agent/CustomerRegistrationPage.jsx';
import TransactionProcessingPage from '../pages/agent/TransactionProcessingPage.jsx';
import AgentReportsPage from '../pages/agent/AgentReportsPage.jsx';
import BranchManagementPage from '../pages/admin/BranchManagementPage.jsx';
import AgentManagementPage from '../pages/admin/AgentManagementPage.jsx';
import AdminReportsPage from '../pages/admin/AdminReportsPage.jsx';
import AuditLogPage from '../pages/admin/AuditLogPage.jsx';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? homeFor(user.role) : '/login'} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute role="customer" />}>
        <Route element={<Layout />}>
          <Route path="/customer" element={<DashboardPage />} />
          <Route path="/customer/transact" element={<DepositWithdrawPage />} />
          <Route path="/customer/fixed-deposits" element={<FixedDepositPage />} />
          <Route path="/customer/history" element={<TransactionHistoryPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="agent" />}>
        <Route element={<Layout />}>
          <Route path="/agent" element={<AssignedCustomersPage />} />
          <Route path="/agent/register" element={<CustomerRegistrationPage />} />
          <Route path="/agent/transact" element={<TransactionProcessingPage />} />
          <Route path="/agent/fixed-deposits" element={<FixedDepositPage />} />
          <Route path="/agent/reports" element={<AgentReportsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<BranchManagementPage />} />
          <Route path="/admin/agents" element={<AgentManagementPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
