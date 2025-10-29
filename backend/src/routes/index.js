import express from 'express';
import projectRoutes from './projectRoutes.js';
import templateRoutes from './templateRoutes.js';
import aiRoutes from './aiRoutes.js';
import exportRoutes from './exportRoutes.js';

const router = express.Router();

// Mount routes
router.use('/projects', projectRoutes);
router.use('/templates', templateRoutes);
router.use('/ai', aiRoutes);
router.use('/export', exportRoutes);

// Welcome message
router.get('/', (req, res) => {
  res.json({
    message: 'Page Crafter API v1.0',
    endpoints: {
      projects: '/api/projects',
      templates: '/api/templates',
      ai: '/api/ai',
      export: '/api/export'
    }
  });
});

export default router;
