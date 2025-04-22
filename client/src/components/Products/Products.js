import React from "react";
import "./Products.css";

function Products() {
  return (
    <div className="products">
      <div className="product-card">
        <img src="/milk.jpg" alt="Milk" className="product-image" />
        <h3>Milk</h3>
        <p>₹28</p>
        <button>View Details</button>
      </div>
      {/* Add more product cards as needed */}
    </div>
  );
}

export default Products;
