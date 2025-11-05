import express from 'express';
import multer from 'multer';
import {
  compressAndRename,
  downloadImage,
  downloadBatch,
} from '../controllers/imageCompressorController.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (validTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are supported'));
    }
  },
});

/**
 * POST /api/image-compressor/compress
 * Compress and rename multiple images
 * Request body: multipart/form-data
 * - files: image files
 * - secondaryKeywords: secondary keywords (newline or comma separated)
 */
router.post('/compress', upload.array('files', 20), compressAndRename);

/**
 * POST /api/image-compressor/download
 * Download single compressed image
 * Request body (JSON):
 * {
 *   imageBuffer: base64 string,
 *   fileName: string
 * }
 */
router.post('/download', downloadImage);

/**
 * POST /api/image-compressor/download-batch
 * Download multiple images as ZIP
 * Request body (JSON):
 * {
 *   images: [
 *     { compressedBuffer: base64, optimizedName: string },
 *     ...
 *   ]
 * }
 */
router.post('/download-batch', downloadBatch);

export default router;
