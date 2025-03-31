const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { v4: uuidv4 } = require('uuid');

// Helper function to read an image as PNG
const readImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath)
            .pipe(new PNG())
            .on('parsed', function () {
                resolve(this);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

// Helper function to save a comparison result
const saveComparisonResult = (diffResult, metadata) => {
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';
    const metadataPath = path.join(diffDir, `${diffResult.diffImage.replace('.png', '')}.json`);

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
};

// GET all comparison results
router.get('/', (req, res) => {
    try {
        const diffDir = process.env.DIFF_DIR || 'src/data/diffs';

        // Ensure the directory exists
        if (!fs.existsSync(diffDir)) {
            fs.mkdirSync(diffDir, { recursive: true });
            return res.json({ success: true, comparisons: [] });
        }

        // Get all JSON files (metadata)
        const files = fs.readdirSync(diffDir)
            .filter(file => file.endsWith('.json'));

        // Read metadata for each comparison
        const comparisons = files.map(filename => {
            try {
                const metadataPath = path.join(diffDir, filename);
                const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                return {
                    id: filename.replace('.json', ''),
                    ...metadata
                };
            } catch (err) {
                console.error(`Error reading metadata for ${filename}:`, err);
                return null;
            }
        }).filter(Boolean);

        res.json({ success: true, comparisons });
    } catch (err) {
        console.error('Error getting comparison results:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve comparison results' });
    }
});

// GET a specific diff image
router.get('/diff/:id', (req, res) => {
    const id = req.params.id;
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';
    // const filePath = path.join(diffDir, `${id}`);
    const filePath = path.resolve(__dirname, '../../', diffDir, `${id}`);

    // Check if it's already a full filename
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    // Try with .png extension
    // const pngPath = path.join(diffDir, `${id}.png`);
    const pngPath = path.resolve(__dirname, '../../', diffDir, `${id}.png`);
    if (fs.existsSync(pngPath)) {
        return res.sendFile(pngPath);
    }

    res.status(404).json({ success: false, error: 'Diff image not found' });
});

// POST - Compare two screenshots
router.post('/', async (req, res) => {
    const { baseId, compareId, threshold = 0.1, ignoreAA = false } = req.body;

    if (!baseId || !compareId) {
        return res.status(400).json({
            success: false,
            error: 'Base and compare image IDs are required'
        });
    }

    try {
        const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
        const diffDir = process.env.DIFF_DIR || 'src/data/diffs';

        // Ensure diff directory exists
        if (!fs.existsSync(diffDir)) {
            fs.mkdirSync(diffDir, { recursive: true });
        }

        // Get file paths
        const basePath = path.join(screenshotDir, `${baseId}.png`);
        const comparePath = path.join(screenshotDir, `${compareId}.png`);

        // Check if files exist
        if (!fs.existsSync(basePath)) {
            return res.status(404).json({ success: false, error: 'Base image not found' });
        }

        if (!fs.existsSync(comparePath)) {
            return res.status(404).json({ success: false, error: 'Compare image not found' });
        }

        // Read both images
        const img1 = await readImage(basePath);
        const img2 = await readImage(comparePath);

        // Ensure dimensions match
        let width, height;

        if (img1.width !== img2.width || img1.height !== img2.height) {
            // Resize the larger image to match the smaller one
            width = Math.min(img1.width, img2.width);
            height = Math.min(img1.height, img2.height);
            console.log(`Dimensions don't match. Resizing to ${width}x${height}`);
        } else {
            width = img1.width;
            height = img1.height;
        }

        // Create output image (diff)
        const diff = new PNG({ width, height });

        // Run pixelmatch
        const numDiffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
                threshold: parseFloat(threshold),
                includeAA: !ignoreAA,
                alpha: 0.1,
                diffColor: [255, 0, 0],    // Red for differences
                diffMask: false
            }
        );

        // Generate a unique filename for the diff
        const diffFilename = `${uuidv4()}.png`;
        const diffPath = path.join(diffDir, diffFilename);

        // Save the diff image
        diff.pack().pipe(fs.createWriteStream(diffPath));

        // Calculate diff percentage
        const totalPixels = width * height;
        const diffPercentage = (numDiffPixels / totalPixels) * 100;

        // Get metadata for base and compare images
        let baseMetadata = {}, compareMetadata = {};

        const baseMetadataPath = path.join(screenshotDir, `${baseId}.json`);
        const compareMetadataPath = path.join(screenshotDir, `${compareId}.json`);

        if (fs.existsSync(baseMetadataPath)) {
            baseMetadata = JSON.parse(fs.readFileSync(baseMetadataPath, 'utf8'));
        }

        if (fs.existsSync(compareMetadataPath)) {
            compareMetadata = JSON.parse(fs.readFileSync(compareMetadataPath, 'utf8'));
        }

        // Create metadata for the comparison
        const comparisonMetadata = {
            baseId,
            compareId,
            baseName: baseMetadata.name || baseId,
            compareName: compareMetadata.name || compareId,
            diffPixels: numDiffPixels,
            diffPercentage,
            threshold,
            ignoreAA,
            timestamp: new Date().toISOString(),
            diffImage: diffFilename,
            baseImage: `${baseId}.png`,
            compareImage: `${compareId}.png`,
            dimensions: { width, height },
            diffAreas: [] // This could be populated by analyzing diff clusters
        };

        // const resultId = diffFilename.replace('.png', '');

        // Save comparison metadata
        saveComparisonResult(
            { diffImage: diffFilename },
            comparisonMetadata,
        );

        // Return the comparison result
        res.json({
            success: true,
            baseImage: `${baseId}.png`,
            compareImage: `${compareId}.png`,
            diffImage: diffFilename,
            diffPixels: numDiffPixels,
            diffPercentage,
            id: diffFilename.replace('.png', '')
        });

    } catch (err) {
        console.error('Error comparing images:', err);
        res.status(500).json({ success: false, error: 'Failed to compare images' });
    }
});

// DELETE a comparison result
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const diffDir = process.env.DIFF_DIR || 'src/data/diffs';

    // Try both with and without .png extension
    const pngPath = path.join(diffDir, `${id}.png`);
    const jsonPath = path.join(diffDir, `${id}.json`);

    try {
        let deleted = false;

        // Delete the image file
        if (fs.existsSync(pngPath)) {
            fs.unlinkSync(pngPath);
            deleted = true;
        }

        // Delete metadata if it exists
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
            deleted = true;
        }

        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Comparison result not found' });
        }

        res.json({ success: true, message: 'Comparison result deleted successfully' });
    } catch (err) {
        console.error('Error deleting comparison result:', err);
        res.status(500).json({ success: false, error: 'Failed to delete comparison result' });
    }
});

module.exports = router;
