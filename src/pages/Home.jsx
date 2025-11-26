import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { 
  TrendingUp, 
  VerifiedUser, 
  LocalShipping, 
  SupportAgent,
  ThumbUp,
  Groups
} from "@mui/icons-material";
import "./Home.css";

const HomePage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="home-container"
    >
      {/* Hero Section with Parallax Effect */}
      <section className="hero-section">
        <div className="hero-overlay">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Yash Technologies
          </motion.h1>
          <motion.p 
            className="hero-slogan"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Precision Cooling Solutions for Industrial Excellence
          </motion.p>
          <motion.p 
            className="hero-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Trusted by 500+ industries across India for reliable HVAC solutions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href="/products"
              className="hero-btn"
            >
              Explore Products →
            </Button>
          </motion.div>
        </div>
        {/* Animated scroll indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>↓</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="stat-card" variants={scaleIn}>
          <TrendingUp className="stat-icon" />
          <h3>500+</h3>
          <p>Happy Clients</p>
        </motion.div>
        <motion.div className="stat-card" variants={scaleIn}>
          <VerifiedUser className="stat-icon" />
          <h3>15+</h3>
          <p>Years Experience</p>
        </motion.div>
        <motion.div className="stat-card" variants={scaleIn}>
          <LocalShipping className="stat-icon" />
          <h3>10,000+</h3>
          <p>Units Delivered</p>
        </motion.div>
        <motion.div className="stat-card" variants={scaleIn}>
          <SupportAgent className="stat-icon" />
          <h3>24/7</h3>
          <p>Support</p>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="about-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-badge">About Us</div>
        <h2>Industry Leaders in HVAC Solutions</h2>
        <p className="about-lead">
          Based in <b>Faridabad, Haryana</b>, Yash Technologies has been at the forefront of 
          delivering cutting-edge industrial cooling solutions across India for over 15 years.
        </p>
        <div className="about-features">
          <div className="feature-item">
            <ThumbUp className="feature-icon" />
            <h4>Quality Assured</h4>
            <p>ISO certified products with rigorous quality checks</p>
          </div>
          <div className="feature-item">
            <Groups className="feature-icon" />
            <h4>Expert Team</h4>
            <p>50+ skilled engineers and technicians</p>
          </div>
          <div className="feature-item">
            <LocalShipping className="feature-icon" />
            <h4>Pan-India Delivery</h4>
            <p>Fastest delivery across all major cities</p>
          </div>
        </div>
      </motion.section>

      {/* Partnership Section */}
      <motion.section
        className="partnership-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="partnership-content">
          <div className="partnership-text">
            <div className="section-badge">Our Partnership</div>
            <h2>Powering Innovation Together</h2>
            <p>
              We are proud to collaborate with <b>leading HVAC manufacturers</b> and 
              <b> technology partners</b> to bring you the most advanced cooling solutions. 
              Our partnerships ensure you get cutting-edge technology, reliable service, 
              and competitive pricing.
            </p>
            <ul className="partnership-benefits">
              <li>✓ Access to latest HVAC technologies</li>
              <li>✓ Extended warranty and support</li>
              <li>✓ Competitive bulk pricing</li>
              <li>✓ Priority technical assistance</li>
            </ul>
          </div>
          <div className="partnership-visual">
            <div className="partner-badge">Trusted Partner</div>
          </div>
        </div>
      </motion.section>

      {/* Products Showcase */}
      <motion.section
        className="products-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="section-badge">Our Products</div>
        <h2>Premium Industrial Cooling Solutions</h2>

        {/* Industrial Panel AC */}
        <motion.div
          className="product-card"
          variants={fadeInUp}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="product-img home_bg_img_2">
            <div className="product-badge">Bestseller</div>
          </div>
          <div className="product-content">
            <h3>Industrial Panel AC (by E-Therm)</h3>
            <p className="product-subtitle">
              Manufactured by our own production company <b>E-Therm</b>, these
              panel air conditioners deliver unmatched reliability, energy efficiency, 
              and value for money.
            </p>
            <div className="product-highlights">
              <div className="highlight-box">
                <span className="highlight-number">4</span>
                <span className="highlight-label">Capacity Options</span>
              </div>
              <div className="highlight-box">
                <span className="highlight-number">30%</span>
                <span className="highlight-label">Energy Saving</span>
              </div>
              <div className="highlight-box">
                <span className="highlight-number">5 Yr</span>
                <span className="highlight-label">Warranty</span>
              </div>
            </div>
            <ul className="product-features">
              <li>✓ Available in 1 Ton, 1.5 Ton, 2 Ton, and 3 Ton capacities</li>
              <li>✓ Engineered for industrial panels & electrical enclosures</li>
              <li>✓ Dust-resistant, weatherproof construction</li>
              <li>✓ Low-maintenance design with easy filter access</li>
              <li>✓ Trusted across manufacturing, telecom, and automation industries</li>
            </ul>
            <div className="product-actions">
              <Button
                variant="contained"
                color="primary"
                href="/products"
                size="large"
              >
                View All Models
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="/contact"
                size="large"
              >
                Get Quote
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Foam */}
        <motion.div
          className="product-card reverse"
          variants={fadeInUp}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="product-img home_bg_img_3">
            <div className="product-badge eco">Eco-Friendly</div>
          </div>
          <div className="product-content">
            <h3>Premium Filter Foam</h3>
            <p className="product-subtitle">
              High-quality filter foams designed for optimal airflow and dust filtration 
              in industrial panel cooling systems. Extend your equipment life and maintain peak performance.
            </p>
            <div className="foam-specs">
              <div className="spec-item">
                <h4>Thickness Options</h4>
                <p>5mm | 10mm | 15mm | 20mm</p>
              </div>
              <div className="spec-item">
                <h4>Filtration Grade</h4>
                <p>G3, G4, F5 (EN 779)</p>
              </div>
              <div className="spec-item">
                <h4>Custom Sizes</h4>
                <p>Any dimension available</p>
              </div>
            </div>
            <ul className="product-features">
              <li>✓ Multiple thickness options for different airflow requirements</li>
              <li>✓ Customizable dimensions to fit any panel AC unit</li>
              <li>✓ Washable and reusable - eco-friendly choice</li>
              <li>✓ Fire-retardant material for industrial safety</li>
              <li>✓ Easy installation with adhesive backing available</li>
            </ul>
            <div className="product-actions">
              <Button
                variant="outlined"
                color="secondary"
                href="/products"
                size="large"
              >
                Browse Filters
              </Button>
              <Button
                variant="contained"
                color="secondary"
                href="/contact"
                size="large"
              >
                Custom Order
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="why-choose-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-badge">Why Choose Us</div>
        <h2>Your Trusted HVAC Partner</h2>
        <div className="why-grid">
          <motion.div 
            className="why-card"
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          >
            <div className="why-icon">🏆</div>
            <h3>Premium Quality</h3>
            <p>ISO certified products manufactured to international standards with rigorous quality control</p>
          </motion.div>
          <motion.div 
            className="why-card"
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          >
            <div className="why-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Direct from manufacturer pricing with transparent costs and no hidden charges</p>
          </motion.div>
          <motion.div 
            className="why-card"
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          >
            <div className="why-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Pan-India logistics network ensures quick delivery to your doorstep</p>
          </motion.div>
          <motion.div 
            className="why-card"
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          >
            <div className="why-icon">🛡️</div>
            <h3>5-Year Warranty</h3>
            <p>Comprehensive warranty coverage with free service support and spare parts</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2>Ready to Experience Superior Cooling?</h2>
        <p>Join 500+ satisfied customers who trust Yash Technologies for their industrial HVAC needs</p>
        <div className="cta-buttons">
          <Button
            variant="contained"
            size="large"
            href="/products"
            className="cta-btn primary"
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/contact"
            className="cta-btn secondary"
          >            
            Contact Sales
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;