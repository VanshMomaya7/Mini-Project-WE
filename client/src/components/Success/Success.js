import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Success.css";

function Success() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const clearCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        await axios.delete("http://localhost:5000/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error clearing cart:", error);
        setIsLoading(false);
      }
    };

    clearCart();
  }, [navigate]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="success-container">
        <div className="success-card">
          <h2>Processing your order...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        <h1>Order Confirmed!</h1>
        <p className="success-message">Thank you for your purchase!</p>
        <div className="order-details">
          <p>Your order has been successfully placed and will be processed soon.</p>
          <p>You will receive an email confirmation shortly.</p>
        </div>
        <div className="success-actions">
          <button 
            className="continue-shopping" 
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;