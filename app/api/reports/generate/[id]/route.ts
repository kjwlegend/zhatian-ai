import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import OpenAI from 'openai';

// Set up directory paths
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || 'public/data/screenshots';
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
  baseId: string;
  compareId: string;
  diffPixels: number;
  diffPercentage: number;
  threshold: number;
  ignoreAA: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  baseName: string;
  compareName: string;
  diffImage: string;
  baseImage: string;
  compareImage: string;
  timestamp: string;
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
      .pipe(new PNG())
      .on('parsed', function (this: PNG) {
        resolve(this);
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });
};

// Helper function to analyze diff clusters (find groups of difference pixels)
const analyzeDiffClusters = async (diffImagePath: string): Promise<DiffCluster[]> => {
  try {
    const diffImage = await readDiffImage(diffImagePath);
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
const getComparisonData = async (diffId: string): Promise<{
  baseMetadata: BaseMetadata;
  compareMetadata: BaseMetadata;
  [key: string]: any;
}> => {
  // Get diff metadata
  const metadataPath = path.join(DIFF_DIR, `${diffId}.json`);

  if (!fs.existsSync(metadataPath)) {
    throw new Error('Comparison metadata not found');
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as ComparisonData;

  // Analyze diff clusters
  const diffImagePath = path.join(DIFF_DIR, metadata.diffImage);
  console.log('Analyzing diff clusters for:', diffImagePath);

  const diffClusters = await analyzeDiffClusters(diffImagePath);

  // Add diff areas to metadata
  metadata.diffAreas = diffClusters;

  // Get base and compare image metadata
  let baseMetadata: BaseMetadata = {}, compareMetadata: BaseMetadata = {};

  const baseMetadataPath = path.join(SCREENSHOT_DIR, `${metadata.baseId}.json`);
  const compareMetadataPath = path.join(SCREENSHOT_DIR, `${metadata.compareId}.json`);

  if (fs.existsSync(baseMetadataPath)) {
    baseMetadata = JSON.parse(fs.readFileSync(baseMetadataPath, 'utf8'));
  }

  if (fs.existsSync(compareMetadataPath)) {
    compareMetadata = JSON.parse(fs.readFileSync(compareMetadataPath, 'utf8'));
  }

  return {
    ...metadata,
    baseMetadata,
    compareMetadata,
    diffImagePath
  };
};

// Helper to save an AI report
const saveReport = (diffId: string, report: any): void => {
  const reportPath = path.join(DIFF_DIR, `${diffId}_report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
};

// Generate an AI report for a comparison
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const diffId = params.id;
    console.log('Generating report for diff ID:', diffId);

    const comparisonData = await getComparisonData(diffId);

    // Prepare data for OpenAI
    const promptData = {
      diff_pixels: comparisonData.diffPixels,
      diff_percentage: comparisonData.diffPercentage,
      diff_areas: comparisonData.diffAreas,
      base_name: comparisonData.baseName,
      compare_name: comparisonData.compareName,
      dimensions: comparisonData.dimensions,
      threshold: comparisonData.threshold,
      base_url: comparisonData.baseMetadata?.url,
      compare_url: comparisonData.compareMetadata?.url,
      diff_image_url: comparisonData.diffImagePath,

      diff_image_base64: fs.existsSync(comparisonData.diffImagePath)
        ? `data:image/png;base64,${fs.readFileSync(comparisonData.diffImagePath).toString('base64')}`
        : null,
      // base_image_base64: fs.existsSync(path.join(SCREENSHOT_DIR, comparisonData.baseImage))
      //   ? `data:image/png;base64,${fs.readFileSync(path.join(SCREENSHOT_DIR, comparisonData.baseImage)).toString('base64')}`
      //   : null,
      // compare_image_base64: fs.existsSync(path.join(SCREENSHOT_DIR, comparisonData.compareImage))
      //   ? `data:image/png;base64,${fs.readFileSync(path.join(SCREENSHOT_DIR, comparisonData.compareImage)).toString('base64')}`
      //   : null
    };
    // Create a prompt for OpenAI
    // 基准图：${ promptData.base_name } ${ promptData.base_url || '' }
    // 对比图：${ promptData.compare_name } ${ promptData.compare_url || '' }
    // 差异图：${ promptData.diff_image_base64 } 红色部分为差异位置

    //     const promptText = `您是一位精通CSS视觉规范的UI测试专家，请基于像素级差异分析，为前端团队提供结构化修改方案。以下是分析要求：

    // 【输入数据】
    // 差异参数：
    // - 差异像素：${promptData.diff_pixels}
    // - 差异率：${promptData.diff_percentage.toFixed(2)}%
    // - 分辨率：${promptData.dimensions.width}x${promptData.dimensions.height}
    // - 差异区域：${promptData.diff_areas.length}个聚类

    // 【分析维度】
    // 1. 布局问题：
    //    - 位置偏移：x/y轴方向偏差（使用px单位）
    //    - 尺寸差异：width/height变化超过±1px
    //    - 间距异常：margin/padding不一致

    // 2. 样式问题：
    //    - 字体属性：font-family/font-size/font-weight
    //    - 颜色体系：color/background-color/border-color
    //    - 盒模型：border-radius/box-shadow/outline
    //    - 定位方式：position偏移（absolute/fixed定位需特别标注）

    // 3. 内容问题：
    //    - 文本截断：width不足导致的...省略
    //    - 图像变形：aspect-ratio改变
    //    - 图标错位：svg与文本基线对齐问题

    // 【输出规范】
    // {
    //   "summary": "总体差异摘要（包含关键指标分析）",
    //   "style_analysis": {
    //     "layout_changes": [
    //       {
    //         "property": "margin-left | width | ...",
    //         "base_value": "基准值（带单位）",
    //         "current_value": "当前值（带单位）",
    //         "deviation": "±数值",
    //         "priority": "critical/important/minor"
    //       }
    //     ],
    //     "visual_changes": [
    //       {
    //         "selector": "建议的CSS选择器",
    //         "properties": {
    //           "font-size": {"base": "14px", "current": "13.5px"},
    //           "border-radius": {"base": "4px", "current": "6px"}
    //         },
    //         "recommendation": ["font-size: calc(13.5px + 0.3pt)","border-radius: 保持设计系统一致性"]
    //       }
    //     ]
    //   },
    //   "critical_issues": [
    //     {
    //       "type": "文本溢出 | 点击区域不足 | 颜色对比度不足",
    //       "coordinates": {x: [], y: []},
    //       "before_after": ["基准图描述", "当前图描述"],
    //       "accessibility_impact": "WCAG标准影响分析"
    //     }
    //   ]
    // }`;
    const promptText = `您是一位专注于视觉回归分析的UI测试专家。

                            请分析以下两组UI截图的对比数据并生成一份综合性报告：

                            基准图: ${promptData.base_name} ${promptData.base_url ? `(URL: ${promptData.base_url})` : ''}
                            对比图: ${promptData.compare_name} ${promptData.compare_url ? `(URL: ${promptData.compare_url})` : ''}

                            对比数据:
                                - 差异像素: ${promptData.diff_pixels}
                                - 差异比例: ${promptData.diff_percentage.toFixed(2)}%
                                - 图像尺寸: ${promptData.dimensions.width}x${promptData.dimensions.height}
                                - 阈值: ${promptData.threshold}

                            差异区域（${promptData.diff_areas.length}个聚类）:
                            ${promptData.diff_areas.map((area, i) =>
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
            description: `在坐标区域附近(x=${promptData.diff_areas[0]?.x || 0}, y=${promptData.diff_areas[0]?.y || 0})发现元素位置偏移，影响了整体界面的一致性。`,
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

    // Save the report
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
