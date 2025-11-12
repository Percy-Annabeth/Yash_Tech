// CartPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./CartPage.css";
import { formatCurrency } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

/**
 * CartPage
 * - Listens in real-time to carts/{user.uid} document
 * - Updates quantities by writing entire items array (keeps things simple & consistent)
 * - Remove item updates items array
 *
 * IMPORTANT: This file now expects carts/{uid} to be the single canonical cart document.
 */
const CartPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setCartItems([]);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);
    // real-time listener for the user's cart
    const unsub = onSnapshot(
      cartRef,
      (snap) => {
        if (!snap.exists()) {
          setCartItems([]);
        } else {
          const data = snap.data();
          setCartItems(data.items || []);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Cart onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  // Update quantity handler: write back the full array
  const updateQuantity = async (productId, newQty) => {
    if (!user) return navigate("/auth");
    if (newQty < 1) return;

    try {
      const cartRef = doc(db, "carts", user.uid);
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      );
      await updateDoc(cartRef, { items: updatedItems, updatedAt: serverTimestamp() });
      // local state will update via the onSnapshot listener
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItem = async (productId) => {
    if (!user) return navigate("/auth");
    try {
      const cartRef = doc(db, "carts", user.uid);
      const updatedItems = cartItems.filter((item) => item.productId !== productId);
      // If empty, we can delete the doc or set items to []
      if (updatedItems.length === 0) {
        // remove cart doc
        await deleteDoc(cartRef);
      } else {
        await updateDoc(cartRef, { items: updatedItems, updatedAt: serverTimestamp() });
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  if (loading) return <p className="loading">Loading cart...</p>;
  if (!user) return <p className="not-logged">Please login to view your cart.</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.productId}>
                <div className="cart-item-info">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="mini-thumb" />}
                  <div>
                    <h2>{item.name}</h2>
                    <p>{formatCurrency(item.price)}</p>
                  </div>
                </div>

                <div className="cart-controls">
                  <button
                    onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-subtotal">
                  Subtotal: {formatCurrency((item.price || 0) * (item.quantity || 0))}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: {formatCurrency(total)}</h2>
            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
