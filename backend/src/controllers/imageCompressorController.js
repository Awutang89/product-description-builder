import {
  processImage,
  processImageBatch,
} from '../services/imageCompressorService.js';
import archiver from 'archiver';

/**
 * Image Compressor Controller
 * Handles image compression and renaming requests
 */

/**
 * Compress and rename images
 * POST /api/image-compressor/compress
 */
export const compressAndRename = async (req, res) => {
  try {
    const { secondaryKeywords } = req.body;
    const files = req.files;

    // Validate files
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images provided',
      });
    }

    // Validate secondary keywords
    if (!secondaryKeywords || secondaryKeywords.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one secondary keyword',
      });
    }

    // Validate file types (multer already validates, but double check)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.filter((f) => !validTypes.includes(f.mimetype.toLowerCase()));

    if (invalidFiles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Only JPEG and PNG images are supported',
        invalidFiles: invalidFiles.map((f) => f.originalname),
      });
    }

    // Check file sizes (10MB max per file)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10MB limit',
        oversizedFiles: oversizedFiles.map((f) => f.originalname),
      });
    }

    // Process images
    const result = await processImageBatch(files, secondaryKeywords);

    // Return results
    res.status(200).json({
      success: result.success,
      totalProcessed: result.totalProcessed,
      totalFailed: result.totalFailed,
      images: result.processedImages.map((img) => ({
        originalName: img.originalName,
        optimizedName: img.optimizedName,
        aiDescription: img.aiDescription,
        secondaryKeyword: img.secondaryKeyword,
        originalSize: img.originalSize,
        compressedSize: img.compressedSize,
        compressionRatio: img.compressionRatio,
        compressedBuffer: img.compressedBuffer.toString('base64'),
      })),
      errors: result.errors,
    });
  } catch (error) {
    console.error('Compress And Rename Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process images',
    });
  }
};

/**
 * Download single compressed image
 * GET /api/image-compressor/download/:imageId
 * The imageId should correspond to the image buffer sent in the compress response
 */
export const downloadImage = async (req, res) => {
  try {
    const { imageBuffer, fileName } = req.body;

    if (!imageBuffer) {
      return res.status(400).json({
        success: false,
        error: 'No image data provided',
      });
    }

    const buffer = Buffer.from(imageBuffer, 'base64');

    // Determine content type based on filename
    const contentType = fileName && fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    res.setHeader('Content-Type', contentType);

    // Properly encode filename for download
    const encodedFileName = encodeURIComponent(fileName || 'image.jpg').replace(/'/g, '%27');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodedFileName}; filename="${fileName || 'image.jpg'}"`
    );
    res.send(buffer);
  } catch (error) {
    console.error('Download Image Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download image',
    });
  }
};

/**
 * Download multiple images as ZIP
 * POST /api/image-compressor/download-batch
 */
export const downloadBatch = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images provided for download',
      });
    }

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    // Set response headers for ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="compressed-images.zip"');

    // Handle archive errors
    archive.on('error', (error) => {
      console.error('Archive Error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Failed to create ZIP file',
        });
      }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add each image to the archive
    images.forEach((img) => {
      try {
        const buffer = Buffer.from(img.compressedBuffer, 'base64');
        archive.append(buffer, { name: img.optimizedName });
      } catch (error) {
        console.error(`Error adding image ${img.optimizedName}:`, error);
      }
    });

    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    console.error('Download Batch Error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to create ZIP file',
      });
    }
  }
};

export default {
  compressAndRename,
  downloadImage,
  downloadBatch,
};
