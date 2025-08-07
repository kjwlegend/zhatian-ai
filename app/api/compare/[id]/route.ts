import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set up directory paths
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// DELETE a comparison result
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Try both with and without .png extension
    const pngPath = path.join(DIFF_DIR, `${id}.png`);
    const jsonPath = path.join(DIFF_DIR, `${id}.json`);
    const reportPath = path.join(DIFF_DIR, `${id}_report.json`);

    let deleted = false;

    // Delete the image file
    if (fs.existsSync(pngPath)) {
      fs.unlinkSync(pngPath);
      deleted = true;
    }

    // Delete metadata if it exists
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      deleted = true;
    }

    // Delete report if it exists
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Comparison result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Comparison result deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting comparison result:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comparison result' },
      { status: 500 }
    );
  }
}
