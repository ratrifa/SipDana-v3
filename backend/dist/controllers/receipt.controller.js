"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanReceipt = void 0;
const geminiService_1 = require("../services/geminiService");
/**
 * [POST] Scan receipt image using Google Gemini.
 * Endpoint: POST /api/scan-receipt (or /api/receipt/scan-receipt)
 */
const scanReceipt = async (req, res) => {
    const file = req.file;
    const base64Image = req.body?.base64 || req.body?.image;
    if (!file && !base64Image) {
        return res.status(400).json({
            message: "No receipt image provided. Upload a file or send base64 image data.",
        });
    }
    try {
        let imageBuffer;
        let mimeType = "image/jpeg";
        if (file) {
            imageBuffer = file.buffer;
            mimeType = file.mimetype || mimeType;
        }
        else {
            const match = /^data:(.+);base64,(.+)$/.exec(base64Image);
            if (match) {
                mimeType = match[1] || mimeType;
                imageBuffer = Buffer.from(match[2], "base64");
            }
            else {
                imageBuffer = Buffer.from(base64Image, "base64");
            }
        }
        const parsedReceipt = await (0, geminiService_1.scanReceiptWithGemini)(imageBuffer, mimeType);
        return res.json(parsedReceipt);
    }
    catch (error) {
        console.error("Error scanReceipt (Gemini):", error);
        return res.status(500).json({
            message: error?.message || "Gagal melakukan scan struk. Coba lagi.",
        });
    }
};
exports.scanReceipt = scanReceipt;
