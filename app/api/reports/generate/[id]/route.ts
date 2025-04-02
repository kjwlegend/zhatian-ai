import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import OpenAI from 'openai';
import { comparisonMetadataCache, addReport } from '@/app/api/_lib/metadata-cache';

// Set up directory paths
const DIFF_DIR = process.env.DIFF_DIR || 'public/data/diffs';


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.VLM_OPENAI_API_KEY,
  baseURL: process.env.VLM_BASE_URL || undefined,
});

// Types
interface DiffCluster {
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
}

interface DiffArea {
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
}

interface ComparisonData {
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
  diffAreas: DiffArea[];
}

interface BaseMetadata {
  name?: string;
  url?: string;
  [key: string]: any;
}

// Helper function to read a diff image as PNG
const readDiffImage = (filePath: string): Promise<PNG> => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG() as any)
      .on('parsed', function (this: PNG) {
        resolve(this);
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });
};

// Helper function to analyze diff clusters using an in-memory PNG
const analyzeDiffClusters = async (diffImage: PNG): Promise<DiffCluster[]> => {
  try {
    const { width, height, data } = diffImage;

    // Find red pixels (diff pixels are red in our implementation)
    let diffPoints: { x: number; y: number }[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;

        // Check if pixel is red (R>200, G<50, B<50)
        if (data[idx] > 200 && data[idx + 1] < 50 && data[idx + 2] < 50) {
          diffPoints.push({ x, y });
        }
      }
    }

    // If no diff points, return empty array
    if (diffPoints.length === 0) {
      return [];
    }

    // Simple cluster algorithm - group points that are close together
    const clusters: { x: number; y: number }[][] = [];
    const visited = new Set<string>();
    const maxDistance = 20; // Max distance for neighbors

    // Iterative approach to find clusters using a queue
    for (const point of diffPoints) {
      const key = `${point.x},${point.y}`;
      if (visited.has(key)) continue;

      // Start a new cluster with this point
      const cluster: { x: number; y: number }[] = [];
      const queue: { x: number; y: number }[] = [point];

      // Process all connected points using BFS
      while (queue.length > 0) {
        const currentPoint = queue.shift()!;
        const currentKey = `${currentPoint.x},${currentPoint.y}`;

        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        cluster.push(currentPoint);

        // Find neighbors and add to queue
        for (const otherPoint of diffPoints) {
          const otherKey = `${otherPoint.x},${otherPoint.y}`;
          if (!visited.has(otherKey)) {
            const dx = Math.abs(otherPoint.x - currentPoint.x);
            const dy = Math.abs(otherPoint.y - currentPoint.y);
            if (dx <= maxDistance && dy <= maxDistance) {
              queue.push(otherPoint);
            }
          }
        }
      }

      // Only keep clusters with sufficient points to avoid noise
      if (cluster.length > 10) {
        clusters.push(cluster);
      }
    }

    // Convert clusters to bounding boxes
    return clusters.map(cluster => {
      const xs = cluster.map(p => p.x);
      const ys = cluster.map(p => p.y);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        points: cluster.length
      };
    });
  } catch (err) {
    console.error('Error analyzing diff clusters:', err);
    return [];
  }
};

// Helper to get comparison data
const getComparisonData = async (diffId: string): Promise<any> => {
  try {
    // Try to get metadata directly from the URL parameter
    console.log(`Looking for comparison data with ID: ${diffId}`);

    // Try getting data from the shared cache first
    let metadata = comparisonMetadataCache.get(diffId);
    console.log('Metadata from direct cache access:', metadata ? 'Found' : 'Not found');

    // If not found via direct import, try to find by ID in localStorage on client side
    // or try to read from file as fallback on server side
    if (!metadata) {
      console.log('Metadata not found in memory cache, trying fallback...');

      // Server-side fallback - try to read from file if exists
      try {
        const metadataPath = path.join(DIFF_DIR, `${diffId}.json`);
        if (fs.existsSync(metadataPath)) {
          const fileData = fs.readFileSync(metadataPath, 'utf8');
          metadata = JSON.parse(fileData);
          console.log('Found metadata in file system');
        }
      } catch (fileErr) {
        console.error('Error reading metadata from file:', fileErr);
      }

      if (!metadata) {
        throw new Error(`Comparison metadata not found for ID: ${diffId}`);
      }
    }

    // Analyze diff clusters if possible
    let diffClusters: DiffCluster[] = [];
    if (metadata.diffImage) {
      try {
        // Handle both relative and absolute URLs
        let imageUrl = metadata.diffImage;
        if (!imageUrl.startsWith('http')) {
          // Get the base URL from the environment or use a default
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          imageUrl = new URL(imageUrl, baseUrl).toString();
        }

        const response = await fetch(imageUrl);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          const pngParser = new PNG();

          // Use Promise to handle the parsing async
          await new Promise<void>((resolve, reject) => {
            (pngParser as any).parse(Buffer.from(imageBuffer), (err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });

          // Now analyze diff clusters using the image data
          diffClusters = await analyzeDiffClusters(pngParser);
        }
      } catch (err) {
        console.error('Error analyzing diff clusters:', err);
      }
    }

    // Add diff areas to metadata
    metadata.diffAreas = diffClusters;

    return {
      ...metadata,
      baseMetadata: { url: metadata.baseImage },
      compareMetadata: { url: metadata.compareImage },
      diffImagePath: metadata.diffImage
    };
  } catch (error) {
    console.error('Error getting comparison metadata:', error);
    throw new Error('Comparison metadata not found');
  }
};

// No file saving - only in-memory storage
const saveReport = (diffId: string, report: any): void => {
  // Use the shared addReport function directly
  addReport(diffId, report);
};

// Generate an AI report for a comparison
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diffId = params.id;
    console.log('Generating report for diff ID:', diffId);

    // Try to get comparison data from request body if this is a POST request
    let comparisonData;

    // Check if there's a searchParam called directData - this would be a signal
    // that we should load the comparison data from the URL
    const useDirectData = req.nextUrl.searchParams.get('directData') === 'true';

    if (useDirectData) {
      try {
        // Try to get the comparison data from the query params
        const encodedData = req.nextUrl.searchParams.get('data');
        if (encodedData) {
          const decodedData = decodeURIComponent(encodedData);
          comparisonData = JSON.parse(decodedData);
          console.log('Using direct comparison data from query params');
        }
      } catch (parseErr) {
        console.error('Error parsing direct comparison data:', parseErr);
      }
    }

    // If we don't have data yet, try to get it from the metadata cache
    if (!comparisonData) {
      comparisonData = await getComparisonData(diffId);
    }

    // Validate and ensure comparisonData has all required properties
    console.log('Available keys in comparisonData:', Object.keys(comparisonData));

    // Add default values for any missing required properties
    if (!comparisonData.dimensions) {
      console.log('Missing dimensions property, adding default');
      comparisonData.dimensions = { width: 800, height: 600 };
    }

    if (!comparisonData.diffPixels) comparisonData.diffPixels = 0;
    if (!comparisonData.diffPercentage) comparisonData.diffPercentage = 0;
    if (!comparisonData.diffAreas) comparisonData.diffAreas = [];
    if (!comparisonData.baseName) comparisonData.baseName = 'Base Image';
    if (!comparisonData.compareName) comparisonData.compareName = 'Compare Image';
    if (!comparisonData.threshold) comparisonData.threshold = 0.01;

    // Prepare data for OpenAI
    const promptData: {
      diff_pixels: number;
      diff_percentage: number;
      diff_areas: DiffArea[];
      base_name: string;
      compare_name: string;
      dimensions: { width: number; height: number };
      threshold: number;
      base_url: string;
      compare_url: string;
      diff_image_url: string;
      diff_image_base64: string | null;
    } = {
      diff_pixels: comparisonData.diffPixels,
      diff_percentage: comparisonData.diffPercentage,
      diff_areas: comparisonData.diffAreas || [],
      base_name: comparisonData.baseName || 'Base Image',
      compare_name: comparisonData.compareName || 'Compare Image',
      dimensions: comparisonData.dimensions,
      threshold: comparisonData.threshold || 0.01,
      base_url: comparisonData.baseMetadata?.url || comparisonData.baseImage || '',
      compare_url: comparisonData.compareMetadata?.url || comparisonData.compareImage || '',
      diff_image_url: comparisonData.diffImagePath || comparisonData.diffImage || '',
      // Handle diff image - could be a local file or a URL
      diff_image_base64: null
      // base_image_base64: fs.existsSync(path.join(SCREENSHOT_DIR, comparisonData.baseImage))
      //   ? `data:image/png;base64,${fs.readFileSync(path.join(SCREENSHOT_DIR, comparisonData.baseImage)).toString('base64')}`
      //   : null,
      // compare_image_base64: fs.existsSync(path.join(SCREENSHOT_DIR, comparisonData.compareImage))
      //   ? `data:image/png;base64,${fs.readFileSync(path.join(SCREENSHOT_DIR, comparisonData.compareImage)).toString('base64')}`
      //   : null
    };

    // Try to load the diff image if it exists
    const diffPath = promptData.diff_image_url;
    if (diffPath) {
      try {
        if (diffPath.startsWith('http')) {
          // It's a URL, fetch it
          const response = await fetch(diffPath);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            promptData.diff_image_base64 = `data:image/png;base64,${buffer.toString('base64')}`;
          }
        } else if (fs.existsSync(diffPath)) {
          // It's a local file
          promptData.diff_image_base64 = `data:image/png;base64,${fs.readFileSync(diffPath).toString('base64')}`;
        }
      } catch (error) {
        console.error('Error loading diff image:', error);
      }
    }

    // Create a prompt for OpenAI
    const promptText = `您是一位专注于视觉回归分析的UI测试专家。

                            请分析以下两组UI截图的对比数据并生成一份综合性报告：

                            基准图: ${promptData.base_name} ${promptData.base_url ? `(URL: ${promptData.base_url})` : ''}
                            对比图: ${promptData.compare_name} ${promptData.compare_url ? `(URL: ${promptData.compare_url})` : ''}

                            对比数据:
                                - 差异像素: ${promptData.diff_pixels}
                                - 差异比例: ${promptData.diff_percentage.toFixed(2)}%
                                - 图像尺寸: ${promptData.dimensions?.width || 0}x${promptData.dimensions?.height || 0}
                                - 阈值: ${promptData.threshold}

                            差异区域（${promptData.diff_areas?.length || 0}个聚类）:
                            ${(promptData.diff_areas || []).map((area: DiffArea, i: number) =>
      `区域 ${i + 1}: x=${area.x}, y=${area.y}, 宽度=${area.width}, 高度=${area.height}, 像素=${area.points}`
    ).join('\n')}

                            请分析数据并提供以下内容：
                            1. 简洁的UI差异总结
                            2. 问题分类（UI错位、内容变更、样式差异等）
                            3. 每个问题的优先级评估（严重/重要/轻微）
                            4. 修复建议或调整方案

                            请以JSON格式生成报告，结构如下：
                            {
                                "summary": "总体分析摘要（一段式）",
                                "issues": [{
                                    "title": "问题简述",
                                    "description": "问题详细描述",
                                    "type": "问题类型",
                                    "priority": "严重/重要/轻微",
                                    "recommendation": "修复建议"
                                }]
                            }`

    // Check if OpenAI API key is available
    if (!process.env.VLM_OPENAI_API_KEY) {
      // Generate a mock report if API key is not available
      console.log('OpenAI API key not available, generating mock report');

      const mockReport = {
        summary: "这是一个自动生成的模拟报告。在两个UI界面之间发现了若干差异，主要集中在布局和样式方面。",
        issues: [
          {
            title: "布局偏移",
            description: `在坐标区域附近(x=${promptData.diff_areas?.[0]?.x || 0}, y=${promptData.diff_areas?.[0]?.y || 0})发现元素位置偏移，影响了整体界面的一致性。`,
            type: "UI错位",
            priority: "重要",
            recommendation: "检查CSS样式中的margin和padding设置，确保两个版本使用相同的布局规则。"
          },
          {
            title: "颜色差异",
            description: "发现部分元素的颜色有所变化，可能是由于主题颜色更新或样式表变更导致。",
            type: "样式差异",
            priority: "轻微",
            recommendation: "确认设计规范中的颜色定义，统一应用于所有界面元素。"
          }
        ],
        metadata: {
          diffId,
          comparisonData: promptData,
          generatedAt: new Date().toISOString(),
          note: "This is a mock report generated without OpenAI API access"
        }
      };

      // Save the mock report
      saveReport(diffId, mockReport);

      return NextResponse.json({ success: true, report: mockReport });
    }

    // Call OpenAI for analysis
    const response = await openai.chat.completions.create({
      model: process.env.VLM_OPENAI_MODEL || "gpt-4",
      messages: [
        { role: "system", content: "You are a UI testing expert specializing in visual regression analysis." },
        { role: "user", content: promptText }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    console.error('%c response ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', response);
    // Parse the AI response
    const aiResponse = response.choices[0].message.content;

    console.error('%c aiResponse ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', aiResponse);

    if (!aiResponse) {
      throw new Error('Empty response from OpenAI');
    }

    const report = JSON.parse(aiResponse);

    // Add metadata to the report
    const finalReport = {
      ...report,
      metadata: {
        diffId,
        comparisonData: promptData,
        generatedAt: new Date().toISOString()
      }
    };

    // Save the report to memory only - no files
    saveReport(diffId, finalReport);

    return NextResponse.json({ success: true, report: finalReport });
  } catch (err: any) {
    console.error('Error generating report:', err);
    return NextResponse.json(
      { success: false, error: `Failed to generate report: ${err.message}` },
      { status: 500 }
    );
  }
}
