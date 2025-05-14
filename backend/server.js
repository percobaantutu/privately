import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import teacherRouter from "./routes/teacherRoute.js";
import userRouter from "./routes/userRoute.js";

// App Config
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true
}));

// API Endpoints
app.use("/api/admin", adminRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working great yeaey!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
