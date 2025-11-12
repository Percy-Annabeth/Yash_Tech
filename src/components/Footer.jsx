import React from "react";
import footerImg from "../assets/header_img_1.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        backgroundImage: `url(${footerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="footer-overlay">
        <div className="footer-content container">
          <div className="footer-left">
            <h2>Yash Technologies</h2>
            <p>Industrial HVAC & Accessories</p>
          </div>

          <div className="footer-right">
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Yash Technologies</p>
          <p>Designed & maintained by Yash Technologies</p>
        </div>
      </div>
    </footer>
  );
}
