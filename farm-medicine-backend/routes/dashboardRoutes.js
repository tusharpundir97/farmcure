import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getSellerDashboard,
  getFarmerDashboard,
  listSellerOrders
} from "../controllers/dashboardController.js";

const router = express.Router();


router.get("/seller", protect, authorizeRoles("seller"), getSellerDashboard);
// Seller orders (with optional ?status=)
router.get("/seller/orders", protect, authorizeRoles("seller"), listSellerOrders);

// Farmer dashboard
router.get("/farmer", protect, authorizeRoles("farmer"), getFarmerDashboard);

export default router;