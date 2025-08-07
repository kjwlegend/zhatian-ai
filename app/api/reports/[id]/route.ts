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
    report.id = id
    return NextResponse.json({ success: true, report });
  } catch (err) {
    console.error('Error getting report:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve report' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  console.error('%c req ', 'background-image:color:transparent;color:red;');
  console.error('🚀~ => ', req.url);
  // In DELETE method, we should get the id from params like in the GET method
  // The id is part of the URL path, not a query parameter
  const id = req.url.split('/').pop();

  // If we can't extract the id from the URL, log an error
  if (!id) {
    console.error('Failed to extract ID from URL:', req.url);
    return NextResponse.json(
      { success: false, error: 'Invalid report ID' },
      { status: 400 }
    );
  }
  console.error('%c id ', 'background-image:color:transparent;color:red;');
  console.error('🚀~ => ', id);
  const reportPath = path.join(DIFF_DIR, `${id}_report.json`);
  fs.unlinkSync(reportPath);
  return NextResponse.json({ success: true });
}
