
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export default AdminRoute;
