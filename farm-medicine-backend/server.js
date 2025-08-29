import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from"./routes/productRoutes.js";
import orderRoutes from"./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
connectDB();

const app =express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/seller", dashboardRoutes); 
app.get("/",(req, res) => {
  res.send("FarmEasy API is running...")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));


