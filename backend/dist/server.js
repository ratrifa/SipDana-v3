"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./config/db.config"));
// Import Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const utility_routes_1 = __importDefault(require("./routes/utility.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const target_routes_1 = __importDefault(require("./routes/target.routes")); // <-- Wajib ada!
const receipt_routes_1 = __importDefault(require("./routes/receipt.routes"));
const multer_1 = __importDefault(require("multer"));
const receipt_controller_1 = require("./controllers/receipt.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// Gunakan Routes
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use("/api/auth", auth_routes_1.default);
app.use("/api/transactions", transaction_routes_1.default);
app.use("/api/utilities", utility_routes_1.default);
app.use("/api/reports", report_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/targets", target_routes_1.default);
app.use("/api/receipt", receipt_routes_1.default);
// Additional endpoint for backward compatibility / ease of use
app.post("/api/scan-receipt", auth_middleware_1.protect, upload.single("receipt"), receipt_controller_1.scanReceipt);
const startServer = async () => {
    try {
        await db_config_1.default.query("SELECT 1");
        console.log("✅ Koneksi Database MySQL Berhasil!");
        app.listen(port, () => {
            console.log(`⚡ Server berjalan di http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Gagal terhubung ke database MySQL:", error);
    }
};
startServer();
