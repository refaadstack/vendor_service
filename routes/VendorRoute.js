import express from "express";
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  bulkDeleteVendors,
  getVendorsStats,
} from "../controllers/VendorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/vendors", getVendors);
router.get("/vendors/stats/summary", getVendorsStats);
router.get("/vendors/:id", getVendorById);
router.post("/vendors", createVendor);
router.put("/vendors/:id", updateVendor);
router.delete("/vendors/:id", deleteVendor);
router.delete("/vendors", bulkDeleteVendors);

export default router;
