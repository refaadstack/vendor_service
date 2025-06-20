import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/Database.js";
import Vendor from "./models/VendorModel.js";
import VendorRoute from "./routes/VendorRoute.js";

dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database connected");
  await Vendor.sync(); // Buat tabel jika belum ada
} catch (error) {
  console.error("DB Error:", error);
}

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/api", VendorRoute);

app.listen(process.env.PORT, () =>
  console.log(`Vendor Service running on port ${process.env.PORT}`)
);
