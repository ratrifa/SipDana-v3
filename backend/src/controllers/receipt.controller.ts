import { Response } from "express";
import axios from "axios";
import FormData from "form-data";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * [POST] Scan receipt image by proxying the call to an n8n webhook.
 * Endpoint: POST /api/receipt/scan-receipt
 */
export const scanReceipt = async (req: AuthRequest, res: Response) => {
  const file = (req as any).file;

  if (!file) {
    return res.status(400).json({ message: "Gambar struk tidak ditemukan. Pastikan Anda meng-upload file." });
  }

  try {
    const n8nUrl = process.env.N8N_SCAN_RECEIPT_URL || "http://localhost:5678/webhook/scan-receipt";

    const form = new FormData();
    form.append("data", file.buffer, { filename: file.originalname, contentType: file.mimetype });

    const response = await axios.post(n8nUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 90000,
    });

    return res.json(response.data);
  } catch (error: any) {
    const n8nUrl = process.env.N8N_SCAN_RECEIPT_URL || "http://localhost:5678/webhook/scan-receipt";
    const status = error?.response?.status;
    const n8nMessage = error?.response?.data?.message;

    console.error("Error scanReceipt (n8n):", {
      status,
      n8nUrl,
      n8nMessage,
      error: error?.message || error,
    });

    const message = n8nMessage || error?.message || "Gagal melakukan scan struk. Coba lagi.";

    const advice =
      status === 404
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
