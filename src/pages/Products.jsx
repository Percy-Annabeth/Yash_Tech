import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import LoadingScreen from "../components/LoadingScreen";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [popular, setPopular] = useState([]);
  const [discounted, setDiscounted] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 100000]); // applied filter
  const [tempPriceRange, setTempPriceRange] = useState([0, 100000]); // input values
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [showBrands, setShowBrands] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const prodSnap = await getDocs(
          query(collection(db, "products"), orderBy("createdAt", "desc"))
        );
        const prodList = prodSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(prodList);

        // Top sellers
        setTopSellers([...prodList].sort((a, b) => b.sales - a.sales).slice(0, 4));

        // Most viewed
        setPopular([...prodList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4));

        // Most discounted
        setDiscounted(
          [...prodList]
            .sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0))
            .slice(0, 4)
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ✅ dynamic filter options
  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  // ✅ toggle handlers
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyPriceFilter = () => {
    setPriceRange([...tempPriceRange]);
  };

  // ✅ filter + sort handler
  const getFilteredProducts = () => {
    let filtered = [...products];

    // filter by price
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // filter by brand
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // sort
    switch (sort) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "top-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        break;
    }

    return filtered;
  };

  if (loading) {
    return <LoadingScreen fullscreen={false} />;
  }

  return (
    <div className="products-page">
      {/* Banner */}
      <div className="banner">
        <h1>Our Products</h1>
        <p>Explore our best-selling, most viewed, and biggest discounts</p>
      </div>

      {/* Top Sellers */}
      <section className="section top-sellers">
        <h2>🔥 Top Sellers</h2>
        <div className="product-grid">
          {topSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Most Discounted */}
      <section className="section most-discount">
        <h2>💸 Most Discounted</h2>
        <div className="product-grid">
          {discounted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Most Viewed */}
      <section className="section popular">
        <h2>👀 Most Viewed</h2>
        <div className="product-grid">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* All Products with Filters */}
      <section className="section all-products">
        <div className="all-header">
          <h2>All Products</h2>
          <select className="filter-dropdown" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="top-rated">Top Rated</option>
          </select>
        </div>

        {/* ✅ Filters Section */}
        <div className="filters">
          {/* Brand Filter */}
          <div className="filter-group">
            <h4>Brands</h4>
            <div className="filter-buttons">
              {uniqueBrands
                .slice(0, showBrands ? undefined : 4)
                .map((brand, i) => (
                  <button
                    key={i}
                    className={`filter-btn ${selectedBrands.includes(brand) ? "active" : ""}`}
                    onClick={() => toggleBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
            </div>
            {uniqueBrands.length > 4 && (
              <button className="show-more" onClick={() => setShowBrands((prev) => !prev)}>
                {showBrands ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4>Categories</h4>
            <div className="filter-buttons">
              {uniqueCategories
                .slice(0, showCategories ? undefined : 4)
                .map((cat, i) => (
                  <button
                    key={i}
                    className={`filter-btn ${selectedCategories.includes(cat) ? "active" : ""}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
            </div>
            {uniqueCategories.length > 4 && (
              <button className="show-more" onClick={() => setShowCategories((prev) => !prev)}>
                {showCategories ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <h4>Price</h4>
            <div className="price-filter">
              <input
                type="number"
                value={tempPriceRange[0]}
                onChange={(e) => setTempPriceRange([+e.target.value, tempPriceRange[1]])}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([tempPriceRange[0], +e.target.value])}
                min="0"
              />
              <button onClick={applyPriceFilter} className="apply-btn">
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="product-grid">
          {getFilteredProducts().map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
