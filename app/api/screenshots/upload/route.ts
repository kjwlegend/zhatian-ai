import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promises as fsPromises } from 'fs';
import sharp from 'sharp';

// Directory to store screenshots
const SCREENSHOT_DIR = process.env.OSS_BASE_URL || 'public/data/screenshots';

// Ensure the directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Helper function to save metadata
const saveMetadata = async (
  id: string,
  metadata: Record<string, any>
): Promise<void> => {
  const metadataPath = path.join(SCREENSHOT_DIR, `${id}.json`);
  await fsPromises.writeFile(
    metadataPath,
    JSON.stringify(metadata, null, 2),
    'utf-8'
  );
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    console.error('%c file ', 'background-image:color:transparent;color:red;');
      console.error('🚀~ => ', file);
      console.error('🚀~ => ', formData);

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const fileName = `${id}.png`; // Always save as PNG for consistency
    const filePath = path.join(SCREENSHOT_DIR, fileName);

    // Get the buffer from the file
    const buffer = Buffer.from(await file.arrayBuffer());

    // Use sharp to convert the image to PNG and save it
    const imageInfo = await sharp(buffer)
      .png()
      .toFile(filePath);

    // Prepare metadata
    const metadata = {
      id,
      name: name || file.name,
      originalName: file.name,
      originalType: file.type,
      date: new Date().toISOString(),
      deviceType: 'upload',
      width: imageInfo.width,
      height: imageInfo.height,
      format: 'png', // Always PNG after conversion
      size: imageInfo.size,
    };

    // Save metadata
    await saveMetadata(id, metadata);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      fileName,
      id,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
