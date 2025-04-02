import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set up directory paths
const SCREENSHOT_DIR = process.env.OSS_BASE_URL || 'public/data/screenshots';

// GET a single screenshot by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try both with and without .png extension
    const filePath = path.join(SCREENSHOT_DIR, `${id}`);
    const pngPath = path.join(SCREENSHOT_DIR, `${id}.png`);

    // Check if it's already a full filename
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // Try with .png extension
    if (fs.existsSync(pngPath)) {
      const fileBuffer = fs.readFileSync(pngPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Screenshot not found' },
      { status: 404 }
    );
  } catch (err) {
    console.error('Error getting screenshot:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve screenshot' },
      { status: 500 }
    );
  }
}

// DELETE a screenshot
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try both with and without .png extension
    const filePath = path.join(SCREENSHOT_DIR, `${id}`);
    const pngPath = path.join(SCREENSHOT_DIR, `${id}.png`);
    const jsonPath = path.join(SCREENSHOT_DIR, `${id}.json`);

    let deleted = false;

    // Delete the image file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted = true;
    }

    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
      deleted = true;
    }

    // Delete metadata if it exists
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Screenshot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Screenshot deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting screenshot:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete screenshot' },
      { status: 500 }
    );
  }
}
