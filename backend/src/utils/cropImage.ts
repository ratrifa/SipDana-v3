import sharp from "sharp";

export interface BoundingBox {
  // Can be absolute pixel coordinates or normalized ratios [0..1]
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Crop an image buffer to a specific bounding box.
 *
 * The bounding box may be provided in normalized coordinates (0-1) or in pixels.
 * If normalized, the box is scaled to the image dimensions.
 */
export const cropImage = async (imageBuffer: Buffer, box: BoundingBox, outputFormat: "jpeg" | "png" = "jpeg"): Promise<Buffer> => {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Tidak dapat membaca dimensi gambar untuk crop.");
  }

  let { x, y, width, height } = box;

  const isNormalized = x <= 1 && y <= 1 && width <= 1 && height <= 1;
  if (isNormalized) {
    x = Math.round(x * metadata.width);
    y = Math.round(y * metadata.height);
    width = Math.round(width * metadata.width);
    height = Math.round(height * metadata.height);
  }

  // Clamp values to image boundaries
  x = Math.max(0, Math.min(x, metadata.width - 1));
  y = Math.max(0, Math.min(y, metadata.height - 1));

  // Ensure positive size, and do not exceed remaining bounds.
  width = Math.max(1, Math.min(width, metadata.width - x));
  height = Math.max(1, Math.min(height, metadata.height - y));

  // Sharp requires integer coordinates.
  x = Math.round(x);
  y = Math.round(y);
  width = Math.max(1, Math.round(width));
  height = Math.max(1, Math.round(height));

  // Re-ensure we don't exceed the image after rounding
  if (x + width > metadata.width) {
    width = Math.max(1, metadata.width - x);
  }
  if (y + height > metadata.height) {
    height = Math.max(1, metadata.height - y);
  }

  if (x < 0 || y < 0 || width < 1 || height < 1) {
    throw new Error(`Invalid crop area (x=${x}, y=${y}, width=${width}, height=${height}, imgW=${metadata.width}, imgH=${metadata.height})`);
  }

  return image.extract({ left: x, top: y, width, height }).toFormat(outputFormat, { quality: 85 }).toBuffer();
};
