import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion, AnimatePresence } from "framer-motion";
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
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 100000]);
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
        setTopSellers([...prodList].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 4));

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

  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

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

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setTempPriceRange([0, 100000]);
    setSort("newest");
  };

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
        filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
    }

    return filtered;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return <LoadingScreen fullscreen={false} />;
  }

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || 
                          priceRange[0] !== 0 || priceRange[1] !== 100000;

  return (
    <div className="products-page">
      {/* Enhanced Banner */}
      <motion.div 
        className="banner"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Discover Premium HVAC Solutions</h1>
        <p>Explore our curated collection of industrial cooling equipment</p>
        <div className="banner-stats">
          <div className="banner-stat">
            <span className="stat-number">{products.length}+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="banner-stat">
            <span className="stat-number">{uniqueBrands.length}+</span>
            <span className="stat-label">Brands</span>
          </div>
          <div className="banner-stat">
            <span className="stat-number">{uniqueCategories.length}+</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </motion.div>

      {/* Top Sellers */}
      <motion.section 
        className="section top-sellers"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-header">
          <h2>🔥 Top Sellers</h2>
          <p>Most purchased products this month</p>
        </div>
        <motion.div className="product-grid" variants={containerVariants}>
          {topSellers.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Most Discounted */}
      <motion.section 
        className="section most-discount"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-header">
          <h2>💸 Best Deals</h2>
          <p>Maximum savings on quality products</p>
        </div>
        <motion.div className="product-grid" variants={containerVariants}>
          {discounted.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Most Viewed */}
      <motion.section 
        className="section popular"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-header">
          <h2>👀 Trending Now</h2>
          <p>What our customers are viewing</p>
        </div>
        <motion.div className="product-grid" variants={containerVariants}>
          {popular.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* All Products with Filters */}
      <motion.section 
        className="section all-products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="all-header">
          <div>
            <h2>All Products</h2>
            <p className="results-count">
              Showing {getFilteredProducts().length} of {products.length} products
            </p>
          </div>
          <div className="header-controls">
            {hasActiveFilters && (
              <motion.button 
                className="clear-filters-btn"
                onClick={clearAllFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            )}
            <select 
              className="filter-dropdown" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              >
              <option value="newest">Newest First</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Filters Section */}
        <motion.div 
          className="filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Brand Filter */}
          <div className="filter-group">
            <h4>
              <span className="filter-icon">🏷️</span> Brands
              {selectedBrands.length > 0 && (
                <span className="filter-count">{selectedBrands.length}</span>
              )}
            </h4>
            <div className="filter-buttons">
              <AnimatePresence>
                {uniqueBrands
                  .slice(0, showBrands ? undefined : 4)
                  .map((brand, i) => (
                    <motion.button
                      key={i}
                      className={`filter-btn ${selectedBrands.includes(brand) ? "active" : ""}`}
                      onClick={() => toggleBrand(brand)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {brand}
                      {selectedBrands.includes(brand) && <span className="check-icon">✓</span>}
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>
            {uniqueBrands.length > 4 && (
              <motion.button 
                className="show-more" 
                onClick={() => setShowBrands((prev) => !prev)}
                whileHover={{ x: 5 }}
              >
                {showBrands ? "Show Less ↑" : "Show More →"}
              </motion.button>
            )}
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4>
              <span className="filter-icon">📦</span> Categories
              {selectedCategories.length > 0 && (
                <span className="filter-count">{selectedCategories.length}</span>
              )}
            </h4>
            <div className="filter-buttons">
              <AnimatePresence>
                {uniqueCategories
                  .slice(0, showCategories ? undefined : 4)
                  .map((cat, i) => (
                    <motion.button
                      key={i}
                      className={`filter-btn ${selectedCategories.includes(cat) ? "active" : ""}`}
                      onClick={() => toggleCategory(cat)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {cat}
                      {selectedCategories.includes(cat) && <span className="check-icon">✓</span>}
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>
            {uniqueCategories.length > 4 && (
              <motion.button 
                className="show-more" 
                onClick={() => setShowCategories((prev) => !prev)}
                whileHover={{ x: 5 }}
              >
                {showCategories ? "Show Less ↑" : "Show More →"}
              </motion.button>
            )}
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <h4>
              <span className="filter-icon">💰</span> Price Range
            </h4>
            <div className="price-filter">
              <input
                type="number"
                value={tempPriceRange[0]}
                onChange={(e) => setTempPriceRange([+e.target.value, tempPriceRange[1]])}
                min="0"
                placeholder="Min"
              />
              <span className="price-separator">—</span>
              <input
                type="number"
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([tempPriceRange[0], +e.target.value])}
                min="0"
                placeholder="Max"
              />
              <motion.button 
                onClick={applyPriceFilter} 
                className="apply-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="product-grid"
            key={`${sort}-${selectedBrands.join()}-${selectedCategories.join()}-${priceRange.join()}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {getFilteredProducts().length === 0 ? (
              <motion.div 
                className="no-products"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="no-products-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters to see more results</p>
                <motion.button 
                  className="reset-filters-btn"
                  onClick={clearAllFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset All Filters
                </motion.button>
              </motion.div>
            ) : (
              getFilteredProducts().map((p) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProductCard product={p} />
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </div>
  );
};

export default Products;