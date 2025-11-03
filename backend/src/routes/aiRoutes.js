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
 * Product Description Generation Endpoints
 */

// Generate secondary keywords from product title
router.post('/keywords', aiController.generateSecondaryKeywords);

// Generate product description in stages
router.post('/product-description', aiController.generateProductDescription);

// Refine product description stage
router.post('/product-description/refine', aiController.refineProductStage);

// Get example product descriptions
router.get('/product-examples', aiController.getProductDescriptionExamples);

export default router;
