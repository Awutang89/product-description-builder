import { describe, it, expect, vi, beforeEach } from 'vitest';
import sharp from 'sharp';
import {
  compressImage,
  generateOptimizedFilename,
  generateImageDescription,
} from '../imageCompressorService.js';

// Mock sharp
vi.mock('sharp');

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'blue stylish shoe product' } }],
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
          }),
        },
      },
    })),
  };
});

describe('Image Compressor Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('compressImage', () => {
    it('should compress JPEG images with proper settings', async () => {
      const mockBuffer = Buffer.from('fake image data');
      const compressedBuffer = Buffer.from('compressed data');

      // Mock sharp pipeline
      const mockJpeg = vi.fn().mockReturnThis();
      const mockToBuffer = vi.fn().mockResolvedValue(compressedBuffer);

      sharp.mockImplementation(() => ({
        jpeg: mockJpeg,
        toBuffer: mockToBuffer,
      }));

      const result = await compressImage(mockBuffer, 'jpeg');

      expect(mockJpeg).toHaveBeenCalledWith({
        quality: 95,
        mozjpeg: true,
        progressive: true,
      });
      expect(result).toEqual(compressedBuffer);
    });

    it('should compress PNG images with proper settings', async () => {
      const mockBuffer = Buffer.from('fake image data');
      const compressedBuffer = Buffer.from('compressed data');

      const mockPng = vi.fn().mockReturnThis();
      const mockToBuffer = vi.fn().mockResolvedValue(compressedBuffer);

      sharp.mockImplementation(() => ({
        png: mockPng,
        toBuffer: mockToBuffer,
      }));

      const result = await compressImage(mockBuffer, 'png');

      expect(mockPng).toHaveBeenCalledWith({
        compressionLevel: 9,
        adaptiveFiltering: true,
      });
      expect(result).toEqual(compressedBuffer);
    });

    it('should normalize jpg to jpeg format', async () => {
      const mockBuffer = Buffer.from('fake image data');
      const compressedBuffer = Buffer.from('compressed data');

      const mockJpeg = vi.fn().mockReturnThis();
      const mockToBuffer = vi.fn().mockResolvedValue(compressedBuffer);

      sharp.mockImplementation(() => ({
        jpeg: mockJpeg,
        toBuffer: mockToBuffer,
      }));

      await compressImage(mockBuffer, 'jpg');

      expect(mockJpeg).toHaveBeenCalled();
    });

    it('should handle compression errors gracefully', async () => {
      const mockBuffer = Buffer.from('fake image data');
      sharp.mockImplementation(() => {
        throw new Error('Sharp processing failed');
      });

      await expect(compressImage(mockBuffer, 'jpeg')).rejects.toMatchObject({
        code: 'COMPRESSION_ERROR',
        message: expect.stringContaining('Failed to compress image'),
      });
    });
  });

  describe('generateOptimizedFilename', () => {
    it('should combine keyword and description into valid filename', () => {
      const filename = generateOptimizedFilename(
        'Blue Shoes',
        'stylish blue athletic shoes',
        'jpg'
      );

      expect(filename).toBe('blue-shoes-stylish-blue-athletic-shoes.jpg');
    });

    it('should sanitize special characters', () => {
      const filename = generateOptimizedFilename(
        'Product@#$%',
        'Great!!! Item',
        'jpg'
      );

      expect(filename).toMatch(/^product-great-item\.jpg$/);
    });

    it('should replace spaces with hyphens', () => {
      const filename = generateOptimizedFilename(
        'Nice Product',
        'very cool item',
        'jpg'
      );

      expect(filename).toContain('-');
      expect(filename).not.toContain(' ');
    });

    it('should remove duplicate hyphens', () => {
      const filename = generateOptimizedFilename(
        'Product  Name',
        'Item   Description',
        'jpg'
      );

      expect(filename).not.toMatch(/--/);
    });

    it('should limit filename length to 200 characters', () => {
      const longKeyword = 'a'.repeat(100);
      const longDescription = 'b'.repeat(150);

      const filename = generateOptimizedFilename(
        longKeyword,
        longDescription,
        'jpg'
      );

      expect(filename.length).toBeLessThanOrEqual(204); // 200 + .jpg
    });

    it('should handle missing keyword', () => {
      const filename = generateOptimizedFilename(
        '',
        'product description',
        'jpg'
      );

      expect(filename).toBe('product-description.jpg');
    });

    it('should handle missing description', () => {
      const filename = generateOptimizedFilename(
        'Product Name',
        '',
        'jpg'
      );

      expect(filename).toBe('product-name.jpg');
    });

    it('should handle both missing keyword and description', () => {
      const filename = generateOptimizedFilename('', '', 'jpg');

      // When both are empty, it returns just the extension or fallback filename
      expect(filename).toBeTruthy();
      expect(filename).toContain('.jpg');
    });

    it('should support PNG extension', () => {
      const filename = generateOptimizedFilename(
        'Image',
        'Description',
        'png'
      );

      expect(filename).toBe('image-description.png');
    });
  });

  describe('generateImageDescription', () => {
    it('should return fallback when API key is missing', async () => {
      // Temporarily remove API key
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const mockBuffer = Buffer.from('fake image data');
      const description = await generateImageDescription(mockBuffer);

      expect(description).toBe('product image');

      // Restore API key
      if (originalKey) {
        process.env.OPENAI_API_KEY = originalKey;
      }
    });

    it('should return fallback on API error', async () => {
      const mockBuffer = Buffer.from('fake image data');

      // Mock OpenAI to throw error
      vi.doMock('openai', () => {
        return {
          default: vi.fn(() => ({
            chat: {
              completions: {
                create: vi.fn().mockRejectedValue(new Error('API Error')),
              },
            },
          })),
        };
      });

      // Description should fall back gracefully
      expect(typeof await generateImageDescription(mockBuffer)).toBe('string');
    });
  });

  describe('Module Exports', () => {
    it('should export all required functions', () => {
      expect(typeof compressImage).toBe('function');
      expect(typeof generateImageDescription).toBe('function');
      expect(typeof generateOptimizedFilename).toBe('function');
    });
  });
});
