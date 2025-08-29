import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {authorizeRoles} from "../middlewares/roleMiddleware.js";
import {createProduct,updateProduct,getProductById,listProducts,listSellerProducts, verifyProduct, listUnverifiedProducts, bulkVerifyProducts} from "../controllers/productController.js";
import upload from "../middlewares/uploadmiddleware.js"
const router =express.Router();

router.post("/",protect,authorizeRoles("seller"),upload.array("images", 5),createProduct);
router.get("/",listProducts);
router.get("/seller/me",protect,authorizeRoles("seller"),listSellerProducts);
router.get("/unverified",protect,authorizeRoles("admin"),listUnverifiedProducts);
router.put("/verify/bulk",protect,authorizeRoles("admin"),bulkVerifyProducts);
router.put("/:id",protect,updateProduct);
router.put("/:id/verify",protect,authorizeRoles("admin"),verifyProduct);
router.get("/:id",getProductById);
export  default router;