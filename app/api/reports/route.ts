import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Set up directory paths
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';

// GET all reports
export async function GET(req: NextRequest) {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(DIFF_DIR)) {
      fs.mkdirSync(DIFF_DIR, { recursive: true });
      return NextResponse.json({ success: true, reports: [] });
    }

    // Get all report files
    const files = fs.readdirSync(DIFF_DIR)
      .filter(file => file.includes('_report.json'));

    // Read each report
    const reports = files.map(filename => {
      try {
        const reportPath = path.join(DIFF_DIR, filename);
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        const diffId = filename.replace('_report.json', '');

        return {
          id: diffId,
          ...report
        };
      } catch (err) {
        console.error(`Error reading report ${filename}:`, err);
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({ success: true, reports });
  } catch (err) {
    console.error('Error getting reports:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
