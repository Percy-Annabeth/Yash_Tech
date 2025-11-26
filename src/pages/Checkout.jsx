

// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { db } from "../firebase/config";
import { CheckCircleOutline, LocalShippingOutlined, PaymentOutlined } from "@mui/icons-material";
import {
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { formatCurrency } from "../utils/formatters";

/**
 * Checkout
 * - Loads user's cart from carts/{uid}
 * - Displays order summary from cart items
 * - On submit: validates form, creates an order document in "orders" collection
 *   order structure:
 *     {
 *       userId, userEmail, items, total, paymentMethod, paymentStatus,
 *       orderStatus, street, city, state, pincode, phone, createdAt
 *     }
 * - Clears the cart (delete carts/{uid}) after successful order creation
 */
const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    paymentMethod: "cod",
  });

  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoadingCart(false);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);
    const load = async () => {
      try {
        const snap = await getDoc(cartRef);
        if (snap.exists()) {
          const data = snap.data();
          setCartItems(data.items || []);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart for checkout:", err);
      } finally {
        setLoadingCart(false);
      }
    };

    load();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, street, city, state, pincode, phone, paymentMethod } =
      formData;

    // Validation
    if (!fullName || !street || !city || !state || !pincode || !phone) {
      alert("Please fill all required fields.");
      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      const ordersCol = collection(db, "orders");

      // ✅ Add orderStatus: "pending" here
      const orderPayload = {
        userId: user.uid,
        userEmail: user.email || "",
        items: cartItems,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending", // can change if online payment succeeds
        orderStatus: "pending", // ✅ new field added
        street,
        city,
        state,
        pincode,
        phone,
        createdAt: serverTimestamp(),
      };

      const orderRef = await addDoc(ordersCol, orderPayload);

      // Clear user's cart
      const cartRef = doc(db, "carts", user.uid);
      await deleteDoc(cartRef);

      alert(`✅ Order placed successfully! Order ID: ${orderRef.id}`);
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed:", err);
      alert("Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <p className="checkout-welcome">
        Welcome <span className="highlight">{user.email}</span>! Please enter
        your shipping details.
      </p>

      <div className="checkout-grid">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2 className="section-title">Shipping Information</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Street / Address"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <h2 className="section-title">Payment Method</h2>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
          </select>

          <button type="submit" className="btn-primary" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>

          {/* Progress Steps */}
<div className="checkout-steps">
  <div className="step active">
    <LocalShippingOutlined />
    <span>Shipping</span>
  </div>
  <div className="step-line"></div>
  <div className="step">
    <PaymentOutlined />
    <span>Payment</span>
  </div>
  <div className="step-line"></div>
  <div className="step">
    <CheckCircleOutline />
    <span>Confirm</span>
  </div>
</div>

        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h2 className="section-title">Order Summary</h2>

          {loadingCart ? (
            <p>Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="summary-list">
                {cartItems.map((it) => (
                  <div key={it.productId} className="summary-item">
                    <span>
                      {it.name} x {it.quantity}
                    </span>
                    <span>{formatCurrency((it.price || 0) * (it.quantity || 0))}</span>
                  </div>
                ))}
              </div>

              <hr />
              <div className="summary-total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

