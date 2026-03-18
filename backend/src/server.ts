import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.config";

// Import Routes
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
import utilityRoutes from "./routes/utility.routes";
import reportRoutes from "./routes/report.routes";
import userRoutes from "./routes/user.routes";
import targetRoutes from "./routes/target.routes"; // <-- Wajib ada!
import receiptRoutes from "./routes/receipt.routes";
import multer from "multer";
import { scanReceipt } from "./controllers/receipt.controller";
import { protect } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Gunakan Routes
const upload = multer({ storage: multer.memoryStorage() });

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/utilities", utilityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/receipt", receiptRoutes);

// Additional endpoint for backward compatibility / ease of use
app.post("/api/scan-receipt", protect, upload.single("receipt"), scanReceipt);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Koneksi Database MySQL Berhasil!");

    app.listen(port, () => {
      console.log(`⚡ Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Gagal terhubung ke database MySQL:", error);
  }
};

startServer();
