



// SingleProduct.jsx
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
import Rating from "@mui/material/Rating";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import BalanceIcon from "@mui/icons-material/Balance";
import StarIcon from "@mui/icons-material/Star";
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const productRef = doc(db, "products", id);
      const snap = await getDoc(productRef);
      if (!snap.exists()) return;

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

      // fetch similar products (same category)
      if (data.category) {
        try {
          const q = query(
            collection(db, "products"),
            where("category", "==", data.category),
            orderBy("views", "desc"),
            limit(4)
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
  }, [id]);

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
    if (!user) return navigate("/login");
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
    } catch (e) {
      console.error(e);
      alert("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleAddToCart = async () => {
  if (!user) {
    navigate("/login");
    return false;
  }
  if (!product) return false;

  const cartRef = doc(db, "carts", user.uid);

  try {
    await runTransaction(db, async (tx) => {
      const cartSnap = await tx.get(cartRef);
      const itemToAdd = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || "",
        quantity: 1,
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
          items[idx] = { ...items[idx], quantity: (items[idx].quantity || 0) + 1 };
        } else {
          items.push(itemToAdd);
        }

        tx.update(cartRef, { items, updatedAt: serverTimestamp() });
      }
    });

    return true; // ✅ success
  } catch (e) {
    console.error("Add to cart failed:", e);
    alert("Could not add to cart. Try again.");
    return false;
  }
};

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-container">
      {/* === Images === */}
      <div className="product-images">
        <img src={mainImage} alt={product.name} className="main-image" />
        <div className="thumbnail-row">
          {[product.imageUrl, ...(product.extraImages || []), ...(product.gallery || [])]
            .filter(Boolean)
            .map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
        </div>
      </div>

      {/* === Details === */}
      <div className="product-details">
        <h1>{product.name}</h1>
        <p className="brand">Brand: {product.brand}</p>
        <p className="category">Category: {product.category}</p>

        <div className="rating-row">
          <Rating value={avgRating || 0} precision={0.1} readOnly />
          <span>({reviewCount} reviews)</span>
        </div>

  

          <div className="price-section">
            <h2 className="price">
              {formatCurrency(product.price)}
              {product.discount_percent && product.discount_percent > 0 && (
              <span className="discount-badge">DISCOUNT! {product.discount_percent}%</span>
              )}
            </h2>

  {/* ✅ Show base price only if different */}
  {product.base_price && product.base_price > product.price && (
    <p className="base-price">{formatCurrency(product.base_price)}</p>
  )}
</div>



        {/* === Specifications === */}
        <div className="specs-section">
          <h3>Specifications</h3>
          <div className="specs-grid">
            {product.specifications &&
              Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-card">
                  <span className="spec-key">{key} : </span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* === Features === */}
        {product.features && product.features.length > 0 && (
          <div className="features-section">
            <h3>Features</h3>
            <ul className="features-list">
              {product.features.map((f, i) => (
                <li key={i} className="feature-item">{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* === Tags === */}
        {product.tags && product.tags.length > 0 && (
          <div className="tags-section">
            <h3>Tags</h3>
            <div className="tags-container">
              {product.tags.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="description-section">
          <h4 className="description-title">Description</h4>
          <p className="description">{product.description}</p>
        </div> 
                <p className="views">Views: {product.views || 0}</p>

        <div className="button-row">
  <button
    className="buy-btn"
    onClick={async () => {
      const ok = await handleAddToCart(); // ✅ wait for Firestore
      if (ok) navigate("/checkout");
    }}
  >
    Buy Now
  </button>
  <button className="cart-btn" onClick={handleAddToCart}>
    Add to Cart
  </button>
</div>
      </div>

      {/* === Reviews === */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <strong>{rev.userName}</strong>
              <Rating value={rev.rating} precision={0.5} readOnly />
              <small>{formatDate(rev.createdAt)}</small>
              <p>{rev.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        <div className="write-review">
          <h4>Write a Review</h4>
          <Rating
            value={newReview.rating}
            onChange={(_, val) => setNewReview((r) => ({ ...r, rating: val || 0 }))}
          />
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) => setNewReview((r) => ({ ...r, comment: e.target.value }))}
          />
          <button
            className="submit-review"
            onClick={handleReviewSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {!user && (
            <button className="cart-btn" onClick={() => navigate("/login")}>
              Login to write a review
            </button>
          )}
        </div>
      </div>

      {/* === Similar Products === */}
      {similarProducts.length > 0 && (
        <div className="similar-products">
          <h3>Similar Products</h3>
          <div className="similar-grid">
            {similarProducts.map((p) => (
              <Link to={`/products/${p.id}`} key={p.id} className="similar-card">
                <img src={p.imageUrl} alt={p.name} />
                <h4>{p.name}</h4>
                <p>{formatCurrency(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
