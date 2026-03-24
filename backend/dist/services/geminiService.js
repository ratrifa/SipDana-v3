"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanReceiptWithGemini = void 0;
const geminiClient_1 = require("../config/geminiClient");
const extractJsonObject = (text) => {
    const firstOpen = text.indexOf("{");
    const lastClose = text.lastIndexOf("}");
    if (firstOpen === -1 || lastClose === -1 || lastClose <= firstOpen) {
        throw new Error("Could not extract JSON object from model output.");
    }
    return text.slice(firstOpen, lastClose + 1);
};
const normalizeDate = (value) => {
    if (!value)
        return undefined;
    const trimmed = value.trim();
    // If already in ISO format (YYYY-MM-DD), keep it.
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    // Try to parse other common formats.
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }
    return undefined;
};
const coerceNumber = (value) => {
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    if (typeof value === "string") {
        const cleaned = value.replace(/[^0-9.\-]/g, "");
        const num = Number(cleaned);
        if (!Number.isNaN(num))
            return num;
    }
    return 0;
};
const buildPrompt = () => {
    return `You are a receipt parser. You will be given an image of a receipt. Extract the following fields and return ONLY valid JSON matching this schema:\n\n{\n  "store": "string",\n  "date": "YYYY-MM-DD",\n  "items": [\n    { "name": "string", "qty": number, "price": number }\n  ],\n  "total": number\n}\n\nRules:\n- Do not output any additional text, explanation, or formatting.\n- If a value is missing, provide an empty string for text and 0 for numbers.\n- Ensure qty and price are numbers (no currency symbols).\n- If quantity is not present, assume 1.\n- Total should be the receipt total.\n`;
};
const scanReceiptWithGemini = async (imageBuffer, mimeType) => {
    const base64 = imageBuffer.toString("base64");
    const prompt = buildPrompt();
    const geminiModel = (0, geminiClient_1.getGeminiModel)();
    const response = await geminiModel.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: base64 } },
                ],
            },
        ],
    });
    const candidate = response?.response?.candidates?.[0];
    if (!candidate?.content?.parts) {
        throw new Error("Gemini did not return any text response.");
    }
    const textOutput = candidate.content.parts
        .filter((part) => part.text)
        .map((part) => part.text)
        .join("\n");
    const jsonString = extractJsonObject(textOutput);
    const parsed = JSON.parse(jsonString);
    const store = typeof parsed.store === "string" ? parsed.store : "";
    const date = normalizeDate(typeof parsed.date === "string" ? parsed.date : undefined);
    const itemsRaw = Array.isArray(parsed.items) ? parsed.items : [];
    const items = itemsRaw.map((item) => {
        const name = typeof item?.name === "string" ? item.name : "";
        const qty = Math.max(1, Math.round(coerceNumber(item?.qty) || 1));
        const price = coerceNumber(item?.price);
        return { name, qty, price };
    });
    const total = coerceNumber(parsed.total);
    return {
        store,
        date,
        items,
        total,
    };
};
exports.scanReceiptWithGemini = scanReceiptWithGemini;
