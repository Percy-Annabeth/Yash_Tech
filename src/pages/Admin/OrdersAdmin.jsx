import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { formatCurrency } from "../../utils/formatters";
import "./Admin.css";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Update order + payment status dynamically
  const handleStatusChange = async (orderId, currentStatus, nextStatus) => {
    if (nextStatus === "delivered" && currentStatus !== "out-for-delivery") {
      alert("Order must be Out for Delivery before marking as Delivered!");
      return;
    }

    const orderRef = doc(db, "orders", orderId);
    let updates = { orderStatus: nextStatus };

    // ✅ Automatically mark payment as paid when delivered
    if (nextStatus === "delivered") {
      updates.paymentStatus = "paid";
    }

    await updateDoc(orderRef, updates);
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Orders Management</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Ordered Date</th>
              <th>Items</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(-6).toUpperCase()}</td>
                <td>{order.userEmail}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>{order.paymentMethod.toUpperCase()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      order.paymentStatus === "paid" ? "paid" : "pending"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="small-date">
                  {order.createdAt?.toDate
                    ? new Date(order.createdAt.toDate()).toLocaleString()
                    : "Pending"}
                </td>
                <td>{order.items.length}</td>
                <td>
                  <span
                    className={`status-badge big-status ${
                      order.orderStatus === "delivered"
                        ? "delivered"
                        : order.orderStatus === "out-for-delivery"
                        ? "out-for-delivery"
                        : "pending"
                    }`}
                  >
                    {order.orderStatus || "pending"}
                  </span>
                </td>
                <td>
                  {order.orderStatus === "pending" && (
                    <button
                      className="status-btn"
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          order.orderStatus,
                          "out-for-delivery"
                        )
                      }
                    >
                      Mark Out for Delivery
                    </button>
                  )}
                  {order.orderStatus === "out-for-delivery" && (
                    <button
                      className="status-btn delivered-btn"
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          order.orderStatus,
                          "delivered"
                        )
                      }
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.orderStatus === "delivered" && (
                    <span className="final-status">✅ Delivered</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
