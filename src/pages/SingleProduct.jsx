import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, storage, auth } from "../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  runTransaction,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import Rating from "@mui/material/Rating";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import "./SingleProduct.css";
import { formatCurrency, formatDate } from "../utils/formatters";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const snap = await getDoc(productRef);
      if (!snap.exists()) {
        navigate("/404");
        return;
      }

      const data = snap.data();

      // increment views safely
      try {
        await updateDoc(productRef, { views: increment(1), updatedAt: serverTimestamp() });
      } catch (e) {
        console.warn("Couldn't increment views:", e);
      }

      // main image from path or url
      let mainUrl = data.imageUrl || "";
      if (data.imagePath) {
        try {
          mainUrl = await getDownloadURL(ref(storage, data.imagePath));
        } catch (err) {
          console.warn("imagePath download failed", err);
        }
      }

      const extraImages = [];
      if (Array.isArray(data.additionalImagePaths)) {
        for (const path of data.additionalImagePaths) {
          try {
            const url = await getDownloadURL(ref(storage, path));
            extraImages.push(url);
          } catch (_) {}
        }
      }

      setProduct({ id: snap.id, ...data, imageUrl: mainUrl, extraImages });
      setMainImage(mainUrl);

      // fetch similar products
      if (data.category) {
        try {
          const q = query(
            collection(db, "products"),
            where("category", "==", data.category),
            orderBy("views", "desc"),
            limit(5)
          );
          const querySnapshot = await getDocs(q);
          const sims = querySnapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((p) => p.id !== snap.id);
          setSimilarProducts(sims);
        } catch (err) {
          console.warn("similar products fetch failed", err);
        }
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const productRef = doc(db, "products", id);
    const reviewsRef = collection(productRef, "reviews");
    const q = query(reviewsRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReviews(list);
    });
    return () => unsub();
  }, [id]);

  const avgRating = useMemo(() => {
    if (product?.avgRating) return product.avgRating;
    if (!reviews.length) return 0;
    const total = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return total / reviews.length;
  }, [product, reviews]);

  const reviewCount = useMemo(() => {
    if (typeof product?.reviewCount === "number") return product.reviewCount;
    return reviews.length;
  }, [product, reviews]);

  const handleReviewSubmit = async () => {
    if (!user) return navigate("/auth");
    if (!newReview.comment.trim() || newReview.rating <= 0) {
      alert("Please provide a rating and a comment.");
      return;
    }
    setSubmitting(true);

    try {
      const productRef = doc(db, "products", id);
      const reviewsRef = collection(productRef, "reviews");

      await addDoc(reviewsRef, {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: serverTimestamp(),
      });

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(productRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const prevCount = data.reviewCount || 0;
        const prevAvg = data.avgRating || 0;

        const newCount = prevCount + 1;
        const newAvg = ((prevAvg * prevCount) + newReview.rating) / newCount;

        tx.update(productRef, {
          reviewCount: newCount,
          avgRating: Number(newAvg.toFixed(2)),
          updatedAt: serverTimestamp(),
        });
      });

      setNewReview({ rating: 0, comment: "" });
      alert("✅ Review submitted successfully!");
    } catch (e) {
      console.error(e);
      alert("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = async (buyNow = false) => {
    if (!user) {
      navigate("/auth");
      return false;
    }
    if (!product) return false;

    setAddingToCart(true);

    const cartRef = doc(db, "carts", user.uid);

    try {
      await runTransaction(db, async (tx) => {
        const cartSnap = await tx.get(cartRef);
        const itemToAdd = {
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || "",
          quantity: quantity,
        };

        if (!cartSnap.exists()) {
          tx.set(cartRef, {
            userId: user.uid,
            userEmail: user.email || "",
            items: [itemToAdd],
            updatedAt: serverTimestamp(),
          });
        } else {
          const data = cartSnap.data();
          const items = Array.isArray(data.items) ? [...data.items] : [];
          const idx = items.findIndex((it) => it.productId === itemToAdd.productId);

          if (idx > -1) {
            items[idx] = { ...items[idx], quantity: (items[idx].quantity || 0) + quantity };
          } else {
            items.push(itemToAdd);
          }

          tx.update(cartRef, { items, updatedAt: serverTimestamp() });
        }
      });

      if (buyNow) {
        navigate("/checkout");
      } else {
        alert(`✅ Added ${quantity} item(s) to cart!`);
      }
      return true;
    } catch (e) {
      console.error("Add to cart failed:", e);
      alert("Could not add to cart. Try again.");
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  const allImages = [product.imageUrl, ...(product.extraImages || []), ...(product.gallery || [])]
    .filter(Boolean);

  return (
    <motion.div 
      className="product-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-main">
        {/* === Images Section === */}
        <motion.div 
          className="product-images"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="main-image-container">
            <motion.img 
              key={mainImage}
              src={mainImage} 
              alt={product.name} 
              className="main-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            {product.discount_percent > 0 && (
              <div className="discount-badge-overlay">
                {product.discount_percent}% OFF
              </div>
            )}
          </div>
          <div className="thumbnail-row">
            {allImages.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            ))}
          </div>
        </motion.div>

        {/* === Details Section === */}
        <motion.div 
          className="product-details"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="product-header">
            <div className="breadcrumb">
              <Link to="/products">Products</Link> / <span>{product.category}</span>
            </div>
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="brand-tag">🏷️ {product.brand}</span>
              <span className="category-tag">📦 {product.category}</span>
            </div>
          </div>

          <div className="rating-section">
            <Rating value={avgRating || 0} precision={0.1} readOnly size="large" />
            <span className="rating-text">
              <strong>{avgRating.toFixed(1)}</strong> ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
            {product.views > 0 && (
              <span className="views-badge">👁️ {product.views} views</span>
            )}
          </div>

          <div className="price-section">
            <div className="price-main">
              <h2 className="current-price">{formatCurrency(product.price)}</h2>
              {product.base_price && product.base_price > product.price && (
                <>
                  <p className="original-price">{formatCurrency(product.base_price)}</p>
                  <span className="discount-badge">
                    SAVE {product.discount_percent}%
                  </span>
                </>
              )}
            </div>
            <div className="price-subtext">
              <span className="tax-info">Inclusive of all taxes</span>
              {product.stock > 0 ? (
                <span className="stock-status in-stock">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="stock-status out-of-stock">
                  ✗ Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="badge">
              <LocalShippingIcon />
              <span>Free Delivery</span>
            </div>
            <div className="badge">
              <VerifiedIcon />
              <span>Genuine Product</span>
            </div>
            <div className="badge">
              <SupportAgentIcon />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product.stock}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-row">
            <motion.button
              className="buy-btn"
              onClick={() => handleAddToCart(true)}
              disabled={product.stock === 0 || addingToCart}
              whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
              whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
            >
              {addingToCart ? "Processing..." : "Buy Now"}
            </motion.button>
            <motion.button 
              className="cart-btn" 
              onClick={() => handleAddToCart(false)}
              disabled={product.stock === 0 || addingToCart}
              whileHover={{ scale: product.stock > 0 ? 1.02 : 1 }}
              whileTap={{ scale: product.stock > 0 ? 0.98 : 1 }}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </motion.button>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>Product Description</h3>
            <p className="description">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="specs-section">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <motion.div 
                    key={key} 
                    className="spec-card"
                    whileHover={{ y: -5, boxShadow: "0 8px 20px rgba(13,71,161,0.15)" }}
                  >
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="features-section">
              <h3>Key Features</h3>
              <ul className="features-list">
                {product.features.map((f, i) => (
                  <motion.li 
                    key={i} 
                    className="feature-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    ✓ {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="tags-section">
              <h4>Tags:</h4>
              <div className="tags-container">
                {product.tags.map((t, i) => (
                  <motion.span 
                    key={i} 
                    className="tag"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* === Reviews Section === */}
      <motion.div 
        className="reviews-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Customer Reviews</h2>
        
        <div className="reviews-summary">
          <div className="summary-left">
            <div className="average-rating">
              <span className="rating-number">{avgRating.toFixed(1)}</span>
              <Rating value={avgRating || 0} precision={0.1} readOnly size="large" />
              <p>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>
          <div className="summary-right">
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => Math.floor(r.rating) === star).length;
                const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                return (
                  <div key={star} className="rating-bar">
                    <span className="star-label">{star} ★</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="count-label">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Write Review */}
        <div className="write-review">
          <h3>Write a Review</h3>
          {user ? (
            <>
              <div className="review-rating-input">
                <label>Your Rating:</label>
                <Rating
                  value={newReview.rating}
                  onChange={(_, val) => setNewReview((r) => ({ ...r, rating: val || 0 }))}
                  size="large"
                />
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
                rows={4}
              />
              <motion.button
                className="submit-review"
                onClick={handleReviewSubmit}
                disabled={submitting || newReview.rating === 0 || !newReview.comment.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </motion.button>
            </>
          ) : (
            <div className="login-prompt">
              <p>Please log in to write a review</p>
              <motion.button 
                className="login-btn" 
                onClick={() => navigate("/auth")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login / Sign Up
              </motion.button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          <AnimatePresence>
            {reviews.length > 0 ? (
              reviews.map((rev, index) => (
                <motion.div 
                  key={rev.id} 
                  className="review-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {rev.userName ? rev.userName[0].toUpperCase() : "A"}
                      </div>
                      <div>
                        <strong className="review-author">{rev.userName}</strong>
                        <span className="review-date">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>
                    <Rating value={rev.rating} precision={0.5} readOnly size="small" />
                  </div>
                  <p className="review-text">{rev.comment}</p>
                </motion.div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* === Similar Products === */}
      {similarProducts.length > 0 && (
        <motion.section 
          className="similar-products"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Similar Products</h2>
          <div className="similar-grid">
            {similarProducts.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products/${p.id}`} className="similar-card">
                  <div className="similar-image">
                    <img src={p.imageUrl} alt={p.name} />
                  </div>
                  <div className="similar-content">
                    <h4>{p.name}</h4>
                    <div className="similar-price">
                      <span className="price">{formatCurrency(p.price)}</span>
                      {p.avgRating > 0 && (
                        <span className="rating">
                          ⭐ {p.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default SingleProduct;