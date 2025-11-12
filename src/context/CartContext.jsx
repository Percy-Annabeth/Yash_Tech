import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // [{ product, qty }]

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const found = prev.find((p) => p.product.id === product.id);
      if (found) {
        return prev.map(p => p.product.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const value = { cart, addToCart, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);