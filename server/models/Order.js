const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  shippingAddress: { type: AddressSchema, required: true },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['card', 'upi', 'banking', 'cod']
  },
  transactionId: {
    type: String,
    sparse: true
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", OrderSchema);