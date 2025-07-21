import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import { fileDispute, getAdminDisputes, resolveDispute, getUserDisputes } from "../controllers/disputeController.js";

const router = express.Router();

// --- User Routes ---
// File a new dispute for a specific session
router.post("/session/:sessionId", isAuthenticated, fileDispute);
// Get all disputes filed by the logged-in user
router.get("/my-disputes", isAuthenticated, getUserDisputes);

// --- Admin Routes ---
// Get all disputes for the admin panel
router.get("/admin/all", authAdmin, getAdminDisputes);
// Resolve a dispute
router.put("/admin/:disputeId/resolve", authAdmin, resolveDispute);

export default router;
