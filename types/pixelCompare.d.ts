
// Types for UI Compare
interface Screenshot {
    uploadName: string;
    fileName: string;
    filePath: string;
    originalFilename: string;
}

interface Comparison {
    id: string;
    baseId: string;
    compareId: string;
    baseImage: string;
    compareImage: string;
    baseName: string;
    compareName: string;
    diffPixels: number;
    diffPercentage: number;
    diffImage?: string;
    date: string;
}

interface ReportIssue {
    title: string;
    description: string;
    type: string;
    priority: string;
    recommendation: string;
}

interface UIReport {
    id: string;
    summary: string;
    issues: ReportIssue[];
    metadata?: {
        diffId: string;
        generatedAt: string;
        comparisonData: any;
    };
    date: string;
}

interface UICompare {
    Screenshots: Screenshot[];
    Comparisons: Comparison[];
    Reports: UIReport[];
}
