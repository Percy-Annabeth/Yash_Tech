// AdminRoute.jsx
// Usage: wrap admin pages with <AdminRoute><AdminDashboard /></AdminRoute>


import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function AdminRoute({ children }) {
const { user, userData } = useAuth();


// If not logged in -> send to /auth
if (!user) return <Navigate to="/auth" replace />;


// If there is a small delay fetching userData, show a simple placeholder
if (!userData) return <div style={{ padding: 20 }}>Checking permissions...</div>;


// If user isn't an admin, redirect to homepage (you can change this to an "Unauthorized" page)
if (userData.role !== "admin") return <Navigate to="/" replace />;


// Otherwise render the admin children
return children;
}