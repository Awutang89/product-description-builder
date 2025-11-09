import express from 'express';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

/**
 * AI Content Generation Endpoints
 */

// Generate content with examples
router.post('/generate', aiController.generateContent);

// Generate multiple variations for A/B testing
router.post('/variations', aiController.generateVariations);

// Score content quality
router.post('/score', aiController.scoreContent);

// Refine content based on feedback
router.post('/refine', aiController.refineContent);

/**
 * AI Example Management Endpoints
 */

// Create new example
router.post('/examples', aiController.createExample);

// Get all approved examples with pagination/filtering
router.get('/examples', aiController.getExamples);

// Get single example
router.get('/examples/:id', aiController.getExampleById);

// Update example
router.put('/examples/:id', aiController.updateExample);

// Delete example
router.delete('/examples/:id', aiController.deleteExample);

// Approve example for public use
router.post('/examples/:id/approve', aiController.approveExample);

// Record example usage
router.post('/examples/:id/use', aiController.useExample);

/**
 * Generate secondary keywords from product title
 */
router.post('/keywords', aiController.generateSecondaryKeywords);

/**
 * Section Builder Framework Endpoints
 */

// Plan sections for product page
router.post('/section-builder/plan-sections', aiController.planSections);

// Realize (generate content for) a single section
router.post('/section-builder/realize-section', aiController.realizeSection);

// Assign media to a section
router.post('/section-builder/assign-media', aiController.assignMediaToSection);

// Validate a section
router.post('/section-builder/validate-section', aiController.validateSectionContent);

/**
 * Agentic AI Workflow Endpoints
 * Multi-stage content generation with self-critique
 */

// Stage 1: Problem Identification
router.post('/agentic/stage1-problem', aiController.generateProblemSuggestions);

// Stage 2: Solution Explanation
router.post('/agentic/stage2-solution', aiController.generateSolution);

// Stage 3: Features to Benefits Mapping
router.post('/agentic/stage3-features', aiController.generateFeatures);

// Stage 4: Technical Specifications
router.post('/agentic/stage4-specs', aiController.generateSpecs);

// Stage 5: Conclusion + CTA
router.post('/agentic/stage5-conclusion', aiController.generateConclusionCTA);

// AI Self-Critique
router.post('/agentic/critique', aiController.critiqueContent);

/**
 * Agentic AI Evaluation Endpoints
 * Post-generation quality checks
 */

// Evaluate Alt Text Quality
router.post('/agentic/evaluate-alt-text', aiController.evaluateAltText);

// Evaluate Keyword Coverage
router.post('/agentic/evaluate-keywords', aiController.evaluateKeywords);

/**
 * Content Mapper Endpoints
 * Maps generated content to section structures
 */

// Map content from 5 stages to sections
router.post('/agentic/map-content', aiController.mapContentToSections);

// Recommend section types based on content
router.post('/agentic/recommend-sections', aiController.recommendSections);

export default router;
