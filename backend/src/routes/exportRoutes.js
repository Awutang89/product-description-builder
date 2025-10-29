import express from 'express';
import * as exportController from '../controllers/exportController.js';

const router = express.Router();

/**
 * Export Endpoints
 */

// Get available export formats
router.get('/formats', exportController.getExportFormats);

// Export project as HTML fragment
router.get('/projects/:id/html', exportController.exportHTML);

// Export project as complete HTML document
router.get('/projects/:id/document', exportController.exportDocument);

// Export project for Shopify
router.get('/projects/:id/shopify', exportController.exportShopify);

// Export CSS only
router.get('/projects/:id/css', exportController.exportCSS);

// Preview export before downloading
router.post('/preview', exportController.previewExport);

export default router;
