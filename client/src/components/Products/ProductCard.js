import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Products.css";

function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      await axios.post("http://localhost:5000/api/cart/add", 
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          className="product-image" 
          src={product.image.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`} 
          alt={product.name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-cart">
          <p className="product-price">₹{product.price}</p>
          <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
        </div>
        <Link to={"/product/" + product._id} className="view-details">View Details</Link>
      </div>
    </div>
  );
}

export default ProductCard;