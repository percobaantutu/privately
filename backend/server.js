import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import teacherRouter from "./routes/teacherRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

import paymentRoute from "./routes/paymentRoute.js";

// App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both frontend and admin
    credentials: true,
  })
);

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/payments", paymentRoute);

app.get("/", (req, res) => {
  res.send("API Working great yeaey!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
