import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import puppeteer from 'puppeteer';

// Set up directory paths
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || 'public/data/screenshots';

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Types
interface Screenshot {
  id: string;
  filename: string;
  name: string;
  date: string;
  size: number;
  width?: number;
  height?: number;
  deviceType: string;
}

interface ScreenshotMetadata {
  name: string;
  url?: string;
  date: string;
  deviceType: string;
  width?: number;
  height?: number;
  uploadedFile?: boolean;
}

// Helper to save metadata for a screenshot
const saveMetadata = (filename: string, metadata: ScreenshotMetadata) => {
  const metadataPath = path.join(SCREENSHOT_DIR, `${filename.replace('.png', '')}.json`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
};

// Helper to get screenshots data
const getScreenshots = (): Screenshot[] => {
  // Ensure the directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    return [];
  }

  try {
    // Read the directory and get PNG files
    const files = fs.readdirSync(SCREENSHOT_DIR)
      .filter(file => file.endsWith('.png'));

    // Get metadata for each file
    return files.map(filename => {
      const filePath = path.join(SCREENSHOT_DIR, filename);
      const stats = fs.statSync(filePath);

      // Try to get metadata from a JSON file with the same name if it exists
      let metadata: Partial<ScreenshotMetadata> = {};
      const metadataPath = path.join(SCREENSHOT_DIR, `${filename.replace('.png', '')}.json`);

      if (fs.existsSync(metadataPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch (err) {
          console.error(`Error reading metadata for ${filename}:`, err);
        }
      }

      return {
        id: filename.replace('.png', ''),
        filename: filename,
        name: metadata.name || filename,
        date: metadata.date || stats.mtime.toISOString(),
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        deviceType: metadata.deviceType || 'desktop'
      };
    });
  } catch (err) {
    console.error('Error reading screenshots directory:', err);
    return [];
  }
};

// GET all screenshots
export async function GET(req: NextRequest) {
  try {
    const screenshots = getScreenshots();
    return NextResponse.json({ success: true, screenshots });
  } catch (err) {
    console.error('Error getting screenshots:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve screenshots' },
      { status: 500 }
    );
  }
}

// POST - Capture a new screenshot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, name, deviceType = 'desktop' } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new' // Use the new headless mode
    });

    const page = await browser.newPage();

    // Set viewport based on device type
    switch (deviceType) {
      case 'mobile':
        await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
        break;
      case 'tablet':
        await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
        break;
      default: // desktop
        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    }

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Remove dynamic elements that could cause false positives in comparisons
    await page.evaluate(() => {
      // Remove timestamps, ads, etc.
      document.querySelectorAll('.timestamp, .ad, .advertisement').forEach(el => el.remove());
    });

    // Generate a unique filename
    const filename = `${uuidv4()}.png`;
    const filePath = path.join(SCREENSHOT_DIR, filename);

    // Take the screenshot
    await page.screenshot({ path: filePath, fullPage: true });

    // Save metadata
    const viewport = page.viewport();
    const metadata: ScreenshotMetadata = {
      name: name || `Screenshot of ${url}`,
      url,
      date: new Date().toISOString(),
      deviceType,
      width: viewport?.width,
      height: viewport?.height
    };

    saveMetadata(filename, metadata);

    await browser.close();

    return NextResponse.json({
      success: true,
      message: 'Screenshot captured successfully',
      id: filename.replace('.png', ''),
      filename
    });
  } catch (err) {
    console.error('Error capturing screenshot:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to capture screenshot' },
      { status: 500 }
    );
  }
}
