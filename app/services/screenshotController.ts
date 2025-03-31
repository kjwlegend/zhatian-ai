const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
        cb(null, screenshotDir);
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname) || '.png';
        cb(null, `${uniqueId}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max size
    }
});

// Helper to get screenshots data
const getScreenshots = () => {
    const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';

    // Ensure the directory exists
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
        return [];
    }

    try {
        // Read the directory and get PNG files
        const files = fs.readdirSync(screenshotDir)
            .filter(file => file.endsWith('.png'));

        // Get metadata for each file
        return files.map(filename => {
            const filePath = path.join(screenshotDir, filename);
            const stats = fs.statSync(filePath);

            // Try to get metadata from a JSON file with the same name if it exists
            let metadata = {};
            const metadataPath = path.join(screenshotDir, `${filename.replace('.png', '')}.json`);

            if (fs.existsSync(metadataPath)) {
                try {
                    metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
                } catch (err) {
                    console.error(`Error reading metadata for ${filename}:`, err);
                }
            }

            return {
                id: filename.replace('.png', ''),
                filename: filename,
                name: metadata.name || filename,
                date: metadata.date || stats.mtime,
                size: stats.size,
                width: metadata.width,
                height: metadata.height,
                deviceType: metadata.deviceType || 'desktop'
            };
        });
    } catch (err) {
        console.error('Error reading screenshots directory:', err);
        return [];
    }
};

// Save metadata for a screenshot
const saveMetadata = (filename, metadata) => {
    const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
    const metadataPath = path.join(screenshotDir, `${filename.replace('.png', '')}.json`);

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
};

// GET all screenshots
router.get('/', (req, res) => {
    try {
        const screenshots = getScreenshots();
        res.json({ success: true, screenshots });
    } catch (err) {
        console.error('Error getting screenshots:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve screenshots' });
    }
});

// GET a single screenshot by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
    // const filePath = path.join(screenshotDir, `${id}`);
    const filePath = path.join(__dirname, '../../', screenshotDir, `${id}`);

    // Check if it's already a full filename
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    // Try with .png extension
    // const pngPath = path.join(screenshotDir, `${id}.png`);
    const pngPath = path.join(__dirname, '../../', screenshotDir, `${id}.png`);
    if (fs.existsSync(pngPath)) {
        return res.sendFile(pngPath);
    }

    res.status(404).json({ success: false, error: 'Screenshot not found' });
});

// POST - Capture a new screenshot
router.post('/capture', async (req, res) => {
    const { url, name, deviceType = 'desktop' } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new' // Use the new headless mode
        });

        const page = await browser.newPage();

        // Set viewport based on device type
        switch (deviceType) {
            case 'mobile':
                await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
                break;
            case 'tablet':
                await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
                break;
            default: // desktop
                await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
        }

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Remove dynamic elements that could cause false positives in comparisons
        await page.evaluate(() => {
            // Remove timestamps, ads, etc.
            document.querySelectorAll('.timestamp, .ad, .advertisement').forEach(el => el.remove());
        });

        // Generate a unique filename
        const filename = `${uuidv4()}.png`;
        const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';
        const filePath = path.join(screenshotDir, filename);

        // Take the screenshot
        await page.screenshot({ path: filePath, fullPage: true });

        // Save metadata
        const viewport = page.viewport();
        const metadata = {
            name: name || `Screenshot of ${url}`,
            url,
            date: new Date().toISOString(),
            deviceType,
            width: viewport.width,
            height: viewport.height
        };

        saveMetadata(filename, metadata);

        await browser.close();

        res.json({
            success: true,
            message: 'Screenshot captured successfully',
            id: filename.replace('.png', ''),
            filename
        });
    } catch (err) {
        console.error('Error capturing screenshot:', err);
        res.status(500).json({ success: false, error: 'Failed to capture screenshot' });
    }
});

// POST - Upload a screenshot
router.post('/upload', upload.single('screenshot'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    try {
        const name = req.body.name || req.file.originalname;

        // Save metadata
        const metadata = {
            name,
            date: new Date().toISOString(),
            deviceType: 'unknown',
            uploadedFile: true
        };

        saveMetadata(req.file.filename, metadata);

        res.json({
            success: true,
            message: 'Screenshot uploaded successfully',
            id: req.file.filename.replace('.png', ''),
            filename: req.file.filename
        });
    } catch (err) {
        console.error('Error processing uploaded screenshot:', err);
        res.status(500).json({ success: false, error: 'Failed to process uploaded screenshot' });
    }
});

// DELETE a screenshot
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const screenshotDir = process.env.SCREENSHOT_DIR || 'src/data/screenshots';

    // Try both with and without .png extension
    const filePath = path.join(screenshotDir, `${id}`);
    const pngPath = path.join(screenshotDir, `${id}.png`);
    const jsonPath = path.join(screenshotDir, `${id}.json`);

    try {
        let deleted = false;

        // Delete the image file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deleted = true;
        }

        if (fs.existsSync(pngPath)) {
            fs.unlinkSync(pngPath);
            deleted = true;
        }

        // Delete metadata if it exists
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
        }

        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Screenshot not found' });
        }

        res.json({ success: true, message: 'Screenshot deleted successfully' });
    } catch (err) {
        console.error('Error deleting screenshot:', err);
        res.status(500).json({ success: false, error: 'Failed to delete screenshot' });
    }
});

module.exports = router;
