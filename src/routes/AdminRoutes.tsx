
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";

import ManageProduct from "../pages/Admin/ManageProduct/ManageProduct";
import ManageOrders from "../pages/Admin/ManageOrders/ManageOrders";
import ManageUsers from "../pages/Admin/ManageUsers/ManageUsers";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import AddProductPage from "../pages/Admin/AddProductPage/AddProductPage";

const AdminRouteWrapper: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminRouteWrapper>
            <AdminLayout />
          </AdminRouteWrapper>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ManageProduct />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="edit-product/:id" element={<AddProductPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
