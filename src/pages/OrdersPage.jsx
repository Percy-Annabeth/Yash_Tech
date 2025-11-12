import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./OrdersPage.css";
import { formatCurrency } from "../utils/formatters";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const snap = await getDocs(q);

        const orderList = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds); // newest first

        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;

  if (loading)
    return <div className="orders-loading">Loading your orders...</div>;

  if (orders.length === 0)
    return <div className="orders-empty">🛒 No orders yet. Start shopping!</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h2>Order #{order.id.slice(-6).toUpperCase()}</h2>
              <p className="order-date">
                📅{" "}
                {order.createdAt?.toDate
                  ? new Date(order.createdAt.toDate()).toLocaleString()
                  : "Pending..."}
              </p>
            </div>

            <p className="order-total">
              💰 Total: {formatCurrency(order.total || 0)}
            </p>
            <p className="order-payment">
              💳 Payment: {order.paymentMethod} ({order.paymentStatus})
            </p>

            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="order-item-img"
                    />
                  )}
                  <div className="order-item-info">
                    <h3>{item.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-shipping">
              <h4>📦 Shipping to:</h4>
              <p>{order.street}</p>
              <p>
                {order.city}, {order.state} - {order.pincode}
              </p>
              <p>📞 {order.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
