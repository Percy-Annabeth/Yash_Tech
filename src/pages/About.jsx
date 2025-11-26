import React from "react";
import { motion } from "framer-motion";
import { 
  EngineeringOutlined, 
  GroupsOutlined, 
  RocketLaunchOutlined,
  VerifiedUserOutlined,
  SupportAgentOutlined,
  TrendingUpOutlined
} from "@mui/icons-material";
import "./About.css";

const About = () => {
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
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Pioneering Industrial Cooling Excellence</h1>
          <p>Since 2008, transforming industries with innovative HVAC solutions</p>
        </motion.div>
      </section>

      {/* Company Overview */}
      <motion.section 
        className="about-overview"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="overview-content">
          <div className="overview-text">
            <div className="section-badge">Who We Are</div>
            <h2>Your Trusted HVAC Partner</h2>
            <p className="lead-text">
              Based in <strong>Faridabad, Haryana</strong>, Yash Technologies has been 
              at the forefront of industrial cooling innovation for over 15 years. We 
              specialize in delivering premium Panel AC units and accessories to industries 
              across India.
            </p>
            <p>
              Our commitment to quality, reliability, and customer satisfaction has made us 
              the preferred choice for over 500+ enterprises in manufacturing, telecom, 
              automation, and data center sectors.
            </p>
            <div className="company-stats">
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Years in Business</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Units Delivered</span>
              </div>
            </div>
          </div>
          <div className="overview-image">
            <div className="image-placeholder">
              <EngineeringOutlined sx={{ fontSize: 120, color: "#667eea" }} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section 
        className="about-values"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-badge">Our Values</div>
        <h2>What Drives Us</h2>
        <div className="values-grid">
          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <EngineeringOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>Innovation First</h3>
            <p>
              Constantly evolving our product line with cutting-edge technology 
              to meet modern industrial demands.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <VerifiedUserOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>Quality Assurance</h3>
            <p>
              ISO certified manufacturing with rigorous quality checks ensuring 
              every unit meets international standards.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <GroupsOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>Customer Focus</h3>
            <p>
              Building lasting relationships through exceptional service, 
              transparent communication, and reliable support.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <SupportAgentOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>24/7 Support</h3>
            <p>
              Round-the-clock technical assistance ensuring your operations 
              never face downtime due to cooling issues.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <RocketLaunchOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>Fast Delivery</h3>
            <p>
              Pan-India logistics network ensuring quick dispatch and safe 
              delivery to your location within 48-72 hours.
            </p>
          </motion.div>

          <motion.div className="value-card" variants={fadeInUp}>
            <div className="value-icon">
              <TrendingUpOutlined sx={{ fontSize: 50 }} />
            </div>
            <h3>Competitive Pricing</h3>
            <p>
              Direct manufacturer pricing with no middlemen, offering 
              the best value without compromising on quality.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Mission */}
      <motion.section 
        className="about-mission"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mission-content">
          <div className="section-badge">Our Mission</div>
          <h2>Empowering Industries Through Reliable Cooling</h2>
          <p>
            To be India's most trusted name in industrial HVAC solutions by delivering 
            superior products, exceptional service, and continuous innovation that helps 
            our clients achieve operational excellence.
          </p>
          <div className="mission-highlights">
            <div className="highlight">
              <h4>🎯 Vision</h4>
              <p>Leading the industrial cooling revolution with sustainable, energy-efficient solutions</p>
            </div>
            <div className="highlight">
              <h4>🤝 Commitment</h4>
              <p>Ensuring every client receives personalized attention and customized solutions</p>
            </div>
            <div className="highlight">
              <h4>🌱 Sustainability</h4>
              <p>Developing eco-friendly products that reduce carbon footprint and energy consumption</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section 
        className="about-why-choose"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="section-badge">Why Choose Us</div>
        <h2>The Yash Technologies Advantage</h2>
        <div className="why-choose-grid">
          <div className="why-item">
            <span className="why-number">01</span>
            <h3>In-House Manufacturing</h3>
            <p>
              Our E-Therm production facility ensures complete quality control 
              and faster turnaround times for custom orders.
            </p>
          </div>
          <div className="why-item">
            <span className="why-number">02</span>
            <h3>Expert Team</h3>
            <p>
              50+ skilled engineers and technicians with decades of combined 
              experience in HVAC systems and industrial cooling.
            </p>
          </div>
          <div className="why-item">
            <span className="why-number">03</span>
            <h3>Extensive Product Range</h3>
            <p>
              From 1 Ton to 5 Ton capacities, we offer comprehensive solutions 
              for all industrial cooling requirements.
            </p>
          </div>
          <div className="why-item">
            <span className="why-number">04</span>
            <h3>5-Year Warranty</h3>
            <p>
              Industry-leading warranty coverage with free service support and 
              genuine spare parts availability.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="about-cta"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <h2>Ready to Experience the Difference?</h2>
        <p>Join hundreds of satisfied clients who trust Yash Technologies for their cooling needs</p>
        <div className="cta-buttons">
          <motion.a 
            href="/products" 
            className="cta-btn primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Products
          </motion.a>
          <motion.a 
            href="/contact" 
            className="cta-btn secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.a>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default About;