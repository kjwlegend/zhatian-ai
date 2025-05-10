import { PixelCompareConfig } from '../types';
import { ComparisonResult } from '@/app/api/_lib/metadata-cache';
// import { AIAnalysisService } from './AIAnalysisService';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class EnhancedPixelCompareService {
  private config: PixelCompareConfig;
  // private aiService: AIAnalysisService;
  private cache: Map<string, ComparisonResult>;

  constructor(config: Partial<PixelCompareConfig>) {
    this.config = {
      threshold: 0.1,
      colorTolerance: 0.1,
      antiAliasing: true,
      useAI: true,
      elementDetection: true,
      semanticAnalysis: true,
      useParallel: true,
      cacheResults: true,
      progressiveLoading: true,
      ...config
    };
    // this.aiService = new AIAnalysisService();
    this.cache = new Map();
  }

  public updateConfig(newConfig: Partial<PixelCompareConfig>) {
    // Update config with new values while preserving defaults
    this.config = {
      ...this.config,
      ...newConfig
    };

    // Clear cache when config changes
    if (this.config.cacheResults) {
      this.cache.clear();
    }
  }

  private async loadImage(imageUrl: string): Promise<PNG> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        try {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);

          const png = new PNG({
            width: img.width,
            height: img.height
          });

          png.data = Buffer.from(imageData.data);
          resolve(png);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error('Failed to process image: ' + errorMessage));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      const proxyUrl = `/api/image?url=${encodeURIComponent(imageUrl)}`;
      img.src = proxyUrl;
    });
  }

  private async compareImages(
    baseImage: PNG,
    compareImage: PNG,
    config: PixelCompareConfig
  ): Promise<{ diffImage: PNG; diffPixels: number; diffPercentage: number }> {
    const width = baseImage.width;
    const height = baseImage.height;

    // Create output image
    const diffImage = new PNG({ width, height });

    // Configure pixelmatch options
    const options = {
      threshold: config.threshold,
      includeAA: config.antiAliasing,
      alpha: 0.1,
      aaColor: [255, 255, 0] as [number, number, number],
      diffColor: [255, 0, 0] as [number, number, number],
      diffColorAlt: [0, 255, 0] as [number, number, number],
    };

    // Run comparison
    const diffPixels = pixelmatch(
      baseImage.data,
      compareImage.data,
      diffImage.data,
      width,
      height,
      options
    );

    return {
      diffImage,
      diffPixels,
      diffPercentage: (diffPixels / (width * height)) * 100
    };
  }

  private findFirstPixel(imageData: Uint8ClampedArray, width: number, height: number): { x: number; y: number } | null {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        // Check if pixel is not transparent (alpha > 0) and has some color value
        if (imageData[idx + 3] > 0 && (imageData[idx] > 0 || imageData[idx + 1] > 0 || imageData[idx + 2] > 0)) {
          return { x, y };
        }
      }
    }
    return null; // Return null if no non-transparent pixel found
  }

  private resizeImage(image: PNG, width: number, height: number): PNG {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Create a temporary canvas to draw the original PNG
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Failed to get temporary canvas context');

    // Create ImageData from PNG data
    const imageData = new ImageData(
      new Uint8ClampedArray(image.data),
      image.width,
      image.height
    );

    // Find the first non-transparent pixel
    const basePoint = this.findFirstPixel(imageData.data, image.width, image.height);
    // Put the image data on the temp canvas
    tempCtx.putImageData(imageData, 0, 0);

    // If we found a base point, use it for drawing
    if (basePoint) {
      // Calculate the new dimensions maintaining aspect ratio
      const aspectRatio = image.width / image.height;
      let newWidth = width;
      let newHeight = height;

      if (width / height > aspectRatio) {
        newWidth = height * aspectRatio;
      } else {
        newHeight = width / aspectRatio;
      }

      // Clear the destination canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate the centered position
      const offsetX = (width - newWidth) / 2;
      const offsetY = (height - newHeight) / 2;

      // Draw the image with the base point offset
      ctx.drawImage(
        tempCanvas,
        basePoint.x, basePoint.y, // Source position (starting from base point)
        image.width - basePoint.x, image.height - basePoint.y, // Source dimensions
        offsetX, offsetY, // Destination position
        newWidth, newHeight // Destination dimensions
      );
    } else {
      // Fallback to original resize logic if no base point found
      ctx.drawImage(tempCanvas, 0, 0, image.width, image.height, 0, 0, width, height);
    }

    // Get the resized image data
    const resizedImageData = ctx.getImageData(0, 0, width, height);
    const resizedPng = new PNG({ width, height });
    resizedPng.data = Buffer.from(resizedImageData.data);

    return resizedPng;
  }

  private pngToDataUrl(png: PNG): string {
    const canvas = document.createElement('canvas');
    canvas.width = png.width;
    canvas.height = png.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    const imageData = new ImageData(
      new Uint8ClampedArray(png.data),
      png.width,
      png.height
    );

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  private generateCacheKey(baseImageUrl: string, compareImageUrl: string): string {
    return `${baseImageUrl}:${compareImageUrl}:${JSON.stringify(this.config)}`;
  }

  private async uploadToOSS(buffer: Buffer, fileName: string, folderName: string = 'DIFF-AI'): Promise<{filePath: string, fileName: string}> {
    // Create form data for upload
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, fileName);
    formData.append('folderName', folderName);

    // Get the base URL from the environment or use a default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const uploadUrl = new URL('/api/upload', baseUrl).toString();

    // Upload to OSS with absolute URL
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload diff image to OSS');
    }

    const data = await response.json();
    return {
      filePath: data.filePath,
      fileName: data.fileName
    };
  }

  private async saveDiffImage(diffImage: PNG): Promise<{filePath: string, fileName: string}> {
    const diffId = uuidv4();
    const diffFilename = `${diffId}.png`;

    // Convert PNG to buffer
    const chunks: Buffer[] = [];
    const diffStream = diffImage.pack();

    // Wait for the PNG to be serialized
    const diffBuffer = await new Promise<Buffer>((resolve, reject) => {
      diffStream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      diffStream.on('end', () => resolve(Buffer.concat(chunks)));
      diffStream.on('error', reject);
    });

    // Upload to OSS
    return await this.uploadToOSS(diffBuffer, diffFilename);
  }

  public async compare(
    baseImageUrl: string,
    compareImageUrl: string
  ): Promise<ComparisonResult> {
    try {
      // Check cache if enabled
      if (this.config.cacheResults) {
        const cacheKey = this.generateCacheKey(baseImageUrl, compareImageUrl);
        const cached = this.cache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const startTime = Date.now();

      // Load images
      const [baseImage, compareImage] = await Promise.all([
        this.loadImage(baseImageUrl),
        this.loadImage(compareImageUrl)
      ]);

      // Handle different image dimensions
      let processedBase = baseImage;
      let processedCompare = compareImage;

      if (baseImage.width !== compareImage.width || baseImage.height !== compareImage.height) {
        console.log('Images have different dimensions. Resizing...');
        const targetWidth = Math.max(baseImage.width, compareImage.width);
        const targetHeight = Math.max(baseImage.height, compareImage.height);

        processedBase = this.resizeImage(baseImage, targetWidth, targetHeight);
        processedCompare = this.resizeImage(compareImage, targetWidth, targetHeight);
      }

      // Process entire image
      const comparisonResult = await this.compareImages(
        processedBase,
        processedCompare,
        this.config
      );

      // Save diff image to OSS and get its path
      const ossUploadResult = await this.saveDiffImage(comparisonResult.diffImage);

      // Get metadata for base and compare images
      const baseName = baseImageUrl.split('/').pop() || baseImageUrl;
      const compareName = compareImageUrl.split('/').pop() || compareImageUrl;

      const result: ComparisonResult = {
        id: ossUploadResult.fileName.replace('.png', ''),
        baseId: baseImageUrl,
        compareId: compareImageUrl,
        baseName,
        compareName,
        diffPixels: comparisonResult.diffPixels,
        diffPercentage: comparisonResult.diffPercentage,
        threshold: this.config.threshold,
        ignoreAA: !this.config.antiAliasing,
        timestamp: new Date().toISOString(),
        diffImage: ossUploadResult.filePath,
        baseImage: baseImageUrl,
        compareImage: compareImageUrl,
        dimensions: {
          width: processedBase.width,
          height: processedBase.height
        },
        preprocessing: {
          devicePixelRatio: 1,
          normalizedWidth: processedBase.width,
          normalizedHeight: processedBase.height,
          originalDimensions: {
            base: { width: baseImage.width, height: baseImage.height },
            compare: { width: compareImage.width, height: compareImage.height }
          }
        },
        antiAliasing: {
          enabled: this.config.antiAliasing,
          threshold: this.config.threshold,
          alphaThreshold: 0.1,
          aaColor: [255, 255, 0],
          detectAA: true
        },
        diffAreas: []
      };

      // Cache result if enabled
      if (this.config.cacheResults) {
        const cacheKey = this.generateCacheKey(baseImageUrl, compareImageUrl);
        this.cache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error('Comparison failed:', error);
      throw error;
    }
  }

  public cleanup() {
    this.cache.clear();
  }
}
