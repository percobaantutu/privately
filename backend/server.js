import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { rateLimit } from "express-rate-limit"; // Import rate-limit
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import teacherRouter from "./routes/teacherRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import disputeRoute from "./routes/disputeRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { socketApp, socketServer } from "./socket/socket.js";
import passport from "passport";
import "./config/passport-setup.js";

// App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://privately.my.id", "https://www.privately.my.id", "https://admin.privately.my.id"],
    credentials: true,
  })
);

// Rate Limiter Configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window (for login/register)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" },
});

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authLimiter, authRoute); // Apply the limiter to all auth routes
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/disputes", disputeRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("API Working great yeaey!");
});

socketApp.use(app);

// Start server
socketServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
