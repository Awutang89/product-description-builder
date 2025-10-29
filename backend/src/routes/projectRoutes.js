import express from 'express';
import * as projectController from '../controllers/projectController.js';

const router = express.Router();

// Project routes
router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.post('/:id/duplicate', projectController.duplicateProject);

export default router;
