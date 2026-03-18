"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocrSpaceRecognize = void 0;
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ocrSpaceRecognize = async (imageBuffer, apiKey, language = "eng") => {
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    const form = new form_data_1.default();
    form.append("apikey", apiKey);
    form.append("language", language);
    form.append("isOverlayRequired", "false");
    form.append("base64Image", base64Image);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);
    const res = await (0, node_fetch_1.default)("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: form.getHeaders(),
        body: form,
        signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = (await res.json());
    if (!data || data.IsErroredOnProcessing) {
        const msg = data?.ErrorMessage ? data.ErrorMessage.join(" ") : "Unknown OCR error";
        throw new Error(`OCR.space error: ${msg}`);
    }
    const parsedText = data.ParsedResults?.[0]?.ParsedText;
    return parsedText || "";
};
exports.ocrSpaceRecognize = ocrSpaceRecognize;
