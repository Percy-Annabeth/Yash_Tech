// src/admin/AdminDashboard.jsx
import React, { useState } from "react";
import ProductsAdmin from "./ProductsAdmin";
import OrdersAdmin from "./OrdersAdmin";
import UsersAdmin from "./UsersAdmin";
import AdminGraphs from "./AdminGraphs";
import "./Admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // ✅ Default is products

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "products" && <ProductsAdmin />}
        {activeTab === "orders" && <OrdersAdmin />}
        {activeTab === "users" && <UsersAdmin />}
        {activeTab === "analytics" && <AdminGraphs />}
      </div>
    </div>
  );
}
