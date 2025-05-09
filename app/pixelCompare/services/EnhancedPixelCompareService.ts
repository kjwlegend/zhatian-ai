import { PixelCompareConfig, ComparisonResult } from '../types';
import { AIAnalysisService } from './AIAnalysisService';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export class EnhancedPixelCompareService {
  private config: PixelCompareConfig;
  private aiService: AIAnalysisService;
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
    this.aiService = new AIAnalysisService();
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

    // Put the image data on the temp canvas
    tempCtx.putImageData(imageData, 0, 0);

    // Resize using the canvas
    ctx.drawImage(tempCanvas, 0, 0, image.width, image.height, 0, 0, width, height);

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

      const diffResult = {
        diffImage: this.pngToDataUrl(comparisonResult.diffImage),
        diffPixels: comparisonResult.diffPixels,
        diffPercentage: comparisonResult.diffPercentage,
        baseImage: baseImageUrl,
        compareImage: compareImageUrl
      };

      // Run AI analysis if enabled
      let aiAnalysis = undefined;
      if (this.config.useAI) {
        try {
          aiAnalysis = await this.aiService.analyze({
            diffResult,
            baseImage: baseImageUrl,
            compareImage: compareImageUrl,
            metadata: {
              config: this.config,
              timestamp: new Date().toISOString(),
              processingTime: Date.now() - startTime
            }
          });
        } catch (error) {
          console.warn('AI analysis failed:', error);
          // Continue without AI analysis
        }
      }

      const result: ComparisonResult = {
        diffResult,
        aiAnalysis,
        metadata: {
          config: this.config,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }
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
