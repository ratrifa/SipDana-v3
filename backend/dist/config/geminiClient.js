"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiModel = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config();
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const maxOutputTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 2000;
const getGeminiModel = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error("Missing Gemini API key. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment.");
    }
    return new generative_ai_1.GoogleGenerativeAI(apiKey).getGenerativeModel({
        model: modelName,
        generationConfig: {
            maxOutputTokens,
        },
    });
};
exports.getGeminiModel = getGeminiModel;
