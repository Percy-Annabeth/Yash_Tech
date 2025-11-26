import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCartOutlined, 
  VisibilityOutlined,
  LocalOfferOutlined 
} from "@mui/icons-material";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const hasDiscount = product.discount_percent && product.discount_percent > 0;
  
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="custom-product-card">
        {/* Product Image */}
        <div className="card-image-container">
          <CardMedia
            component="img"
            height="220"
            image={product.imageUrl}
            alt={product.name}
            className="product-card-media"
          />
          
          {/* Badges */}
          {hasDiscount && (
            <div className="discount-badge-card">
              <LocalOfferOutlined sx={{ fontSize: 14 }} />
              {product.discount_percent}% OFF
            </div>
          )}
          
          {product.stock === 0 && (
            <div className="stock-badge out-of-stock">
              Out of Stock
            </div>
          )}
          
          {product.stock > 0 && product.stock <= 5 && (
            <div className="stock-badge low-stock">
              Only {product.stock} left!
            </div>
          )}

          {/* Quick View Overlay */}
          <Link to={`/products/${product.id}`} className="quick-view-overlay">
            <VisibilityOutlined sx={{ fontSize: 30 }} />
            <span>Quick View</span>
          </Link>
        </div>

        {/* Product Info */}
        <CardContent className="card-content">
          {/* Brand */}
          {product.brand && (
            <Typography className="product-card-brand">
              {product.brand}
            </Typography>
          )}

          {/* Name */}
          <Typography
            gutterBottom
            variant="h6"
            className="product-card-name"
            title={product.name}
          >
            {product.name}
          </Typography>

          {/* Rating */}
          {product.avgRating > 0 && (
            <div className="rating-section">
              <Rating 
                value={product.avgRating || 0} 
                precision={0.1} 
                readOnly 
                size="small"
              />
              <span className="review-count">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="price-section-card">
            <div className="price-main">
              <Typography className="product-card-price">
                ₹{product.price?.toLocaleString()}
              </Typography>
              {hasDiscount && product.base_price > product.price && (
                <Typography className="base-price-card">
                  ₹{product.base_price?.toLocaleString()}
                </Typography>
              )}
            </div>
          </div>

          {/* Specifications Preview */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="specs-preview">
              {Object.entries(product.specifications)
                .slice(0, 2)
                .map(([key, value], index) => (
                  <Chip
                    key={index}
                    label={`${key}: ${value}`}
                    size="small"
                    className="spec-chip"
                  />
                ))}
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <CardActions className="card-actions">
          <Button
            size="small"
            component={Link}
            to={`/products/${product.id}`}
            className="view-btn"
            fullWidth
            variant="outlined"
          >
            View Details
          </Button>
          <Button 
            size="small" 
            className="cart-btn-card"
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartOutlined />}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ProductCard;