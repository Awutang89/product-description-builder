import sharp from 'sharp';
import OpenAI from 'openai';

/**
 * Image Compressor Service
 * Handles image compression and AI-powered description generation
 */

let openai;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

/**
 * Compress image with lossless/near-lossless quality
 * @param {Buffer} imageBuffer - Raw image data
 * @param {string} format - Image format (jpeg, png)
 * @returns {Promise<Buffer>} Compressed image buffer
 */
export const compressImage = async (imageBuffer, format) => {
  try {
    let pipeline = sharp(imageBuffer);

    if (format === 'jpeg' || format === 'jpg') {
      // Use mozJPEG for best quality JPEG compression
      pipeline = pipeline.jpeg({
        quality: 95,
        mozjpeg: true,
        progressive: true,
      });
    } else if (format === 'png') {
      // PNG compression with maximum compression
      pipeline = pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      });
    }

    const compressed = await pipeline.toBuffer();
    return compressed;
  } catch (error) {
    console.error('Image Compression Error:', error);
    throw {
      code: 'COMPRESSION_ERROR',
      message: `Failed to compress image: ${error.message}`,
    };
  }
};

/**
 * Generate AI description of image using vision capabilities
 * @param {Buffer} imageBuffer - Image buffer to analyze
 * @returns {Promise<string>} AI-generated description
 */
export const generateImageDescription = async (imageBuffer) => {
  try {
    // Validate that OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set, using fallback description');
      return 'product image';
    }

    // Convert image buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const mimeType = await getMimeType(imageBuffer);

    const response = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Provide a brief, detailed description of this image in 10-15 words. Focus on the main subject, colors, and key visual elements. Return only the description, no additional text.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const description = response.choices[0].message.content.trim();
    return description;
  } catch (error) {
    console.error('AI Description Error:', error.message);
    // Return a fallback description if AI fails
    return 'product image description';
  }
};

/**
 * Detect MIME type of image buffer
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<string>} MIME type
 */
async function getMimeType(buffer) {
  try {
    const metadata = await sharp(buffer).metadata();
    const format = metadata.format;

    if (format === 'jpeg') return 'image/jpeg';
    if (format === 'png') return 'image/png';
    return 'image/jpeg';
  } catch {
    return 'image/jpeg';
  }
}

/**
 * Generate optimized filename from secondary keyword and AI description
 * Uses natural language formatting with hyphens
 * @param {string} secondaryKeyword - User-provided keyword
 * @param {string} aiDescription - AI-generated description
 * @param {string} originalExt - Original file extension
 * @returns {string} Optimized filename
 */
export const generateOptimizedFilename = (secondaryKeyword, aiDescription, originalExt) => {
  try {
    // Clean up the secondary keyword
    const cleanKeyword = secondaryKeyword
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove duplicate hyphens

    // Clean up the AI description - convert to lowercase, remove special chars, join with hyphens
    const cleanDescription = aiDescription
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove duplicate hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Combine keyword and description naturally
    let filename;
    if (cleanKeyword && cleanDescription) {
      filename = `${cleanKeyword}-${cleanDescription}`;
    } else if (cleanKeyword) {
      filename = cleanKeyword;
    } else {
      filename = cleanDescription;
    }

    // Limit filename length to 200 characters (including extension)
    const maxLength = 200 - originalExt.length - 1; // -1 for the dot
    if (filename.length > maxLength) {
      filename = filename.substring(0, maxLength);
      // Remove trailing hyphens if filename was truncated
      filename = filename.replace(/-+$/, '');
    }

    return `${filename}.${originalExt}`;
  } catch (error) {
    console.error('Filename Generation Error:', error);
    // Fallback to timestamp if generation fails
    return `image-${Date.now()}.${originalExt}`;
  }
};

/**
 * Process a single image - compress and generate description
 * @param {Object} file - Multer file object
 * @param {string} secondaryKeyword - User-provided keyword
 * @returns {Promise<Object>} Processed image data
 */
export const processImage = async (file, secondaryKeyword) => {
  try {
    // Determine image format from mimetype
    let format = file.mimetype.split('/')[1].toLowerCase();

    // Normalize format
    if (format === 'jpg') {
      format = 'jpeg';
    }

    // Validate format
    if (!['jpeg', 'png'].includes(format)) {
      throw new Error('Only JPEG and PNG formats are supported');
    }

    // Compress the image
    const compressedBuffer = await compressImage(file.buffer, format);

    // Generate AI description
    const description = await generateImageDescription(file.buffer);

    // Generate optimized filename with correct extension
    const fileExtension = format === 'jpeg' ? 'jpg' : 'png';
    const optimizedFilename = generateOptimizedFilename(
      secondaryKeyword,
      description,
      fileExtension
    );

    return {
      success: true,
      originalName: file.originalname,
      optimizedName: optimizedFilename,
      compressedBuffer,
      aiDescription: description,
      secondaryKeyword,
      originalSize: file.size,
      compressedSize: compressedBuffer.length,
      compressionRatio: (
        ((file.size - compressedBuffer.length) / file.size) *
        100
      ).toFixed(2),
    };
  } catch (error) {
    console.error('Image Processing Error:', error);
    throw {
      code: 'PROCESSING_ERROR',
      message: error.message || 'Failed to process image',
      originalName: file.originalname,
    };
  }
};

/**
 * Process multiple images
 * @param {Array} files - Array of multer file objects
 * @param {Array|string} secondaryKeywords - Keywords (one per image or single keyword for all)
 * @returns {Promise<Array>} Array of processed images
 */
export const processImageBatch = async (files, secondaryKeywords) => {
  try {
    const keywords = Array.isArray(secondaryKeywords)
      ? secondaryKeywords
      : secondaryKeywords
          .split('\n')
          .map((k) => k.trim())
          .filter((k) => k);

    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const keyword = keywords[i] || keywords[0] || 'image'; // Use repeated keyword if not enough provided
        const processed = await processImage(files[i], keyword);
        results.push(processed);
      } catch (error) {
        errors.push({
          file: files[i].originalname,
          error: error.message || 'Unknown error',
        });
      }
    }

    return {
      success: errors.length === 0,
      processedImages: results,
      errors: errors.length > 0 ? errors : null,
      totalProcessed: results.length,
      totalFailed: errors.length,
    };
  } catch (error) {
    console.error('Batch Processing Error:', error);
    throw {
      code: 'BATCH_ERROR',
      message: 'Failed to process image batch',
    };
  }
};

export default {
  compressImage,
  generateImageDescription,
  generateOptimizedFilename,
  processImage,
  processImageBatch,
};
