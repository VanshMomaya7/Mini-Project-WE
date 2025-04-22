import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      phone: ""
    },
    paymentMethod: "",
    items: location.state?.items || [],
    total: location.state?.total || 0
  });

  useEffect(() => {
    if (!location.state?.items || !location.state?.total) {
      navigate('/cart');
    }
  }, [location.state, navigate]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentSubmit = async (method) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate shipping address
      const requiredFields = ['fullName', 'streetAddress', 'city', 'state', 'pincode', 'phone'];
      const missingFields = requiredFields.filter(field => !orderData.shippingAddress[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }
      
      console.log('Creating order with data:', {
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        total: orderData.total,
        method
      });

      // First create the order
      const order = {
        shippingAddress: orderData.shippingAddress,
        paymentMethod: method,
        products: orderData.items.map(item => ({
          productId: item.id || item.productId._id,
          quantity: item.quantity,
          price: item.price || item.productId.price
        })),
        total: orderData.total
      };

      console.log('Sending order data to server:', order);

      const orderResponse = await axios.post("http://localhost:5000/api/orders/create", order, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Order created successfully:', orderResponse.data);

      if (!orderResponse.data._id) {
        throw new Error('Order created but no order ID received');
      }

      if (method === 'cod') {
        console.log('Processing COD payment for order:', orderResponse.data._id);
        try {
          const paymentData = {
            orderId: orderResponse.data._id,
            paymentMethod: 'cod',
            amount: orderData.total
          };
          console.log('Sending payment data:', paymentData);

          const paymentResponse = await axios.post("http://localhost:5000/api/payment/process", paymentData, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log('COD payment processed successfully:', paymentResponse.data);
          
          if (paymentResponse.data.success) {
            console.log('Redirecting to success page...');
            window.location.href = '/success';
          } else {
            throw new Error('Payment response indicates failure');
          }
          return;
        } catch (error) {
          console.error('COD processing error:', error.response?.data || error.message);
          setError(error.response?.data?.message || 'Failed to process COD order. Please try again.');
          setLoading(false);
          return;
        }
      }

      console.log('Processing card payment for order:', orderResponse.data._id);
      try {
        const paymentData = {
          orderId: orderResponse.data._id,
          paymentMethod: method,
          amount: orderData.total
        };
        console.log('Sending payment data:', paymentData);

        const paymentResponse = await axios.post("http://localhost:5000/api/payment/process", paymentData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Payment response received:', paymentResponse.data);

        if (paymentResponse.data.success) {
          console.log('Payment successful, redirecting to success page...');
          window.location.href = '/success';
        } else {
          throw new Error('Payment response indicates failure');
        }
      } catch (error) {
        console.error('Payment processing error:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Payment failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to create order. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value
      }
    }));
  };

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Address</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
      </div>

      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className="address-form">
          <h2>Shipping Address</h2>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={orderData.shippingAddress.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="streetAddress"
              placeholder="Street Address"
              value={orderData.shippingAddress.streetAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={orderData.shippingAddress.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={orderData.shippingAddress.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              name="pincode"
              placeholder="PIN Code"
              value={orderData.shippingAddress.pincode}
              onChange={handleInputChange}
              required
              pattern="[0-9]{6}"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={orderData.shippingAddress.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
            />
          </div>
          <button type="submit" className="continue-btn">Continue to Payment</button>
        </form>
      )}

      {step === 2 && (
        <div className="payment-methods">
          <h2>Select Payment Method</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="payment-options">
            <button 
              onClick={() => handlePaymentSubmit('card')} 
              className="payment-option"
              disabled={loading}
            >
              <i className="fas fa-credit-card"></i>
              <span>Credit/Debit Card</span>
            </button>
            <button 
              onClick={() => handlePaymentSubmit('upi')} 
              className="payment-option"
              disabled={loading}
            >
              <i className="fas fa-mobile-alt"></i>
              <span>UPI Payment</span>
            </button>
            <button 
              onClick={() => handlePaymentSubmit('banking')} 
              className="payment-option"
              disabled={loading}
            >
              <i className="fas fa-university"></i>
              <span>Net Banking</span>
            </button>
            <button 
              onClick={() => handlePaymentSubmit('cod')} 
              className="payment-option"
              disabled={loading}
            >
              <i className="fas fa-money-bill-wave"></i>
              <span>Cash on Delivery</span>
            </button>
          </div>
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Processing payment...</p>
            </div>
          )}
        </div>
      )}

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Items Total:</span>
          <span>₹{orderData.total}</span>
        </div>
        <div className="summary-row">
          <span>Delivery:</span>
          <span>FREE</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>₹{orderData.total}</span>
        </div>
      </div>
    </div>
  );
}

export default Checkout;