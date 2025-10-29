import express from 'express';
import * as templateController from '../controllers/templateController.js';

const router = express.Router();

// Template routes
router.post('/', templateController.createTemplate);
router.get('/', templateController.getAllTemplates);
router.get('/featured', templateController.getFeaturedTemplates);
router.get('/category/:category', templateController.getTemplatesByCategory);
router.get('/:id', templateController.getTemplateById);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);
router.post('/:id/use', templateController.useTemplate);

export default router;
