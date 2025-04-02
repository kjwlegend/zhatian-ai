import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { v4 as uuidv4 } from 'uuid';

// Set up directory paths
const SCREENSHOT_DIR = process.env.OSS_BASE_URL || 'public/data/screenshots';
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// Ensure directories exist
if (!fs.existsSync(DIFF_DIR)) {
  fs.mkdirSync(DIFF_DIR, { recursive: true });
}

// Types
interface ComparisonResult {
  id: string;
  baseId: string;
  compareId: string;
  baseName: string;
  compareName: string;
  diffPixels: number;
  diffPercentage: number;
  threshold: number;
  ignoreAA: boolean;
  timestamp: string;
  diffImage: string;
  baseImage: string;
  compareImage: string;
  dimensions: {
    width: number;
    height: number;
  };
  diffAreas: Array<any>; // Will be populated by report analysis
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

// Updated helper to read an image as PNG
const readImage = async (filePath: string): Promise<PNG> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get the file data (whether local or from OSS)
      const fileData = await getFile(filePath);

      // Create a PNG from the buffer
      const png = new PNG() as any;
      png.parse(fileData, (error: Error | null, data: PNG) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
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

// Helper function for in-memory comparison metadata storage
export const comparisonMetadataCache = new Map<string, ComparisonResult>();

// Modified helper to save comparison result - doesn't save to filesystem
const saveComparisonResult = (diffId: string, metadata: ComparisonResult) => {
  // Store in memory cache instead of filesystem
  comparisonMetadataCache.set(diffId, metadata);
};

// Helper function to get comparison metadata from cache
export const getComparisonMetadata = (diffId: string) => {
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
    const { baseImageId: baseId, compareImageId:compareId, threshold = 0.01, ignoreAA = false } = body;

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
      // Read both images
      const img1 = await readImage(basePath);
      const img2 = await readImage(comparePath);

      // Ensure dimensions match
      let width: number, height: number;

      if (img1.width !== img2.width || img1.height !== img2.height) {
        // Resize the larger image to match the smaller one
        width = Math.min(img1.width, img2.width);
        height = Math.min(img1.height, img2.height);
        console.log(`Dimensions don't match. Resizing to ${width}x${height}`);
      } else {
        width = img1.width;
        height = img1.height;
      }

      // Create output image (diff)
      const diff = new PNG({ width, height });

      // Run pixelmatch
      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        {
          threshold: parseFloat(threshold.toString()),
          includeAA: !ignoreAA,
          alpha: 0.1,
          diffColor: [255, 0, 0],    // Red for differences
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
      const totalPixels = width * height;
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
        diffImage: ossUploadResult.filePath, // Use OSS path instead of local filename
        baseImage: baseId,
        compareImage: compareId,
        dimensions: { width, height },
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
        id: diffId
      });
    } catch (err) {
      console.error('Error reading images:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to read images' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('Error comparing images:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to compare images' },
      { status: 500 }
    );
  }
}
