'use client';

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Trash2, Upload } from "lucide-react";
// @ts-ignore
// import { get } from 'lodash'

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
  diffImage: string;
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

export default function PixelCompare() {
  // State variables
  const [activeTab, setActiveTab] = useState("screenshots");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Screenshots tab states
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [uploadName, setUploadName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compare tab states
  const [baseImageId, setBaseImageId] = useState("");
  const [compareImageId, setCompareImageId] = useState("");
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<Comparison | null>(null);
  const [comparing, setComparing] = useState(false);

  // Reports tab states
  const [comparisonId, setComparisonId] = useState("");
  const [reports, setReports] = useState<UIReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<UIReport | null>(null);
  const [generating, setGenerating] = useState(false);

  // API base URL
  const apiBase = "/api";

  useEffect(() => {
    fetchScreenshots();
    fetchComparisons();
    fetchReports();
  }, []);

  const fetchScreenshots = async () => {
    let UICompare = localStorage.getItem('UI-Compare')

    if (!UICompare) {
      const params = {
        Screenshots: [],
        Comparisons: [],
        Reports: []
      }
      localStorage.setItem('UI-Compare', JSON.stringify(params))
      setScreenshots([]);
    } else {
      const parsedData = JSON.parse(UICompare) as UICompare;
      setScreenshots(parsedData.Screenshots || []);
    }

    setError(null);
    // Skip API fetch since we're using localStorage now
  };

  const fetchComparisons = async () => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        setComparisons(UICompare.Comparisons || []);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching comparisons:', err);
      setError(err.message || 'Failed to fetch comparisons');
    }
  };

  const fetchReports = async () => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        setReports(UICompare.Reports || []);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
    }
  };

  const captureScreenshot = async () => {
    if (!url || !name) return;

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/screenshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to capture screenshot');
      }

      // Reset form and refresh screenshots
      setUrl('');
      setName('');
      fetchScreenshots();
      setError(null);
    } catch (err: any) {
      console.error('Error capturing screenshot:', err);
      setError(err.message || 'Failed to capture screenshot');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const clearFileInput = () => {
    setUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // UI-Compare

  const uploadToOSS = async () => {
    if (!uploadFile || !uploadName) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("name", uploadName);
      formData.append('folderName', 'BOMB-AI');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      // const response = await fetch(`${apiBase}/screenshots/upload`, {
      //   method: 'POST',
      //   body: formData
      // });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      let { fileName, filePath, originalFilename } = data;
      let image = {
        uploadName,
        fileName,
        filePath,
        originalFilename
      };
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        let UICompare = JSON.parse(UICompareStr) as UICompare;
        UICompare.Screenshots.push(image);
        localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
        // Refresh screenshots list
        setScreenshots(UICompare.Screenshots);
      }

      // Reset form and refresh screenshots
      setUploadName('');
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchScreenshots();
      setError(null);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const deleteScreenshot = async (index: string) => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        UICompare.Screenshots.splice(parseInt(index), 1);
        localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
        setScreenshots(UICompare.Screenshots);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error deleting screenshot:', err);
      setError(err.message || 'Failed to delete screenshot');
    }
  };

  const runComparison = async () => {
    if (!baseImageId || !compareImageId) return;
    setComparing(true);

    try {
      // Find selected screenshots to get file paths
      const baseScreenshot = screenshots.find(s => s.fileName === baseImageId);
      const compareScreenshot = screenshots.find(s => s.fileName === compareImageId);

      if (!baseScreenshot || !compareScreenshot) {
        throw new Error('Selected screenshots not found');
      }

      // Call the comparison API with the file paths
      const response = await fetch(`${apiBase}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseImageId: baseScreenshot.filePath,
          compareImageId: compareScreenshot.filePath
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compare screenshots');
      }

      // Get the API response data
      const comparisonResult = await response.json();

      // Now save the result to localStorage
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;

        // Create comparison object with data from API and localStorage
        const comparison: Comparison = {
          id: comparisonResult.id,
          baseId: baseImageId,
          compareId: compareImageId,
          baseImage: baseScreenshot.filePath,
          compareImage: compareScreenshot.filePath,
          baseName: baseScreenshot.uploadName,
          compareName: compareScreenshot.uploadName,
          diffPixels: comparisonResult.diffPixels,
          diffPercentage: comparisonResult.diffPercentage,
          diffImage: comparisonResult.diffImage,
          date: new Date().toISOString()
        };

        UICompare.Comparisons.push(comparison);
        localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
        setComparisons(UICompare.Comparisons);
      }

      // Reset form
      setBaseImageId('');
      setCompareImageId('');
      setError(null);
    } catch (err: any) {
      console.error('Error running comparison:', err);
      setError(err.message || 'Failed to compare screenshots');
    } finally {
      setComparing(false);
    }
  };

  const deleteComparison = async (id: string) => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        const index = UICompare.Comparisons.findIndex(comp => comp.id === id);
        if (index !== -1) {
          UICompare.Comparisons.splice(index, 1);
          localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
          setComparisons(UICompare.Comparisons);
        }
      }
      setSelectedComparison(null);
      setError(null);
    } catch (err: any) {
      console.error('Error deleting comparison:', err);
      setError(err.message || 'Failed to delete comparison');
    }
  };

  const generateReport = async () => {
    if (!comparisonId) return;

    setGenerating(true);
    try {
      // Get comparison data from localStorage
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (!UICompareStr) {
        throw new Error('No comparison data found');
      }

      const UICompare = JSON.parse(UICompareStr) as UICompare;
      const comparison = UICompare.Comparisons.find(comp => comp.id === comparisonId);

      if (!comparison) {
        throw new Error('Comparison not found');
      }

      // Encode the comparison data to pass directly to the API
      const encodedData = encodeURIComponent(JSON.stringify(comparison));

      // Call the report generation API with direct data
      const response = await fetch(`${apiBase}/reports/generate/${comparisonId}?directData=true&data=${encodedData}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate report');
      }

      // Get the API response data
      const apiResponse = await response.json();

      // Check if the report was successfully generated
      if (!apiResponse.success || !apiResponse.report) {
        throw new Error('Failed to generate report: Invalid response format');
      }

      // Create a report object from API response with the correct format
      const reportData: UIReport = {
        id: Date.now().toString(),
        summary: apiResponse.report.summary,
        issues: apiResponse.report.issues || [],
        metadata: {
          diffId: comparisonId,
          generatedAt: apiResponse.report.metadata?.generatedAt || new Date().toISOString(),
          comparisonData: comparison
        },
        date: new Date().toISOString()
      };

      UICompare.Reports.push(reportData);
      localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
      setReports(UICompare.Reports);

      // Reset form and refresh reports list
      setComparisonId('');
      fetchReports();
      setError(null);
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const viewReport = async (id: string) => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        const report = UICompare.Reports.find(report => report.id === id);

        if (!report) {
          throw new Error('Report not found');
        }

        setSelectedReport(report);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Failed to fetch report');
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const UICompareStr = localStorage.getItem('UI-Compare');
      if (UICompareStr) {
        const UICompare = JSON.parse(UICompareStr) as UICompare;
        const index = UICompare.Reports.findIndex(report => report.id === id);

        if (index !== -1) {
          UICompare.Reports.splice(index, 1);
          localStorage.setItem('UI-Compare', JSON.stringify(UICompare));
          setReports(UICompare.Reports);
        }
      }
      setSelectedReport(null);
      setError(null);
    } catch (err: any) {
      console.error('Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Priority color map
  const priorityColors: Record<string, string> = {
    '严重': 'bg-red-100 text-red-800',
    '重要': 'bg-amber-100 text-amber-800',
    '轻微': 'bg-green-100 text-green-800',
    // English fallbacks
    'Critical': 'bg-red-100 text-red-800',
    'Major': 'bg-amber-100 text-amber-800',
    'Minor': 'bg-green-100 text-green-800'
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pixel Compare - Visual Regression Testing</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button
            className="ml-auto"
            onClick={() => setError(null)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="screenshots">Screenshot Management</TabsTrigger>
          <TabsTrigger value="compare">Image Comparison</TabsTrigger>
          <TabsTrigger value="reports">AI Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="screenshots">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Capture Screenshot from URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      disabled={true}
                      id="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Screenshot Name</Label>
                    <Input
                      disabled={true}
                      id="name"
                      placeholder="Homepage - Desktop"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={captureScreenshot}
                    disabled={loading || !url || !name}
                    className="w-full"
                  >
                    {loading ? "Capturing..." : "Capture Screenshot"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="uploadName">Image Name</Label>
                    <Input
                      id="uploadName"
                      placeholder="Product Page - Mobile"
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uploadFile">Select Image File</Label>
                    <Input
                      id="uploadFile"
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/jpeg"
                      onChange={handleFileChange}
                    />
                  </div>

                  {uploadFile && (
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="text-sm">
                        <p className="font-medium">{uploadFile.name}</p>
                        <p className="text-gray-500">{Math.round(uploadFile.size / 1024)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearFileInput}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={uploadToOSS}
                    disabled={loading || !uploadFile || !uploadName}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {loading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4">Saved Screenshots</h2>
          {screenshots.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p>No screenshots available. Capture or upload some screenshots to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {screenshots.map((screenshot, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={screenshot.filePath}
                    alt={screenshot.uploadName}
                    className="w-full object-cover object-top"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{screenshot.uploadName}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {screenshot.fileName}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">{screenshot.originalFilename}</p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => deleteScreenshot(index.toString())}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Run Image Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseImage">Base Image</Label>
                  <select
                    id="baseImage"
                    className="w-full border rounded-md p-2"
                    value={baseImageId}
                    onChange={(e) => setBaseImageId(e.target.value)}
                  >
                    <option value="">Select base image</option>
                    {screenshots.map((screenshot, index) => (
                      <option key={index} value={screenshot.fileName.toString()}>
                        {screenshot.uploadName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareImage">Compare Image</Label>
                  <select
                    id="compareImage"
                    className="w-full border rounded-md p-2"
                    value={compareImageId}
                    onChange={(e) => setCompareImageId(e.target.value)}
                  >
                    <option value="">Select compare image</option>
                    {screenshots.map((screenshot, index) => (
                      <option key={index} value={screenshot.fileName.toString()}>
                        {screenshot.uploadName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={runComparison}
                disabled={comparing || !baseImageId || !compareImageId}
                className="w-full mt-4"
              >
                {comparing ? "Comparing..." : "Run Comparison"}
              </Button>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mt-8 mb-4">Comparison Results</h2>
          {comparisons.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p>No comparisons available. Run a comparison to see the results.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comparisons.map((comparison) => (
                <Card key={comparison.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Base Image</h3>
                        <img
                          src={typeof comparison.baseId === 'number'
                            ? screenshots[comparison.baseId]?.filePath
                            : comparison.baseImage}
                          alt={comparison.baseName}
                          className="w-full object-cover object-top border"
                        />
                        <p className="text-sm mt-1 truncate">{comparison.baseName}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Compare Image</h3>
                        <img
                          src={typeof comparison.compareId === 'number'
                            ? screenshots[comparison.compareId]?.filePath
                            : comparison.compareImage}
                          alt={comparison.compareName}
                          className="w-full object-cover object-top border"
                        />
                        <p className="text-sm mt-1 truncate">{comparison.compareName}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Diff Result</h3>
                        {comparison.diffImage ? (
                          <img
                            src={comparison.diffImage}
                            alt="Diff result"
                            className="w-full object-cover object-top border"
                          />
                        ) : (
                          <div className="bg-gray-100 w-full h-48 flex items-center justify-center border">
                            <p className="text-gray-400">Diff Preview</p>
                          </div>
                        )}
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">
                            Diff: <span className="font-medium">{comparison.diffPercentage?.toFixed(2) || "0.00"}%</span>
                          </p>
                          <p className="text-sm">
                            Pixels: <span className="font-medium">{comparison.diffPixels || 0}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        {new Date(comparison.date).toLocaleString()}
                      </p>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setComparisonId(comparison.id)}
                        >
                          Generate AI Report
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteComparison(comparison.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comparisonId">Select Comparison</Label>
                  <select
                    id="comparisonId"
                    className="w-full border rounded-md p-2"
                    value={comparisonId}
                    onChange={(e) => setComparisonId(e.target.value)}
                  >
                    <option value="">Select a comparison</option>
                    {comparisons.map((comparison) => (
                      <option key={comparison.id} value={comparison.id}>
                        {comparison.baseName} vs {comparison.compareName} (
                        {comparison.diffPercentage.toFixed(2)}%)
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  onClick={generateReport}
                  disabled={generating || !comparisonId}
                  className="w-full"
                >
                  {generating ? "Generating..." : "Generate AI Report"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="md:col-span-1">
              <h2 className="text-xl font-bold mb-4">Available Reports</h2>
              {reports.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                  <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                  <p>No reports available. Generate a report to see the results.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <Card
                      key={report.id}
                      className={`cursor-pointer ${selectedReport?.id === report.id ? "border-primary" : ""
                        }`}
                      onClick={() => viewReport(report.id)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium">
                          {report?.metadata?.comparisonData?.baseName} vs {report?.metadata?.comparisonData?.compareName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Diff: {(report?.metadata?.comparisonData?.diffPercentage ?? 0).toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(report?.metadata?.generatedAt ?? Date.now()).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Report Details</h2>
              {selectedReport ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {selectedReport?.metadata?.comparisonData?.baseName} vs {selectedReport?.metadata?.comparisonData?.compareName}
                      </h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteReport(selectedReport?.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                    <Separator className="my-4" />
                    {selectedReport?.metadata?.comparisonData?.diffImage && (
                      <img
                        src={selectedReport.metadata.comparisonData.diffImage}
                        alt="Diff result"
                        className="w-full object-cover object-top border mb-4"
                      />
                    )}
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-bold mb-2">Issue</h4>
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedReport?.issues?.map((issue) => (
                          <div key={issue.title}>
                            <h5 className="font-bold mb-2">title: {issue.title}</h5>
                            <p className="text-sm text-gray-500">description: {issue.description}</p>
                            <p className="text-sm text-gray-500">type: {issue.type}</p>
                            <p className="text-sm text-gray-500">priority: {issue.priority}</p>
                            <p className="text-sm text-gray-500">recommendation: {issue.recommendation}</p>
                          </div>
                        ))}
                      </div>
                      <br></br>
                      <h4 className="font-bold mb-2">AI Analysis</h4>
                      <div className="whitespace-pre-wrap text-sm">
                        {selectedReport.summary}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                  <p>Select a report to view details.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
