// Types
export interface ComparisonResult {
  id: string;
  baseId: string;
  compareId: string;
  baseName: string;
  compareName: string;
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
  // New fields for image preprocessing and anti-aliasing
  preprocessing: {
    devicePixelRatio: number;
    normalizedWidth: number;
    normalizedHeight: number;
    originalDimensions: {
      base: { width: number; height: number };
      compare: { width: number; height: number };
    };
  };
  antiAliasing: {
    enabled: boolean;
    threshold: number;
    alphaThreshold: number;
    aaColor: [number, number, number];
    detectAA: boolean;
  };
  diffAreas: Array<any>; // Will be populated by report analysis
}

// Helper function for in-memory comparison metadata storage
export const comparisonMetadataCache = new Map<string, ComparisonResult>();

// Export a getter function to access the cache
export function getComparisonMetadata(diffId: string): ComparisonResult | undefined {
  return comparisonMetadataCache.get(diffId);
}

// Report cache and helper functions
export const reportCache = new Map<string, any>();

export function addReport(diffId: string, report: any): void {
  reportCache.set(diffId, report);
}

export function getReport(diffId: string): any {
  return reportCache.get(diffId);
}

export function getAllReports(): any[] {
  return Array.from(reportCache.entries()).map(([diffId, report]) => ({
    id: diffId,
    ...report
  }));
}
