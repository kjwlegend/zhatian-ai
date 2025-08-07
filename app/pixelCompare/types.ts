import { DetectedObject } from '@tensorflow-models/coco-ssd';

// Pixel Compare Configuration Types
export interface PixelCompareConfig {
  // Pixel Precision Controls
  threshold: number;               // Sensitivity threshold (0-1)
  colorTolerance: number;         // Color difference tolerance
  antiAliasing: boolean;          // Handle anti-aliasing
  regionMask?: {                  // Region-specific comparison
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // AI Enhancement Options
  useAI: boolean;                 // Enable AI features
  elementDetection: boolean;      // Detect UI elements
  semanticAnalysis: boolean;      // Use semantic understanding

  // Performance Options
  useParallel: boolean;          // Enable parallel processing
  cacheResults: boolean;         // Enable result caching
  progressiveLoading: boolean;   // Enable progressive loading
}

// AI Analysis Types
export interface UIElement {
  type: string;                // Button, Text, Image, etc.
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  changes: Array<{
    type: 'Added' | 'Removed' | 'Modified';
    severity: number;
    description: string;
  }>;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  confidence?: number;
  metadata?: {
    processingTime: number;
    baseTextContent: string[];
    compareTextContent: string[];
  };
  objectAnalysis?: {
    baseObjects: DetectedObject[];
    compareObjects: DetectedObject[];
    addedObjects: DetectedObject[];
    removedObjects: DetectedObject[];
  };
}

export interface ComparisonResult {
  diffResult: {
    diffImage: string;
    diffPixels: number;
    diffPercentage: number;
    baseImage?: string;
    compareImage?: string;
  };
  aiAnalysis?: AIAnalysisResult;
  metadata: {
    config: PixelCompareConfig;
    timestamp: string;
    processingTime: number;
    baseTextContent?: string[];
    compareTextContent?: string[];
  };
}

// Extended Report Types
export interface EnhancedReportIssue extends ReportIssue {
  aiConfidence: number;
  impactScore: number;
  affectedElements: UIElement[];
  visualEvidence: {
    region: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    screenshot: string;
  };
}

export interface EnhancedUIReport extends UIReport {
  aiAnalysis: {
    overallScore: number;
    confidence: number;
    keyFindings: string[];
    recommendations: {
      priority: 'Critical' | 'Major' | 'Minor';
      action: string;
      impact: string;
      effort: 'High' | 'Medium' | 'Low';
    }[];
  };
  visualTimeline?: {
    date: string;
    screenshot: string;
    changes: string[];
  }[];
}
