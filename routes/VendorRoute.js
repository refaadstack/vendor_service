import express from "express";
import {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../controllers/VendorController.js";

const router = express.Router();

router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendorById);
router.post("/vendors", createVendor);
router.put("/vendors/:id", updateVendor);
router.delete("/vendors/:id", deleteVendor);

export default router;
