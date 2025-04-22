import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/assets/logo.png" alt="ShopEasy Logo" />
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div className="navbar-auth">
        {token ? (
          <button onClick={logout} className="auth-btn logout-btn">Logout</button>
        ) : (
          <>
            <Link to="/login" className="auth-btn login-btn">Login</Link>
            <Link to="/signup" className="auth-btn signup-btn">Sign up</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;