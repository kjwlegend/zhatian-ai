import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { v4 as uuidv4 } from 'uuid';
import { comparisonMetadataCache, ComparisonResult } from '../_lib/metadata-cache';
import {
  preprocessImage,
  createDefaultAAConfig,
  isAntiAliased,
  AntiAliasingConfig,
  normalizeImagePair
} from '../_lib/image-processor';

// Set up directory paths
const SCREENSHOT_DIR = process.env.OSS_BASE_URL || 'public/data/screenshots';
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// Ensure directories exist
if (!fs.existsSync(DIFF_DIR)) {
  fs.mkdirSync(DIFF_DIR, { recursive: true });
}

// Helper function to get file from OSS or local path
const getFile = async (filePath: string): Promise<Buffer> => {
  // Check if it's a remote URL
  if (filePath.startsWith('http')) {
    // Fetch the file from OSS
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from OSS: ${filePath}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  // Otherwise, read from local file system
  return fs.readFileSync(filePath);
};

// Updated helper to read an image as PNG with preprocessing
const readImage = async (filePath: string, devicePixelRatio: number = 1): Promise<PNG> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the file data (whether local or from OSS)
      const fileData = await getFile(filePath);

      // Create a PNG from the buffer
      const png = new PNG() as any;
      png.parse(fileData, async (error: Error | null, data: PNG) => {
        if (error) {
          reject(error);
        } else {
          // Preprocess the image before returning
          const processed = await preprocessImage(data, devicePixelRatio);
          resolve(processed.image);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Create a helper function to upload to OSS
async function uploadToOSS(buffer: Buffer, fileName: string, folderName: string = 'DIFF-AI'): Promise<{filePath: string, fileName: string}> {
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

// Modified helper to save comparison result - doesn't save to filesystem
const saveComparisonResult = (diffId: string, metadata: ComparisonResult) => {
  comparisonMetadataCache.set(diffId, metadata);
};

// Helper function to get comparison metadata from cache - no longer exported as a route handler
const getComparisonMetadata = (diffId: string) => {
  return comparisonMetadataCache.get(diffId);
};

// GET all comparison results - now returns from in-memory cache
export async function GET(req: NextRequest) {
  try {
    // Return comparisons from memory cache
    const comparisons = Array.from(comparisonMetadataCache.values());
    return NextResponse.json({ success: true, comparisons });
  } catch (err) {
    console.error('Error getting comparison results:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve comparison results' },
      { status: 500 }
    );
  }
}

// POST - Compare two screenshots
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      baseImageId: baseId,
      compareImageId: compareId,
      threshold = 0.3,
      ignoreAA = true,
      devicePixelRatio = 1
    } = body;

    if (!baseId || !compareId) {
      return NextResponse.json(
        { success: false, error: 'Base and compare image IDs are required' },
        { status: 400 }
      );
    }

    // Get file paths - support both OSS URLs and local paths
    const basePath = baseId.startsWith('http') ? baseId : path.join(SCREENSHOT_DIR, `${baseId}`);
    const comparePath = compareId.startsWith('http') ? compareId : path.join(SCREENSHOT_DIR, `${compareId}`);

    try {
      // Read both images with preprocessing
      const img1 = await readImage(basePath, devicePixelRatio);
      const img2 = await readImage(comparePath, devicePixelRatio);

      // Normalize image dimensions
      const { img1: normalizedImg1, img2: normalizedImg2, dimensions } = normalizeImagePair(img1, img2);

      // Create anti-aliasing configuration
      const aaConfig = createDefaultAAConfig();
      aaConfig.enabled = !ignoreAA;
      aaConfig.threshold = threshold;

      // Create output image (diff)
      const diff = new PNG({ width: dimensions.width, height: dimensions.height });

      // Run pixelmatch with enhanced anti-aliasing detection
      const numDiffPixels = pixelmatch(
        normalizedImg1.data,
        normalizedImg2.data,
        diff.data,
        dimensions.width,
        dimensions.height,
        {
          threshold: parseFloat(threshold.toString()),
          includeAA: !ignoreAA,
          alpha: aaConfig.alphaThreshold,
          diffColor: aaConfig.aaColor,
          diffMask: false
        }
      );

      // Generate a unique filename for the diff
      const diffId = uuidv4();
      const diffFilename = `${diffId}.png`;

      // Convert PNG to buffer
      const chunks: Buffer[] = [];
      const diffStream = diff.pack();

      // Wait for the PNG to be serialized
      const diffBuffer = await new Promise<Buffer>((resolve, reject) => {
        diffStream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
        diffStream.on('end', () => resolve(Buffer.concat(chunks)));
        diffStream.on('error', reject);
      });

      // Upload diff image to OSS
      const ossUploadResult = await uploadToOSS(diffBuffer, diffFilename);

      // Calculate diff percentage
      const totalPixels = dimensions.width * dimensions.height;
      const diffPercentage = (numDiffPixels / totalPixels) * 100;

      // Get metadata for base and compare images
      const baseName = baseId.split('/').pop() || baseId;
      const compareName = compareId.split('/').pop() || compareId;

      // Create metadata for the comparison
      const comparisonMetadata: ComparisonResult = {
        id: diffId,
        baseId,
        compareId,
        baseName,
        compareName,
        diffPixels: numDiffPixels,
        diffPercentage,
        threshold: parseFloat(threshold.toString()),
        ignoreAA,
        timestamp: new Date().toISOString(),
        diffImage: ossUploadResult.filePath,
        baseImage: baseId,
        compareImage: compareId,
        dimensions: dimensions,
        preprocessing: {
          devicePixelRatio,
          normalizedWidth: dimensions.width,
          normalizedHeight: dimensions.height,
          originalDimensions: {
            base: { width: img1.width, height: img1.height },
            compare: { width: img2.width, height: img2.height }
          }
        },
        antiAliasing: {
          enabled: !ignoreAA,
          threshold: threshold,
          alphaThreshold: aaConfig.alphaThreshold,
          aaColor: aaConfig.aaColor,
          detectAA: aaConfig.detectAA
        },
        diffAreas: [] // This will be populated by analyzing diff clusters
      };

      // Save comparison metadata to memory cache
      saveComparisonResult(diffId, comparisonMetadata);

      // Return the comparison result
      return NextResponse.json({
        success: true,
        baseImage: baseId,
        compareImage: compareId,
        diffImage: ossUploadResult.filePath,
        diffPixels: numDiffPixels,
        diffPercentage,
        id: diffId,
        preprocessing: comparisonMetadata.preprocessing,
        antiAliasing: comparisonMetadata.antiAliasing
      });
    } catch (err) {
      console.error('Error reading or comparing images:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to read or compare images' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Error processing comparison:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process comparison' },
      { status: 500 }
    );
  }
}
