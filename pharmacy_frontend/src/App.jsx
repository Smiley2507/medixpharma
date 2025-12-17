// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import { UserContext } from './context/UserContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import './App.css';
import 'remixicon/fonts/remixicon.css';

// Import all components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import AddProductForm from './components/products/AddProductForm';
import EditProductForm from './components/products/EditProductForm';
import StockList from './components/stocks/StockList';
import AddStockForm from './components/stocks/AddStockForm';
import EditStockForm from './components/stocks/EditStockForm';
import SaleList from './components/sales/SaleList';
import AddSaleForm from './components/sales/AddSaleForm';
import EditSaleForm from './components/sales/EditSaleForm';
import EditSupplierForm from './components/suppliers/EditSupplierForm';
import AddSupplierForm from './components/suppliers/AddSupplierForm';
import SupplierList from './components/suppliers/SupplierList';
import ReportPage from './components/reports/ReportPage';
import UserList from './components/users/UserList';
import UpdateUserForm from './components/users/UpdateUserForm';
import AddUserForm from './components/users/AddUserForm';
import ExpiringPage from './components/fullview/ExpiringPage';
import OutOfStockPage from './components/fullview/OutOfStockPage';
import TransactionsPage from './components/fullview/TransactionsPage';
import StaffDashboard from './components/dashboard/StaffDashboard';
import StaffTopBar from './components/layout/StaffTopBar';
import StaffStockList from './components/stocks/StaffStockList';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';


function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Pharmacist Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/staff" fallback="/login">
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']} redirectTo="/" fallback="/login">
                  <StaffTopBar />
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Other Pharmacist Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <ProductList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/add"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <AddProductForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:productId"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <EditProductForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocks"
              element={
                <ProtectedRoute allowedRoles={['pharmacist', 'staff']} redirectTo="/login">
                  <Layout>
                    <StockList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocks/add"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <AddStockForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stocks/edit/:stockId"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <EditStockForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <SaleList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/edit/:saleId"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <EditSaleForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/add"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <AddSaleForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <SupplierList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers/add"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <AddSupplierForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers/edit/:supplierId"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <EditSupplierForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <ReportPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <UserList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/add"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <AddUserForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/update/:id"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <UpdateUserForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/out-of-stock"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <OutOfStockPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/expiring"
              element={
                <ProtectedRoute allowedRoles={['pharmacist']} redirectTo="/login">
                  <Layout>
                    <ExpiringPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute allowedRoles={['pharmacist', 'staff']} redirectTo="/login">
                  <Layout>
                    <TransactionsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff-stocks"
              element={
                <ProtectedRoute allowedRoles={['staff']} redirectTo="/login">
                  <StaffTopBar />
                  <StaffStockList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-add"
              element={
                <ProtectedRoute allowedRoles={['staff']} redirectTo="/login">
                  <StaffTopBar />
                  <AddSaleForm />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </UserProvider>
  );
}

const ProtectedRoute = ({ allowedRoles, redirectTo, fallback = '/login', children }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  console.log('ProtectedRoute user:', user, 'Allowed roles:', allowedRoles, 'User role:', user?.role, 'Current path:', location.pathname);

  if (!user || !user.role) {
    console.log('No user or role found, redirecting to:', fallback);
    return <Navigate to={fallback} replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);
  if (hasAccess) {
    console.log('User has access, rendering children');
    return children;
  } else if (location.pathname !== redirectTo) {
    console.log('User does not have access, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  return null;
};

export default App;