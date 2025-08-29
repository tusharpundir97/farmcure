import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

/**
 * SELLER DASHBOARD
 * KPIs: totalProducts, lowStockCount, totalOrders, ordersByStatus, revenueLast30Days, topProducts
 * Query params:
 *  - lowStockThreshold (default 10)
 */
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const lowStockThreshold = Number(req.query.lowStockThreshold) || 10;

    // Basic KPIs
    const [totalProducts, lowStockCount, totalOrders] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Product.countDocuments({ seller: sellerId, stock: { $lte: lowStockThreshold } }),
      Order.countDocuments({ seller: sellerId }),
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } }
    ]);

    // Revenue last 30 days (by order total)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueLast30Days = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId), createdAt: { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $project: { date: "$_id", revenue: 1, orders: 1, _id: 0 } },
      { $sort: { date: 1 } }
    ]);

    // Top products (by quantity sold)
    const topProductsAgg = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      { $unwind: "$items" },
      { $group: {
          _id: "$items.product",
          qtySold: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
        }
      },
      { $sort: { qtySold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 0, productId: "$product._id", name: "$product.name", images: "$product.images", qtySold: 1, revenue: 1 } }
    ]);

    res.json({
      kpis: { totalProducts, lowStockCount, totalOrders },
      ordersByStatus,
      revenueLast30Days,
      topProducts: topProductsAgg
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * SELLER ORDERS LIST (with optional status filter)
 * Query params:
 *  - status (pending|confirmed|dispatched|delivered|cancelled)
 */
export const listSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const status = req.query.status;
    const filter = { seller: sellerId, ...(status ? { status } : {}) };
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("buyer", "name email")
      .populate("items.product", "name images");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * FARMER DASHBOARD
 * Recent orders, purchased-category insights, simple recommendations
 */
export const getFarmerDashboard = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Recent orders
    const recentOrders = await Order.find({ buyer: buyerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("seller", "name email")
      .populate("items.product", "name images category");

    // Purchase insights (top categories by qty)
    const categoryInsights = await Order.aggregate([
      { $match: { buyer: new mongoose.Types.ObjectId(buyerId) } },
      { $unwind: "$items" },
      // Join to product to read category
      { $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "prod" } },
      { $unwind: "$prod" },
      { $group: { _id: "$prod.category", qty: { $sum: "$items.qty" } } },
      { $sort: { qty: -1 } },
      { $limit: 3 },
      { $project: { category: "$_id", qty: 1, _id: 0 } }
    ]);

    // For recommendations: pick verified products from top categories NOT already bought
    const topCategories = categoryInsights.map(c => c.category);
    const previouslyBought = await Order.aggregate([
      { $match: { buyer: new mongoose.Types.ObjectId(buyerId) } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product" } }
    ]);
    const boughtIds = previouslyBought.map(b => b._id);

    let recommendations = [];
    if (topCategories.length > 0) {
      recommendations = await Product.find({
        verified: true,
        category: { $in: topCategories },
        _id: { $nin: boughtIds }
      }).sort({ createdAt: -1 }).limit(8).select("name images price category");
    }

    // Fallback: popular recent verified products if user is new / sparse history
    if (recommendations.length < 4) {
      const fallback = await Product.find({ verified: true })
        .sort({ createdAt: -1 })
        .limit(8 - recommendations.length)
        .select("name images price category");
      recommendations = recommendations.concat(fallback);
    }

    res.json({
      recentOrders,
      purchaseInsights: categoryInsights,
      recommendations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};