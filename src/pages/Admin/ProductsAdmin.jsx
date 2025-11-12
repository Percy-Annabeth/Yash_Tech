










// // src/admin/ProductsAdmin.jsx
// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
// import "./Admin.css";

// export default function ProductsAdmin() {
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);

//   // Default categories
//   const [categories, setCategories] = useState([
//     "Category001",
//     "Category002",
//     "Category003",
//     "Category004",
//     "Category005",
//   ]);

//   // Default specifications
//   const [specifications, setSpecifications] = useState([
//     { key: "Cooling Capacity", value: "" },
//     { key: "Weight", value: "" },
//     { key: "Power", value: "" },
//     { key: "Voltage", value: "" },
//   ]);

//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     brand: "",
//     category: "",
//     base_price: "",
//     discount_percent: "0",
//     price: "",
//     stock: "",
//     description: "",
//     imageUrl: "",
//     gallery: "",
//     tags: "",
//     features: "",
//   });

//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState("");

//   // 🔹 Fetch products and orders
//   useEffect(() => {
//     const fetchData = async () => {
//       const productSnapshot = await getDocs(collection(db, "products"));
//       const orderSnapshot = await getDocs(collection(db, "orders"));

//       const productList = productSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const orderList = orderSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setProducts(productList);
//       setOrders(orderList);
//     };
//     fetchData();
//   }, []);

//   // 🔹 Auto calculate price when base_price or discount changes
//   useEffect(() => {
//     const base = parseFloat(newProduct.base_price) || 0;
//     const discount = parseFloat(newProduct.discount_percent) || 0;
//     const finalPrice = base - (base * discount) / 100;
//     setNewProduct((prev) => ({ ...prev, price: finalPrice.toFixed(2) }));
//   }, [newProduct.base_price, newProduct.discount_percent]);

//   // 🔹 Calculate number of orders for each product
//   const getOrderCount = (productId) => {
//     return orders.reduce((count, order) => {
//       if (order.items && Array.isArray(order.items)) {
//         return count + order.items.filter((item) => item.productId === productId).length;
//       }
//       return count;
//     }, 0);
//   };

//   // 🔹 Add product
//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     if (!newProduct.name || !newProduct.base_price || !newProduct.stock || !newProduct.description || !newProduct.imageUrl) {
//       alert("Please fill all required fields");
//       return;
//     }

//     // Parse arrays
//     const tagsArray = newProduct.tags
//       ? newProduct.tags.split(",").map((t) => t.trim()).slice(0, 10)
//       : [];
//     const featuresArray = newProduct.features
//       ? newProduct.features.split(",").map((f) => f.trim())
//       : [];
//     const galleryArray = newProduct.gallery
//       ? newProduct.gallery.split(",").map((g) => g.trim())
//       : [];

//     // Build specifications map
//     const specsMap = {};
//     specifications.forEach((spec) => {
//       if (spec.key && spec.value) {
//         specsMap[spec.key] = isNaN(spec.value) ? spec.value : Number(spec.value);
//       }
//     });

//     await addDoc(collection(db, "products"), {
//       name: newProduct.name,
//       brand: newProduct.brand || "Unknown",
//       category: newProduct.category || "Uncategorized",
//       base_price: parseFloat(newProduct.base_price),
//       price: parseFloat(newProduct.price),
//       discount_percent: parseFloat(newProduct.discount_percent) || 0,
//       stock: parseInt(newProduct.stock),
//       description: newProduct.description,
//       imageUrl: newProduct.imageUrl,
//       gallery: galleryArray,
//       tags: tagsArray,
//       features: featuresArray,
//       specifications: specsMap,

//       // System fields
//       avgRating: 0,
//       rating: 0,
//       reviewCount: 0,
//       reviews: [],
//       sales: 0,
//       isFeatured: false,
//       views: 0,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });

//     // Reset form
//     setNewProduct({
//       name: "",
//       brand: "",
//       category: "",
//       base_price: "",
//       discount_percent: "0",
//       price: "",
//       stock: "",
//       description: "",
//       imageUrl: "",
//       gallery: "",
//       tags: "",
//       features: "",
//     });
//     setSpecifications([
//       { key: "Cooling Capacity", value: "" },
//       { key: "Weight", value: "" },
//       { key: "Power", value: "" },
//       { key: "Voltage", value: "" },
//     ]);
//     setShowForm(false);
//     window.location.reload();
//   };

//   // 🔹 Update specification
//   const handleSpecChange = (index, field, value) => {
//     const updatedSpecs = [...specifications];
//     updatedSpecs[index][field] = value;
//     setSpecifications(updatedSpecs);
//   };

//   // 🔹 Add new specification row
//   const addSpecField = () => {
//     setSpecifications([...specifications, { key: "", value: "" }]);
//   };

//   // 🔹 Remove specification row
//   const removeSpecField = (index) => {
//     const updatedSpecs = specifications.filter((_, i) => i !== index);
//     setSpecifications(updatedSpecs);
//   };

//   // 🔹 Add new category option
//   const addCategory = () => {
//     setCategories([...categories, `Category${categories.length + 1}`]);
//   };

//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="products-admin">
//       <h2>Manage Products</h2>

//       {/* ✅ Search Bar */}
//       <input
//         type="text"
//         placeholder="Search products..."
//         className="search-bar"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* ✅ Toggle Add Product Form */}
//       <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
//         {showForm ? "Cancel" : "+ Add Product"}
//       </button>

//       {showForm && (
//         <form className="add-product-form" onSubmit={handleAddProduct}>
//           <input
//             type="text"
//             placeholder="Product Name"
//             value={newProduct.name}
//             onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Brand"
//             value={newProduct.brand}
//             onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
//           />

//           {/* Category selection */}
//           <div className="category-section">
           
//             {categories.map((cat, index) => (
//               <div key={index} className="category-item">
//                 <input
//                   type="radio"
//                   id={`cat-${index}`}
//                   className="category-input"
//                   name="category"
//                   value={cat}
//                   checked={newProduct.category === cat}
//                   onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                 />
//                  <label  htmlFor={`cat-${index}`} className="category-label">Category:</label>
//                 <input
//                   type="text"
//                   value={cat}
//                   onChange={(e) => {
//                     const updated = [...categories];
//                     updated[index] = e.target.value;
//                     setCategories(updated);
//                   }}
//                 />
//               </div>
//             ))}
//             <button type="button" onClick={addCategory}>
//               + Add Category
//             </button>
//           </div>

//           {/* Price handling */}
//           <input
//             type="number"
//             placeholder="Base Price (₹)"
//             value={newProduct.base_price}
//             onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Discount %"
//             value={newProduct.discount_percent}
//             onChange={(e) => setNewProduct({ ...newProduct, discount_percent: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Final Price (auto)"
//             value={newProduct.price}
//             readOnly
//           />

//           <input
//             type="number"
//             placeholder="Stock Quantity"
//             value={newProduct.stock}
//             onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Image URL"
//             value={newProduct.imageUrl}
//             onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
//           />
//           <textarea
//             placeholder="Gallery URLs (comma separated)"
//             value={newProduct.gallery}
//             onChange={(e) => setNewProduct({ ...newProduct, gallery: e.target.value })}
//           />
//           <textarea
//             placeholder="Tags (comma separated, max 10)"
//             value={newProduct.tags}
//             onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
//           />
//           <textarea
//             placeholder="Features (comma separated)"
//             value={newProduct.features}
//             onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
//           />

//           {/* Specifications */}
//           <div className="specifications-section">
//             <h4>Specifications</h4>
//             {specifications.map((spec, index) => (
//               <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
//                 <input
//                   type="text"
//                   placeholder="Key"
//                   value={spec.key}
//                   onChange={(e) => handleSpecChange(index, "key", e.target.value)}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Value"
//                   value={spec.value}
//                   onChange={(e) => handleSpecChange(index, "value", e.target.value)}
//                 />
//                 <button type="button" onClick={() => removeSpecField(index)}>
//                   ❌
//                 </button>
//               </div>
//             ))}
//             <button type="button" onClick={addSpecField}>
//               + Add Specification
//             </button>
//           </div>

//           <textarea
//             placeholder="Product Description"
//             value={newProduct.description}
//             onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//           />
//           <button type="submit" className="btn-primary">Save Product</button>
//         </form>
//       )}

//       {/* ✅ Product List */}
//       <div className="product-list">
//         {filteredProducts.length === 0 ? (
//           <p>No products available.</p>
//         ) : (
//           <table className="product-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Name</th>
//                 <th>Price (₹)</th>
//                 <th>Stock</th>
//                 <th>Orders</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProducts.map((p) => (
//                 <tr key={p.id}>
//                   <td>
//                     {p.imageUrl ? (
//                       <img
//                         src={p.imageUrl}
//                         alt={p.name}
//                         style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
//                       />
//                     ) : (
//                       <span className="no-image">No Image</span>
//                     )}
//                   </td>
//                   <td>{p.name}</td>
//                   <td>{p.price}</td>
//                   <td>{p.stock}</td>
//                   <td>{getOrderCount(p.id)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }








// src/admin/ProductsAdmin.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import "./Admin.css";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([
    "Category001",
    "Category002",
    "Category003",
    "Category004",
    "Category005",
  ]);
  const [specifications, setSpecifications] = useState([
    { key: "Cooling Capacity", value: "" },
    { key: "Weight", value: "" },
    { key: "Power", value: "" },
    { key: "Voltage", value: "" },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    base_price: "",
    discount_percent: "0",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    gallery: "",
    tags: "",
    features: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null); // 🔹 Track editing product

  // 🔹 Fetch products and orders
  useEffect(() => {
    const fetchData = async () => {
      const productSnapshot = await getDocs(collection(db, "products"));
      const orderSnapshot = await getDocs(collection(db, "orders"));
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const orderList = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setOrders(orderList);
    };
    fetchData();
  }, []);

  // 🔹 Auto calculate price when base_price or discount changes
  useEffect(() => {
    const base = parseFloat(newProduct.base_price) || 0;
    const discount = parseFloat(newProduct.discount_percent) || 0;
    const finalPrice = base - (base * discount) / 100;
    setNewProduct((prev) => ({ ...prev, price: finalPrice.toFixed(2) }));
  }, [newProduct.base_price, newProduct.discount_percent]);

  // 🔹 Calculate number of orders for each product
  const getOrderCount = (productId) => {
    return orders.reduce((count, order) => {
      if (order.items && Array.isArray(order.items)) {
        return (
          count + order.items.filter((item) => item.productId === productId).length
        );
      }
      return count;
    }, 0);
  };

  // 🔹 Handle add/update product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.base_price ||
      !newProduct.stock ||
      !newProduct.description ||
      !newProduct.imageUrl
    ) {
      alert("Please fill all required fields");
      return;
    }

    const tagsArray = newProduct.tags
      ? newProduct.tags.split(",").map((t) => t.trim()).slice(0, 10)
      : [];
    const featuresArray = newProduct.features
      ? newProduct.features.split(",").map((f) => f.trim())
      : [];
    const galleryArray = newProduct.gallery
      ? newProduct.gallery.split(",").map((g) => g.trim())
      : [];

    const specsMap = {};
    specifications.forEach((spec) => {
      if (spec.key && spec.value) {
        specsMap[spec.key] = isNaN(spec.value) ? spec.value : Number(spec.value);
      }
    });

    if (editId) {
      // 🔹 Update existing product
      const productRef = doc(db, "products", editId);
      await updateDoc(productRef, {
        ...newProduct,
        base_price: parseFloat(newProduct.base_price),
        price: parseFloat(newProduct.price),
        discount_percent: parseFloat(newProduct.discount_percent) || 0,
        stock: parseInt(newProduct.stock),
        gallery: galleryArray,
        tags: tagsArray,
        features: featuresArray,
        specifications: specsMap,
        updatedAt: serverTimestamp(),
      });
    } else {
      // 🔹 Add new product
      await addDoc(collection(db, "products"), {
        ...newProduct,
        brand: newProduct.brand || "Unknown",
        category: newProduct.category || "Uncategorized",
        base_price: parseFloat(newProduct.base_price),
        price: parseFloat(newProduct.price),
        discount_percent: parseFloat(newProduct.discount_percent) || 0,
        stock: parseInt(newProduct.stock),
        gallery: galleryArray,
        tags: tagsArray,
        features: featuresArray,
        specifications: specsMap,
        avgRating: 0,
        rating: 0,
        reviewCount: 0,
        reviews: [],
        sales: 0,
        isFeatured: false,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Reset form
    resetForm();
    window.location.reload();
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      brand: "",
      category: "",
      base_price: "",
      discount_percent: "0",
      price: "",
      stock: "",
      description: "",
      imageUrl: "",
      gallery: "",
      tags: "",
      features: "",
    });
    setSpecifications([
      { key: "Cooling Capacity", value: "" },
      { key: "Weight", value: "" },
      { key: "Power", value: "" },
      { key: "Voltage", value: "" },
    ]);
    setEditId(null);
    setShowForm(false);
  };

  // 🔹 Start editing product
  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      brand: product.brand,
      category: product.category,
      base_price: product.base_price,
      discount_percent: product.discount_percent,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      gallery: product.gallery ? product.gallery.join(", ") : "",
      tags: product.tags ? product.tags.join(", ") : "",
      features: product.features ? product.features.join(", ") : "",
    });

    // Convert specifications map back to array
    const specsArr = Object.entries(product.specifications || {}).map(
      ([key, value]) => ({ key, value })
    );
    setSpecifications(specsArr.length ? specsArr : [{ key: "", value: "" }]);
    setEditId(product.id);
    setShowForm(true);
  };

  // 🔹 Update specification
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  const addSpecField = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecField = (index) => {
    const updatedSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(updatedSpecs);
  };

  const addCategory = () => {
    setCategories([...categories, `Category${categories.length + 1}`]);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-admin">
      <h2>Manage Products</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ Toggle Add/Edit Product Form */}
      <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Product"}
      </button>

      {showForm && (
        <form className="add-product-form" onSubmit={handleSaveProduct}>
          <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Brand"
            value={newProduct.brand}
            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
          />

          {/* Category selection */}
          <div className="category-section">
            {categories.map((cat, index) => (
              <div key={index} className="category-item">
                <input
                  type="radio"
                  id={`cat-${index}`}
                  className="category-input"
                  name="category"
                  value={cat}
                  checked={newProduct.category === cat}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
                <label htmlFor={`cat-${index}`} className="category-label">
                  {cat}
                </label>
              </div>
            ))}
            <button type="button" onClick={addCategory}>
              + Add Category
            </button>
          </div>

          <input
            type="number"
            placeholder="Base Price (₹)"
            value={newProduct.base_price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, base_price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Discount %"
            value={newProduct.discount_percent}
            onChange={(e) =>
              setNewProduct({ ...newProduct, discount_percent: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Final Price (auto)"
            value={newProduct.price}
            readOnly
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
          <textarea
            placeholder="Gallery URLs (comma separated)"
            value={newProduct.gallery}
            onChange={(e) =>
              setNewProduct({ ...newProduct, gallery: e.target.value })
            }
          />
          <textarea
            placeholder="Tags (comma separated, max 10)"
            value={newProduct.tags}
            onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
          />
          <textarea
            placeholder="Features (comma separated)"
            value={newProduct.features}
            onChange={(e) =>
              setNewProduct({ ...newProduct, features: e.target.value })
            }
          />

          {/* Specifications */}
          <div className="specifications-section">
            <h4>Specifications</h4>
            {specifications.map((spec, index) => (
              <div className="spec-row" key={index}>
                <input
                  type="text"
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                />
                <button type="button" onClick={() => removeSpecField(index)}>
                  ❌
                </button>
              </div>
            ))}
            <button type="button" onClick={addSpecField}>
              + Add Specification
            </button>
          </div>

          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />

          <button type="submit" className="btn-primary full-width">
            {editId ? "Update Product" : "Save Product"}
          </button>
        </form>
      )}

      {/* ✅ Product List */}
      <div className="product-list">
        {filteredProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td>{getOrderCount(p.id)}</td>
                  <td>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEditProduct(p)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
