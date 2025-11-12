



// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import headerImg from "../assets/header_img_1.png";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./Header.css";

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((s, i) => s + (i.qty ?? i.quantity ?? 0), 0);

  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // 🔹 Search State
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔹 Debounced Search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const productsRef = collection(db, "products");
        // Example: match name that contains search text (simple client-side filter after fetch)
        const snapshot = await getDocs(productsRef);
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allProducts.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
        setResults(filtered);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
  };

  // Shrinking Header logic (your existing code)
  const MAX_SCROLL = 140;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      setProgress((prev) => {
        let newProgress = prev;
        if (delta > 0) {
          newProgress = Math.min(1, prev + delta / MAX_SCROLL);
        } else if (delta < 0) {
          newProgress = Math.max(0, prev + delta / MAX_SCROLL);
        }
        return newProgress;
      });

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const paddingLarge = 18;
  const paddingSmall = 8;
  const padding = paddingLarge - (paddingLarge - paddingSmall) * progress;
  const logoScaleTop = 1.12;
  const logoScale = 1 + (logoScaleTop - 1) * (1 - progress);
  const boxShadow = progress > 0 ? "0 6px 18px rgba(15,23,42,0.12)" : "none";

  useEffect(() => {
    const appbar = document.querySelector(".header-appbar");
    if (appbar) {
      document.body.style.paddingTop = appbar.offsetHeight + "px";
    }
  }, [progress]);

  return (
    <AppBar
      position="fixed"
      className="header-appbar"
      style={{
        zIndex: 1400,
        boxShadow: boxShadow,
        backgroundImage: `url(${headerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toolbar
        className="header-toolbar"
        style={{ padding: `${padding}px 20px` }}
      >
        <div className="header-left">
          <Typography
            variant="h6"
            component={Link}
            to="/"
            className="header-logo"
            style={{
              transform: `scale(${logoScale})`,
              transformOrigin: "left center",
            }}
          >
            Yash Technologies
          </Typography>

          <nav
            className="header-nav"
            style={{ transform: `translateY(${(1 - progress) * 8}px)` }}
          >
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
        </div>

        {/* 🔹 Search Bar */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search && setShowDropdown(true)}
          />
          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/products/${item.id}`);
                    setSearch("");
                    setShowDropdown(false);
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-right">
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#0D47A1",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    border: "2px solid #fff",
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: "0 0 8px #0D47A1",
                    },
                  }}
                >
                  {user.displayName
                    ? user.displayName[0].toUpperCase()
                    : "U"}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 2,
                    minWidth: 180,
                    bgcolor: "#0B3D91",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  },
                }}
              >
                {[
                  { label: "My Orders", path: "/orders" },
                  ...(user.role === "admin"
                    ? [{ label: "Manage Site", path: "/admin" }]
                    : []),
                  { label: "Logout", action: handleLogout },
                ].map((item, idx) => (
                  <MenuItem
                    key={idx}
                    onClick={() => {
                      if (item.path) navigate(item.path);
                      if (item.action) item.action();
                      handleMenuClose();
                    }}
                    sx={{
                      "&:hover": {
                        bgcolor: "#0D47A1",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <IconButton component={Link} to="/auth" color="inherit">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#0D47A1",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  border: "2px solid #fff",
                }}
              >
                U
              </Avatar>
            </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
