/**
 * Image Compressor Service
 * Frontend service for image compression and downloading
 */

// Get API base URL - use relative URL to work in both dev and production
const API_BASE = '/api/image-compressor';

/**
 * Compress and rename images
 * @param {File[]} files - Array of image files
 * @param {string} secondaryKeywords - Secondary keywords (newline or comma separated)
 * @returns {Promise<Object>} Processed images data
 */
export const compressAndRenameImages = async (files, secondaryKeywords) => {
  try {
    const formData = new FormData();

    // Add all files
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Add secondary keywords
    formData.append('secondaryKeywords', secondaryKeywords);

    const response = await fetch(`${API_BASE}/compress`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to compress images');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Image Compression Error:', error);
    throw {
      code: 'COMPRESSION_ERROR',
      message: error.message || 'Failed to compress images',
    };
  }
};

/**
 * Download single image
 * @param {Object} image - Image object with compressedBuffer and optimizedName
 */
export const downloadSingleImage = async (image) => {
  try {
    const response = await fetch(`${API_BASE}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBuffer: image.compressedBuffer,
        fileName: image.optimizedName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to download image');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = image.optimizedName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download Error:', error);
    throw {
      code: 'DOWNLOAD_ERROR',
      message: 'Failed to download image',
    };
  }
};

/**
 * Download multiple images as ZIP
 * @param {Array} images - Array of image objects
 */
export const downloadBatchAsZip = async (images) => {
  try {
    const response = await fetch(`${API_BASE}/download-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images }),
    });

    if (!response.ok) {
      throw new Error('Failed to download batch');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed-images.zip';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error('Batch Download Error:', error);
    throw {
      code: 'BATCH_DOWNLOAD_ERROR',
      message: 'Failed to download images as ZIP',
    };
  }
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export default {
  compressAndRenameImages,
  downloadSingleImage,
  downloadBatchAsZip,
  formatFileSize,
};
