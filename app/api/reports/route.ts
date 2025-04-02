import { NextRequest, NextResponse } from 'next/server';

// In-memory reports cache
const reportCache = new Map<string, any>();

// Function to add a report to the cache
export function addReport(diffId: string, report: any): void {
  reportCache.set(diffId, report);
}

// GET all reports
export async function GET(req: NextRequest) {
  try {
    // Convert the cache to an array of reports
    const reports = Array.from(reportCache.entries()).map(([diffId, report]) => {
      return {
        id: diffId,
        ...report
      };
    });

    return NextResponse.json({ success: true, reports });
  } catch (err) {
    console.error('Error getting reports:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
