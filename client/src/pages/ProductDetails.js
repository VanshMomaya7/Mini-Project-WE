import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: "http://localhost:5000/" + product.image
      });
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details">
      <img src={"http://localhost:5000/" + product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="description">{product.description}</p>
        <p className="price"><strong>₹{product.price}</strong></p>
        <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetails;