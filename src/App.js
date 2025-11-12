// import React, { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

// import About from "./pages/About";
// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import SingleProduct from "./pages/SingleProduct";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
// import AuthPage from "./pages/AuthPage";
// import Checkout from "./pages/Checkout";
// import CartPage from "./pages/CartPage"; 
// import OrdersPage from "./pages/OrdersPage"; 

// // ✅ import the LoadingScreen component
// import LoadingScreen from "./components/LoadingScreen";

// // ✅ Firebase auth
// import { auth } from "./firebase/config";
// import { onAuthStateChanged } from "firebase/auth";

// const App = () => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Listen for Firebase authentication status
//     const unsubscribe = onAuthStateChanged(auth, () => {
//       // Firebase resolved auth state (either user or null)
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     // ✅ Show fullscreen loader until Firebase checks are done
//     return <LoadingScreen fullscreen={true} />;
//   }

//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:id" element={<SingleProduct />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/auth" element={<AuthPage />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/cart" element={<CartPage />} /> 
//         <Route path="/orders" element={<OrdersPage />} />

//         {/* ✅ You can still keep a dedicated loading route */}
//         <Route path="/loading" element={<LoadingScreen fullscreen={true} />} />

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// };

// export default App;




// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

// ✅ Pages
import About from "./pages/About";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import RequireAdmin from "./components/Admin/RequireAdmin";


// ✅ Context
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, loading } = useAuth(); // get from context

  if (loading) {
    return <LoadingScreen fullscreen={true} />;
  }

  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        {/* Admin route – only show if user is admin */}
        <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/loading" element={<LoadingScreen fullscreen={true} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
