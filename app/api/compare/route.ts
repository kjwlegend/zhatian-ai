import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { v4 as uuidv4 } from 'uuid';

// Set up directory paths
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || 'public/data/screenshots';
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
  baseName?: string;
  compareName?: string;
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

// Helper function to read an image as PNG
const readImage = (filePath: string): Promise<PNG> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
      .pipe(new PNG() as any)
      .on('parsed', function (this: PNG) {
        resolve(this);
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });
};

// Helper function to save a comparison result
const saveComparisonResult = (diffResult: { diffImage: string }, metadata: ComparisonResult) => {
  const metadataPath = path.join(DIFF_DIR, `${diffResult.diffImage.replace('.png', '')}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
};

// GET all comparison results
export async function GET(req: NextRequest) {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(DIFF_DIR)) {
      fs.mkdirSync(DIFF_DIR, { recursive: true });
      return NextResponse.json({ success: true, comparisons: [] });
    }

    // Get all JSON files (metadata)
    const files = fs.readdirSync(DIFF_DIR)
      .filter(file => file.endsWith('.json') && !file.includes('_report'));

    // Read metadata for each comparison
    const comparisons = files.map(filename => {
      try {
        const metadataPath = path.join(DIFF_DIR, filename);
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        return {
          id: filename.replace('.json', ''),
          ...metadata
        };
      } catch (err) {
        console.error(`Error reading metadata for ${filename}:`, err);
        return null;
      }
    }).filter(Boolean);

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

    // Get file paths
    const basePath = path.join(SCREENSHOT_DIR, `${baseId}.png`);
    const comparePath = path.join(SCREENSHOT_DIR, `${compareId}.png`);

    // Check if files exist
    if (!fs.existsSync(basePath)) {
      return NextResponse.json(
        { success: false, error: 'Base image not found' },
        { status: 404 }
      );
    }

    if (!fs.existsSync(comparePath)) {
      return NextResponse.json(
        { success: false, error: 'Compare image not found' },
        { status: 404 }
      );
    }

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
    const diffFilename = `${uuidv4()}.png`;
    const diffPath = path.join(DIFF_DIR, diffFilename);

    // Save the diff image
    diff.pack().pipe(fs.createWriteStream(diffPath));

    // Calculate diff percentage
    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;

    // Get metadata for base and compare images
    let baseMetadata: any = {}, compareMetadata: any = {};

    const baseMetadataPath = path.join(SCREENSHOT_DIR, `${baseId}.json`);
    const compareMetadataPath = path.join(SCREENSHOT_DIR, `${compareId}.json`);

    if (fs.existsSync(baseMetadataPath)) {
      baseMetadata = JSON.parse(fs.readFileSync(baseMetadataPath, 'utf8'));
    }

    if (fs.existsSync(compareMetadataPath)) {
      compareMetadata = JSON.parse(fs.readFileSync(compareMetadataPath, 'utf8'));
    }

    // Create metadata for the comparison
    const comparisonMetadata: ComparisonResult = {
      id: diffFilename.replace('.png', ''),
      baseId,
      compareId,
      baseName: baseMetadata.name || baseId,
      compareName: compareMetadata.name || compareId,
      diffPixels: numDiffPixels,
      diffPercentage,
      threshold: parseFloat(threshold.toString()),
      ignoreAA,
      timestamp: new Date().toISOString(),
      diffImage: diffFilename,
      baseImage: `${baseId}.png`,
      compareImage: `${compareId}.png`,
      dimensions: { width, height },
      diffAreas: [] // This will be populated by analyzing diff clusters
    };

    // Save comparison metadata
    saveComparisonResult(
      { diffImage: diffFilename },
      comparisonMetadata,
    );

    // Return the comparison result
    return NextResponse.json({
      success: true,
      baseImage: `${baseId}.png`,
      compareImage: `${compareId}.png`,
      diffImage: diffFilename,
      diffPixels: numDiffPixels,
      diffPercentage,
      id: diffFilename.replace('.png', '')
    });
  } catch (err) {
    console.error('Error comparing images:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to compare images' },
      { status: 500 }
    );
  }
}
