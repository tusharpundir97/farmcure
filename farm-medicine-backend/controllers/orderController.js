import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Place order (buyer)
export const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "No items" });

    // Determine seller — if order contains items from multiple sellers, either restrict to one seller or handle multi-seller
    const sellerId = items[0].seller; 
    // Calculate prices
    let itemsPrice = 0;
    for (const it of items) {
      itemsPrice += it.qty * it.price;
      
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const shippingPrice = 0; 
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      buyer: req.user._id,
      seller: sellerId,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
   
    
    res.status(201).json(order);
  } catch (err) {
    
    res.status(500).json({ message: err.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items._id", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}


// Get order by id (buyer/seller/admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("items.product", "name images");

    if (!order) return res.status(404).json({ message: "Order not found" });

    
    const uid = req.user._id.toString();
    if (req.user.role !== "admin" && order.buyer._id.toString() !== uid && order.seller._id.toString() !== uid) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders for current user (buyer) or seller dashboard
export const listMyOrders = async (req, res) => {
  try {
    if (req.user.role === "seller") {
      const orders = await Order.find({ seller: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    }
    // buyer orders
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (seller/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // only seller assigned to order or admin can update
    if (req.user.role !== "admin" && order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = status;
    const updated = await order.save();
    console.log(updated);
    
    res.json({message: "Order status updated",order});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};