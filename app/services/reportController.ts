const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { OpenAI } = require('openai');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.BASE_URL + "/v1",
});

// Helper function to read a diff image as PNG
const readDiffImage = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(new PNG())
            .on('parsed', function () {
                resolve(this);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

// Helper function to analyze diff clusters (find groups of difference pixels)
const analyzeDiffClusters = async (diffImagePath) => {
    try {
        const diffImage = await readDiffImage(diffImagePath);
        console.error('%c diffImage ', 'background-image:color:transparent;color:red;');
        console.error('🚀~ => ', diffImage);
        const { width, height, data } = diffImage;

        // Find red pixels (diff pixels are red in our implementation)
        let diffPoints = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) << 2;

                // Check if pixel is red (R>200, G<50, B<50)
                if (data[idx] > 200 && data[idx + 1] < 50 && data[idx + 2] < 50) {
                    diffPoints.push({ x, y });
                }
            }
        }
        console.error('%c diffPoints ', 'background-image:color:transparent;color:red;');
        console.error('🚀~ => ', diffPoints);
        // If no diff points, return empty array
        if (diffPoints.length === 0) {
            return [];
        }

        // Simple cluster algorithm - group points that are close together
        const clusters = [];
        const visited = new Set();

        // Helper to find neighbors within a certain distance
        const findNeighbors = (point, allPoints, maxDistance = 20) => {
            const key = `${point.x},${point.y}`;
            if (visited.has(key)) return [];

            visited.add(key);

            return allPoints.filter(p => {
                const pKey = `${p.x},${p.y}`;
                if (!visited.has(pKey)) {
                    const dx = Math.abs(p.x - point.x);
                    const dy = Math.abs(p.y - point.y);
                    return dx <= maxDistance && dy <= maxDistance;
                }
                return false;
            });
        };

        // Recursive function to build clusters
        const buildCluster = (startPoint, allPoints, cluster = []) => {
            cluster.push(startPoint);

            const neighbors = findNeighbors(startPoint, allPoints);

            for (const neighbor of neighbors) {
                buildCluster(neighbor, allPoints, cluster);
            }

            return cluster;
        };

        // Find all clusters
        for (const point of diffPoints) {
            const key = `${point.x},${point.y}`;
            if (!visited.has(key)) {
                const cluster = buildCluster(point, diffPoints);
                if (cluster.length > 10) { // Ignore very small clusters (likely noise)
                    clusters.push(cluster);
                }
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
const getComparisonData = async (diffId) => {
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';
    const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
    // Get diff metadata
    const newDiffId = diffId.replace('.png', '')
    const metadataPath = path.join(diffDir, `${newDiffId}.json`);
    if (!fs.existsSync(metadataPath)) {
        throw new Error('Comparison metadata not found');
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    // Analyze diff clusters
    const diffImagePath = path.join(diffDir, metadata.diffImage);
    console.error('%c diffImagePath ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', diffImagePath);
    const diffClusters = await analyzeDiffClusters(diffImagePath);

    // Add diff areas to metadata
    metadata.diffAreas = diffClusters;

    // Get base and compare image metadata
    let baseMetadata = {}, compareMetadata = {};

    const baseMetadataPath = path.join(screenshotDir, `${metadata.baseId}.json`);
    const compareMetadataPath = path.join(screenshotDir, `${metadata.compareId}.json`);

    if (fs.existsSync(baseMetadataPath)) {
        baseMetadata = JSON.parse(fs.readFileSync(baseMetadataPath, 'utf8'));
    }

    if (fs.existsSync(compareMetadataPath)) {
        compareMetadata = JSON.parse(fs.readFileSync(compareMetadataPath, 'utf8'));
    }

    return {
        ...metadata,
        baseMetadata,
        compareMetadata
    };
};

// Helper to save an AI report
const saveReport = (diffId, report) => {
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';
    const reportPath = path.join(diffDir, `${diffId}_report.json`);

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
};

// GET all reports
router.get('/', (req, res) => {
    try {
        const diffDir = process.env.DIFF_DIR || 'src/data/diffs';

        // Ensure the directory exists
        if (!fs.existsSync(diffDir)) {
            fs.mkdirSync(diffDir, { recursive: true });
            return res.json({ success: true, reports: [] });
        }

        // Get all report files
        const files = fs.readdirSync(diffDir)
            .filter(file => file.includes('_report.json'));

        // Read each report
        const reports = files.map(filename => {
            try {
                const reportPath = path.join(diffDir, filename);
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

        res.json({ success: true, reports });
    } catch (err) {
        console.error('Error getting reports:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve reports' });
    }
});

// GET a specific report
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';
    const reportPath = path.join(diffDir, `${id}_report.json`);

    try {
        if (!fs.existsSync(reportPath)) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }

        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        res.json({ success: true, report });
    } catch (err) {
        console.error('Error getting report:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve report' });
    }
});

// Generate an AI report for a comparison
router.get('/generate/:id', async (req, res) => {
    const diffId = req.params.id;
    console.error('%c server diffId ', 'background-image:color:transparent;color:red;');
    console.error('🚀~ => ', diffId);
    try {
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
            compare_url: comparisonData.compareMetadata?.url
        };

        // Create a prompt for OpenAI
        // const promptText = `
        //     You are a UI testing expert specializing in visual regression analysis.

        //     Analyze the following comparison data between two UI screenshots and generate a comprehensive report:

        //     Base Image: ${promptData.base_name} ${promptData.base_url ? `(URL: ${promptData.base_url})` : ''}
        //     Compare Image: ${promptData.compare_name} ${promptData.compare_url ? `(URL: ${promptData.compare_url})` : ''}

        //     Comparison Data:
        //     - Diff Pixels: ${promptData.diff_pixels}
        //     - Diff Percentage: ${promptData.diff_percentage.toFixed(2)}%
        //     - Image Dimensions: ${promptData.dimensions.width}x${promptData.dimensions.height}
        //     - Threshold: ${promptData.threshold}

        //     Diff Areas (${promptData.diff_areas.length} clusters):
        //     ${promptData.diff_areas.map((area, i) =>
        //         `Area ${i+1}: x=${area.x}, y=${area.y}, width=${area.width}, height=${area.height}, pixels=${area.points}`
        //     ).join('\n')}

        //     Please analyze this data and provide the following:
        //     1. A concise summary of the UI differences
        //     2. Classification of the issues (UI misalignment, content changes, style differences, etc.)
        //     3. Priority assessment (Critical, Major, Minor) for each identified issue
        //     4. Recommended fixes or adjustments

        //     Format your response as JSON with the following structure:
        //     {
        //         "summary": "Overall analysis summary in one paragraph",
        //         "issues": [
        //             {
        //                 "title": "Brief issue title",
        //                 "description": "Detailed description of the issue",
        //                 "type": "Issue classification",
        //                 "priority": "Critical/Major/Minor",
        //                 "recommendation": "Suggested fix"
        //             }
        //         ]
        //     }
        // `;
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

        // Call OpenAI for analysis
        const response = await openai.chat.completions.create({
            model: "deepseek-ai/DeepSeek-V2.5",
            messages: [
                { role: "system", content: "You are a UI testing expert specializing in visual regression analysis." },
                { role: "user", content: promptText }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        // Parse the AI response
        const aiResponse = response.choices[0].message.content;
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

        res.json({ success: true, report: finalReport });
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).json({ success: false, error: 'Failed to generate report' });
    }
});

module.exports = router;
