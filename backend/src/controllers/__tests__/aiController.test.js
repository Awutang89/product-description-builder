import { describe, it, expect } from 'vitest';
import aiController from '../aiController.js';

describe('AI Controller', () => {
  it('should export controller as default', () => {
    expect(aiController).toBeDefined();
  });

  describe('Content Generation Methods', () => {
    it('should have generateContent method', () => {
      expect(aiController.generateContent).toBeDefined();
      expect(typeof aiController.generateContent).toBe('function');
    });

    it('should have generateVariations method', () => {
      expect(aiController.generateVariations).toBeDefined();
      expect(typeof aiController.generateVariations).toBe('function');
    });

    it('should have scoreContent method', () => {
      expect(aiController.scoreContent).toBeDefined();
      expect(typeof aiController.scoreContent).toBe('function');
    });

    it('should have refineContent method', () => {
      expect(aiController.refineContent).toBeDefined();
      expect(typeof aiController.refineContent).toBe('function');
    });
  });

  describe('Product Description Methods', () => {
    it('should have generateProductDescription method', () => {
      expect(aiController.generateProductDescription).toBeDefined();
      expect(typeof aiController.generateProductDescription).toBe('function');
    });

    it('should have refineProductStage method', () => {
      expect(aiController.refineProductStage).toBeDefined();
      expect(typeof aiController.refineProductStage).toBe('function');
    });

    it('should have generateSecondaryKeywords method', () => {
      expect(aiController.generateSecondaryKeywords).toBeDefined();
      expect(typeof aiController.generateSecondaryKeywords).toBe('function');
    });
  });

  describe('Examples Management Methods', () => {
    it('should have createExample method', () => {
      expect(aiController.createExample).toBeDefined();
      expect(typeof aiController.createExample).toBe('function');
    });

    it('should have getExamples method', () => {
      expect(aiController.getExamples).toBeDefined();
      expect(typeof aiController.getExamples).toBe('function');
    });

    it('should have getExampleById method', () => {
      expect(aiController.getExampleById).toBeDefined();
      expect(typeof aiController.getExampleById).toBe('function');
    });

    it('should have updateExample method', () => {
      expect(aiController.updateExample).toBeDefined();
      expect(typeof aiController.updateExample).toBe('function');
    });

    it('should have deleteExample method', () => {
      expect(aiController.deleteExample).toBeDefined();
      expect(typeof aiController.deleteExample).toBe('function');
    });
  });
});
