import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./AddProductModal.css";

export default function AddProductModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock || !imageUrl) return alert("Fill all fields");

    setAdding(true);
    try {
      const newProduct = {
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "products"), newProduct);
      onAdd({ ...newProduct, id: docRef.id });
      alert("✅ Product added successfully!");
      onClose();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Add failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="modal-buttons">
            <button type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add Product"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
