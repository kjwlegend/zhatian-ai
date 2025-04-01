import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set up directory paths
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// GET a specific report
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const reportPath = path.join(DIFF_DIR, `${id}_report.json`);

    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    return NextResponse.json({ success: true, report });
  } catch (err) {
    console.error('Error getting report:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve report' },
      { status: 500 }
    );
  }
}
