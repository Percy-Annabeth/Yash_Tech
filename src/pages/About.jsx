import React from "react";
import { motion } from "framer-motion";
import { FaLaptopCode, FaUsers, FaRocket } from "react-icons/fa";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>About Us</h1>
      <p style={{ fontSize: "1.1rem", textAlign: "center", marginBottom: "40px" }}>
        At Yash Tech, we are passionate about creating cutting-edge tech products that make life easier and more exciting.
      </p>

      <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
        <div>
          <FaLaptopCode size={50} color="#1976d2" />
          <h3>Innovative Solutions</h3>
          <p>We deliver modern, high-performance products.</p>
        </div>
        <div>
          <FaUsers size={50} color="#1976d2" />
          <h3>Customer Focus</h3>
          <p>Your satisfaction drives our innovation.</p>
        </div>
        <div>
          <FaRocket size={50} color="#1976d2" />
          <h3>Fast Delivery</h3>
          <p>We ensure quick and safe delivery worldwide.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
