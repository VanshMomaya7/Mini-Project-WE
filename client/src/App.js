import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProductList from "./components/Products/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import Success from "./components/Success/Success";
import { CartProvider } from "./context/CartContext";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <CartProvider>
      <Router>
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;