


import React from "react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import "./Home.css";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="home-container"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Yash Technologies</h1>
          <p className="hero-slogan">
            Cooling Solutions, Engineered for Industry
          </p>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href="/products"
            className="hero-btn"
          >
            Explore Products
          </Button>
        </div>
      </section>

      {/* About Section */}
      <motion.section
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>About Us</h2>
        <p>
          Based in <b>Faridabad, Haryana</b>, Yash Technologies has been
          delivering industrial cooling solutions across India for several
          years. With a strong commitment to quality and customer satisfaction,
          we have successfully served clients across multiple industries.
        </p>
      </motion.section>

      {/* Partnership */}
      <motion.section
        className="partnership-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Our Partnership</h2>
        <p>
          We are proud to be in collaboration with <b>Company X</b>,
          strengthening our ability to deliver the best cooling products and
          services.
        </p>
      </motion.section>

      {/* Products */}
      <motion.section
        className="products-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Our Products</h2>

        {/* Industrial Panel AC */}
        <motion.div
          className="product-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="product-img home_bg_img_2"></div>
          <div className="product-content">
            <h3>Industrial Panel AC (by E-Therm)</h3>
            <p>
              Manufactured by our own production company <b>E-Therm</b>, these
              panel air conditioners are reliable, energy-efficient, and
              affordable.
            </p>
            <ul>
              <li>Available in 1 Ton, 1.5 Ton, 2 Ton and more</li>
              <li>Engineered for industrial panels & enclosures</li>
              <li>Durable and low-maintenance design</li>
              <li>Trusted across industries in India</li>
            </ul>
            <Button
              variant="contained"
              color="primary"
              href="/products/panel-ac"
            >
              Buy Now
            </Button>
          </div>
        </motion.div>

        {/* Filter Foam */}
        <motion.div
          className="product-card reverse"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="product-img home_bg_img_3"></div>
          <div className="product-content">
            <h3>Filter Foam for Panel ACs</h3>
            <p>
              Our filter foams ensure smooth airflow and effective dust
              filtration in industrial panel cooling systems.
            </p>
            <ul>
              <li>Different thicknesses available</li>
              <li>Customizable sizes as per requirement</li>
              <li>Durable & easy to maintain</li>
            </ul>
            <Button
              variant="outlined"
              color="secondary"
              href="/invoice/filter-foam"
            >
              Get Invoice
            </Button>
          </div>
        </motion.div>
      </motion.section>

      {/* Closing */}
      <motion.section
        className="closing-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Why Choose Us?</h2>
        <p>
          At Yash Technologies, we believe in delivering not just products, but
          complete cooling solutions for your industry. Explore our range and
          experience <b>trusted performance at the best prices</b>.
        </p>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
