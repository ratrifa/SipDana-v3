"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanReceipt = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
/**
 * [POST] Scan receipt image by proxying the call to an n8n webhook.
 * Endpoint: POST /api/receipt/scan-receipt
 */
const scanReceipt = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Gambar struk tidak ditemukan. Pastikan Anda meng-upload file." });
    }
    try {
        const n8nUrl = process.env.N8N_SCAN_RECEIPT_URL || "http://localhost:5678/webhook/scan-receipt";
        const form = new form_data_1.default();
        form.append("data", file.buffer, { filename: file.originalname, contentType: file.mimetype });
        const response = await axios_1.default.post(n8nUrl, form, {
            headers: {
                ...form.getHeaders(),
            },
            timeout: 90000,
        });
        return res.json(response.data);
    }
    catch (error) {
        const n8nUrl = process.env.N8N_SCAN_RECEIPT_URL || "http://localhost:5678/webhook/scan-receipt";
        const status = error?.response?.status;
        const n8nMessage = error?.response?.data?.message;
        console.error("Error scanReceipt (n8n):", {
            status,
            n8nUrl,
            n8nMessage,
            error: error?.message || error,
        });
        const message = n8nMessage ||
            error?.message ||
            "Gagal melakukan scan struk. Coba lagi.";
        const advice = status === 404
            ? `Pastikan workflow n8n memiliki Webhook node dengan path yang cocok (URL yang digunakan: ${n8nUrl}).` // eslint-disable-line max-len
            : undefined;
        return res.status(500).json({
            message,
            ...(advice ? { advice } : {}),
            n8nUrl,
            status,
        });
    }
};
exports.scanReceipt = scanReceipt;
