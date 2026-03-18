import FormData from "form-data";
import fetch from "node-fetch";

export interface OcrSpaceResponse {
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage: string[] | null;
  ErrorDetails: string | null;
  ParsedResults?: Array<{
    TextOverlay: any;
    TextOrientation: string;
    FileParseExitCode: number;
    ParsedText: string;
    ErrorMessage: string | null;
    ErrorDetails: string | null;
  }>;
  ProcessingTimeInMilliseconds: string;
  SearchablePDFURL?: string;
}

export const ocrSpaceRecognize = async (imageBuffer: Buffer, apiKey: string, language = "eng"): Promise<string> => {
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
  const form = new FormData();
  form.append("apikey", apiKey);
  form.append("language", language);
  form.append("isOverlayRequired", "false");
  form.append("base64Image", base64Image);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: form.getHeaders(),
    body: form as any,
    signal: controller.signal,
  });

  clearTimeout(timeout);

  const data = (await res.json()) as OcrSpaceResponse;

  if (!data || data.IsErroredOnProcessing) {
    const msg = data?.ErrorMessage ? data.ErrorMessage.join(" ") : "Unknown OCR error";
    throw new Error(`OCR.space error: ${msg}`);
  }

  const parsedText = data.ParsedResults?.[0]?.ParsedText;
  return parsedText || "";
};
