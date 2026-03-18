import dotenv from "dotenv";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

dotenv.config();

const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const maxOutputTokens = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS) || 2000;

export const getGeminiModel = (): GenerativeModel => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API key. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in your environment.");
  }

  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: modelName,
    generationConfig: {
      maxOutputTokens,
    },
  });
};
