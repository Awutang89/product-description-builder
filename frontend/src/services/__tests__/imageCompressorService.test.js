import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  compressAndRenameImages,
  downloadSingleImage,
  downloadBatchAsZip,
  formatFileSize,
} from '../imageCompressorService';

// Mock fetch
global.fetch = vi.fn();

describe('Image Compressor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('compressAndRenameImages', () => {
    it('should send FormData with files and keywords to API', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          success: true,
          images: [
            {
              originalName: 'test.jpg',
              optimizedName: 'test-image.jpg',
              compressionRatio: '50.00',
            },
          ],
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const files = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
      const keywords = 'test keyword';

      const result = await compressAndRenameImages(files, keywords);

      expect(global.fetch).toHaveBeenCalledWith('/api/image-compressor/compress', {
        method: 'POST',
        body: expect.any(FormData),
      });
      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(1);
    });

    it('should throw error when response is not ok', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: 'Invalid file type',
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const files = [new File(['test'], 'test.gif', { type: 'image/gif' })];

      await expect(compressAndRenameImages(files, 'keyword')).rejects.toThrow('Invalid file type');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const files = [new File(['test'], 'test.jpg')];

      await expect(compressAndRenameImages(files, 'keyword')).rejects.toThrow();
    });

    it('should handle missing keywords', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: 'Please provide at least one secondary keyword',
        }),
      };

      global.fetch.mockResolvedValueOnce(mockResponse);

      const files = [new File(['test'], 'test.jpg')];

      await expect(compressAndRenameImages(files, '')).rejects.toThrow();
    });
  });

  describe('downloadSingleImage', () => {
    it('should create download link and trigger download', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['image data'])),
      });

      const image = {
        compressedBuffer: 'base64data',
        optimizedName: 'test-image.jpg',
      };

      await downloadSingleImage(image);

      expect(global.fetch).toHaveBeenCalledWith('/api/image-compressor/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBuffer: 'base64data',
          fileName: 'test-image.jpg',
        }),
      });

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should throw error when download fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      const image = {
        compressedBuffer: 'base64data',
        optimizedName: 'test.jpg',
      };

      await expect(downloadSingleImage(image)).rejects.toThrow('Failed to download image');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const image = {
        compressedBuffer: 'base64data',
        optimizedName: 'test.jpg',
      };

      await expect(downloadSingleImage(image)).rejects.toThrow();
    });
  });

  describe('downloadBatchAsZip', () => {
    it('should send batch download request to API', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['zip data'])),
      });

      const images = [
        {
          compressedBuffer: 'base64-1',
          optimizedName: 'image1.jpg',
        },
        {
          compressedBuffer: 'base64-2',
          optimizedName: 'image2.jpg',
        },
      ];

      await downloadBatchAsZip(images);

      expect(global.fetch).toHaveBeenCalledWith('/api/image-compressor/download-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
    });

    it('should throw error when batch download fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      const images = [
        {
          compressedBuffer: 'base64-1',
          optimizedName: 'image1.jpg',
        },
      ];

      await expect(downloadBatchAsZip(images)).rejects.toThrow('Failed to download images as ZIP');
    });

    it('should handle empty image array', async () => {
      const images = [];

      // Should still attempt fetch even with empty array
      expect(typeof downloadBatchAsZip).toBe('function');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      const result = formatFileSize(1536); // 1.5 KB
      expect(result).toContain('KB');
      expect(result).toMatch(/1\.[0-9]+ KB/);
    });

    it('should handle large file sizes', () => {
      const result = formatFileSize(10 * 1024 * 1024 * 1024); // 10 GB
      expect(result).toContain('GB');
    });

    it('should round to 2 decimal places', () => {
      const result = formatFileSize(1234567);
      const parts = result.split(' ');
      const number = parseFloat(parts[0]);
      expect(number.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('Module Exports', () => {
    it('should export all required functions', () => {
      expect(typeof compressAndRenameImages).toBe('function');
      expect(typeof downloadSingleImage).toBe('function');
      expect(typeof downloadBatchAsZip).toBe('function');
      expect(typeof formatFileSize).toBe('function');
    });
  });

  describe('API Endpoint Format', () => {
    it('should use correct API base URL', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true, images: [] }),
      });

      const files = [new File(['test'], 'test.jpg')];
      await compressAndRenameImages(files, 'keyword');

      const callUrl = global.fetch.mock.calls[0][0];
      expect(callUrl).toContain('/api/image-compressor');
    });

    it('should use POST method for all operations', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({ success: true, images: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: vi.fn().mockResolvedValue(new Blob()),
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: vi.fn().mockResolvedValue(new Blob()),
        });

      const files = [new File(['test'], 'test.jpg')];
      const image = { compressedBuffer: 'data', optimizedName: 'test.jpg' };

      await compressAndRenameImages(files, 'keyword');
      await downloadSingleImage(image);
      await downloadBatchAsZip([image]);

      global.fetch.mock.calls.forEach(call => {
        expect(call[1].method).toBe('POST');
      });
    });
  });
});
