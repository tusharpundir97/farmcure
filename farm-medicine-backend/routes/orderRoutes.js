import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {authorizeRoles} from "../middlewares/roleMiddleware.js";
import {
      placeOrder,
      getAllOrders,
      getOrderById,
      listMyOrders,
      updateOrderStatus
} from"../controllers/orderController.js";

const router =express.Router();
router.post("/",protect,authorizeRoles("farmer"),placeOrder);
router.get("/mine",protect,listMyOrders);
router.get("/admin",protect,authorizeRoles("admin"), getAllOrders);
router.get("/:id",protect,getOrderById);
router.put("/admin/:id/status",protect,authorizeRoles("seller","admin"),updateOrderStatus);

export default router;