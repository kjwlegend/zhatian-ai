import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set up directory paths
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// GET a specific diff image
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try both with and without .png extension
    const filePath = path.join(DIFF_DIR, `${id}`);
    const pngPath = path.join(DIFF_DIR, `${id}.png`);

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
      { success: false, error: 'Diff image not found' },
      { status: 404 }
    );
  } catch (err) {
    console.error('Error getting diff image:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve diff image' },
      { status: 500 }
    );
  }
}
