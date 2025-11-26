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
import { motion, AnimatePresence } from "framer-motion";
import { 
  DeleteOutline, 
  ShoppingCartOutlined,
  LocalOfferOutlined,
  SecurityOutlined 
} from "@mui/icons-material";
import "./CartPage.css";
import { formatCurrency } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

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

  const updateQuantity = async (productId, newQty) => {
    if (!user) return navigate("/auth");
    if (newQty < 1) return;

    try {
      const cartRef = doc(db, "carts", user.uid);
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      );
      await updateDoc(cartRef, { items: updatedItems, updatedAt: serverTimestamp() });
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (productId) => {
    if (!user) return navigate("/auth");
    
    if (!window.confirm("Remove this item from cart?")) return;
    
    try {
      const cartRef = doc(db, "carts", user.uid);
      const updatedItems = cartItems.filter((item) => item.productId !== productId);
      
      if (updatedItems.length === 0) {
        await deleteDoc(cartRef);
      } else {
        await updateDoc(cartRef, { items: updatedItems, updatedAt: serverTimestamp() });
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    if (!window.confirm("Clear all items from cart?")) return;

    try {
      const cartRef = doc(db, "carts", user.uid);
      await deleteDoc(cartRef);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      alert("Failed to clear cart. Please try again.");
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="cart-empty-state">
        <ShoppingCartOutlined sx={{ fontSize: 100, color: "#ccc" }} />
        <h2>Please Login to View Cart</h2>
        <p>Sign in to access your shopping cart and saved items</p>
        <motion.button 
          className="login-btn"
          onClick={() => navigate("/auth")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login / Sign Up
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="cart-header">
        <div>
          <h1>Shopping Cart</h1>
          <p className="cart-subtitle">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {cartItems.length > 0 && (
          <motion.button 
            className="clear-cart-btn"
            onClick={clearCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DeleteOutline /> Clear Cart
          </motion.button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <motion.div 
          className="cart-empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingCartOutlined sx={{ fontSize: 100, color: "#ccc" }} />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <motion.button 
            className="shop-now-btn"
            onClick={() => navigate("/products")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="cart-content">
          {/* Cart Items */}
          <motion.div 
            className="cart-items-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.productId}
                  className="cart-item"
                  variants={itemVariants}
                  exit="exit"
                  layout
                >
                  <div className="item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3 
                      className="item-name"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal">
                      <span className="subtotal-label">Subtotal:</span>
                      <span className="subtotal-amount">
                        {formatCurrency((item.price || 0) * (item.quantity || 0))}
                      </span>
                    </div>

                    <motion.button
                      className="remove-btn"
                      onClick={() => removeItem(item.productId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <DeleteOutline /> Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Cart Summary */}
          <motion.div 
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-badge">FREE</span>
            </div>

            <div className="summary-row discount-row">
              <span>
                <LocalOfferOutlined sx={{ fontSize: 18 }} /> Discount
              </span>
              <span className="discount-amount">− ₹0</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-amount">{formatCurrency(total)}</span>
            </div>

            <motion.button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Proceed to Checkout
            </motion.button>

            <div className="trust-indicators">
              <div className="trust-item">
                <SecurityOutlined sx={{ fontSize: 20 }} />
                <span>Secure Checkout</span>
              </div>
              <div className="trust-item">
                <LocalOfferOutlined sx={{ fontSize: 20 }} />
                <span>Best Price Guarantee</span>
              </div>
            </div>

            <div className="promo-code">
              <input type="text" placeholder="Enter promo code" />
              <button>Apply</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;