const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { products, total, shippingAddress, paymentMethod } = req.body;
    
    if (!products || !total || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Missing required fields",
        required: {
          products: !!products,
          total: !!total,
          shippingAddress: !!shippingAddress,
          paymentMethod: !!paymentMethod
        }
      });
    }

    const order = new Order({ 
      userId: req.user.id, 
      products, 
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    await order.save();
    res.json({ 
      message: "Order placed successfully!",
      _id: order._id
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: "Failed to create order", 
      error: error.message 
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('products.productId');
    
    // Transform the data to ensure all required fields are present
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      userId: order.userId,
      products: order.products.map(product => ({
        productId: {
          _id: product.productId._id,
          name: product.productId.name,
          image: product.productId.image,
          price: product.productId.price,
          description: product.productId.description
        },
        quantity: product.quantity,
        price: product.price
      })),
      total: order.total,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      date: order.date,
      transactionId: order.transactionId
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: "Failed to fetch orders", 
      error: error.message 
    });
  }
};