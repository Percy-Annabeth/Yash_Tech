import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    console.log("Product data:", product);
  return (
    <Card className="custom-product-card">
      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl}
        alt={product.name}
        className="product-card-media"
      />

      {/* Product Info */}
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          className="product-card-name"
          title={product.name}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="product-card-brand"
        >
          Brand: {product.brand || "N/A"}
        </Typography>

        {/* Price Section */}
        <div className="price-section">
          <Typography
            variant="subtitle1"
            color="primary"
            className="product-card-price"
          >
            ₹{product.price?.toLocaleString()}
          </Typography>

          {/* Show base price only if it's greater */}
          {product.base_price && product.base_price > product.price && (
            <Typography variant="body2" className="base-price">
              ₹{product.base_price?.toLocaleString()}
            </Typography>
          )}

          {/* Discount badge */}
          {product.discount_percent && product.discount_percent > 0 && (
            <span className="discount-badge">
              DISCOUNT! {product.discount_percent}%
            </span>
          )}
        </div>

      {/* ✅ Show only first 2 specifications */}
<div className="product-specs">
  <h3>Specifications</h3>
  <ul>
    {Object.entries(product.specifications).slice(0, 2).map(([key, value], index) => (
      <li key={index}>
        <strong>{key}:</strong> {value}
      </li>
    ))}
  </ul>
</div>

      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button
          size="small"
          component={Link}
          to={`/products/${product.id}`}
          className="view-btn"
        >
          View
        </Button>
        <Button size="small" variant="contained" className="cart-btn">
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
