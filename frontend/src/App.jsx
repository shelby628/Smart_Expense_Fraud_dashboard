import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Manual from "./pages/Manual";
import Upload from "./pages/Upload";
import FlaggedTransactions from "./pages/FlaggedTransactions";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeTransactions from "./pages/EmployeeTransactions";
import AdminTransactions from "./pages/AdminTransactions";
import AuditLogs from "./pages/AuditLogs";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Employee protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/dashboard" element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/transactions" element={
          <ProtectedRoute>
            <EmployeeTransactions />
          </ProtectedRoute>
        } />
        <Route path="/manual" element={
          <ProtectedRoute>
            <Manual />
          </ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } />
        <Route path="/flagged" element={
          <ProtectedRoute>
            <FlaggedTransactions />
          </ProtectedRoute>
        } />

        {/* ✅ Admin protected routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute adminOnly={true}>
            <AdminTransactions />
          </ProtectedRoute>
        } />
        <Route path="/admin/audit-logs" element={
          <ProtectedRoute adminOnly={true}>
            <AuditLogs />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;