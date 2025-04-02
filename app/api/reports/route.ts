import { NextRequest, NextResponse } from 'next/server';
import { getAllReports } from '@/app/api/_lib/metadata-cache';

// GET all reports
export async function GET(req: NextRequest) {
  try {
    // Get all reports from the shared cache
    const reports = getAllReports();
    return NextResponse.json({ success: true, reports });
  } catch (err) {
    console.error('Error getting reports:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
