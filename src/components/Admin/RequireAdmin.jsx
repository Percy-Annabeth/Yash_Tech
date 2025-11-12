// src/routes/RequireAdmin.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../LoadingScreen";

const RequireAdmin = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen fullscreen={true} />;
  }

  // ❌ If not logged in, send to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ❌ If logged in but not admin, block access
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, show admin routes
  return <Outlet />;
};

export default RequireAdmin;
