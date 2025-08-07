import { PNG } from 'pngjs';

interface ImageDimensions {
  width: number;
  height: number;
}

interface PreprocessedImage {
  image: PNG;
  dimensions: ImageDimensions;
  devicePixelRatio: number;
}

/**
 * Normalizes image dimensions based on device pixel ratio
 */
export function normalizeImageDimensions(
  width: number,
  height: number,
  devicePixelRatio: number = 1
): ImageDimensions {
  return {
    width: Math.round(width / devicePixelRatio),
    height: Math.round(height / devicePixelRatio)
  };
}

/**
 * Resizes an image to match target dimensions
 */
export function resizeImage(
  image: PNG,
  targetWidth: number,
  targetHeight: number
): PNG {
  const resized = new PNG({
    width: targetWidth,
    height: targetHeight
  });

  const scaleX = targetWidth / image.width;
  const scaleY = targetHeight / image.height;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.floor(x / scaleX);
      const srcY = Math.floor(y / scaleY);

      const srcIdx = (srcY * image.width + srcX) << 2;
      const destIdx = (y * targetWidth + x) << 2;

      resized.data[destIdx] = image.data[srcIdx];         // R
      resized.data[destIdx + 1] = image.data[srcIdx + 1]; // G
      resized.data[destIdx + 2] = image.data[srcIdx + 2]; // B
      resized.data[destIdx + 3] = image.data[srcIdx + 3]; // A
    }
  }

  return resized;
}

/**
 * Ensures two images have the same dimensions by resizing the larger one
 */
export function normalizeImagePair(img1: PNG, img2: PNG): { img1: PNG; img2: PNG; dimensions: ImageDimensions } {
  // If dimensions already match, return original images
  if (img1.width === img2.width && img1.height === img2.height) {
    return {
      img1,
      img2,
      dimensions: { width: img1.width, height: img1.height }
    };
  }

  // Find the smaller dimensions
  const targetWidth = Math.min(img1.width, img2.width);
  const targetHeight = Math.min(img1.height, img2.height);

  // Resize images if needed
  const normalizedImg1 = img1.width === targetWidth && img1.height === targetHeight
    ? img1
    : resizeImage(img1, targetWidth, targetHeight);

  const normalizedImg2 = img2.width === targetWidth && img2.height === targetHeight
    ? img2
    : resizeImage(img2, targetWidth, targetHeight);

  return {
    img1: normalizedImg1,
    img2: normalizedImg2,
    dimensions: { width: targetWidth, height: targetHeight }
  };
}

/**
 * Preprocesses an image for comparison by handling DPR and size normalization
 */
export async function preprocessImage(
  image: PNG,
  devicePixelRatio: number = 1
): Promise<PreprocessedImage> {
  // Store original dimensions
  const originalDimensions = {
    width: image.width,
    height: image.height
  };

  // Calculate normalized dimensions
  const normalizedDimensions = normalizeImageDimensions(
    originalDimensions.width,
    originalDimensions.height,
    devicePixelRatio
  );

  // If dimensions are different, resize the image
  if (
    normalizedDimensions.width !== originalDimensions.width ||
    normalizedDimensions.height !== originalDimensions.height
  ) {
    // Create a new PNG with normalized dimensions
    const normalizedImage = resizeImage(
      image,
      normalizedDimensions.width,
      normalizedDimensions.height
    );

    return {
      image: normalizedImage,
      dimensions: normalizedDimensions,
      devicePixelRatio
    };
  }

  // If no resizing needed, return original image with metadata
  return {
    image,
    dimensions: originalDimensions,
    devicePixelRatio
  };
}

/**
 * Enhanced anti-aliasing detection configuration
 */
export interface AntiAliasingConfig {
  enabled: boolean;
  threshold: number;
  alphaThreshold: number;
  aaColor: [number, number, number];
  detectAA: boolean;
}

/**
 * Creates default anti-aliasing configuration
 */
export function createDefaultAAConfig(): AntiAliasingConfig {
  return {
    enabled: true,
    threshold: 0.1,      // Default threshold for pixel difference
    alphaThreshold: 0.1, // Threshold for alpha channel differences
    aaColor: [255, 0, 0], // Color to use for anti-aliased pixels
    detectAA: true       // Whether to attempt to detect anti-aliased pixels
  };
}

/**
 * Detects if a pixel is likely anti-aliased by checking surrounding pixels
 */
export function isAntiAliased(
  img1: PNG,
  img2: PNG,
  x: number,
  y: number,
  width: number,
  height: number,
  config: AntiAliasingConfig
): boolean {
  if (!config.detectAA) return false;

  const idx = (y * width + x) << 2;
  const diff = Math.abs(img1.data[idx] - img2.data[idx]) +
               Math.abs(img1.data[idx + 1] - img2.data[idx + 1]) +
               Math.abs(img1.data[idx + 2] - img2.data[idx + 2]);

  // If the difference is below the threshold, it's not anti-aliased
  if (diff < config.threshold * 3 * 255) return false;

  // Check surrounding pixels for gradient patterns
  let gradientCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

      const nidx = (ny * width + nx) << 2;
      const neighborDiff = Math.abs(img1.data[nidx] - img2.data[nidx]) +
                          Math.abs(img1.data[nidx + 1] - img2.data[nidx + 1]) +
                          Math.abs(img1.data[nidx + 2] - img2.data[nidx + 2]);

      if (Math.abs(diff - neighborDiff) < config.threshold * 3 * 255) {
        gradientCount++;
      }
    }
  }

  // If we find enough similar differences in the neighborhood, consider it anti-aliased
  return gradientCount >= 4;
}
