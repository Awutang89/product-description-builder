import Project from '../models/Project.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description = '', sections = [], brandColors = [], typography = {} } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Project name is required',
          details: [{ field: 'name', message: 'Name is required' }]
        }
      });
    }

    const project = new Project({
      name: name.trim(),
      description: description.trim(),
      sections,
      brandColors,
      typography,
      isDraft: true
    });

    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      data: savedProject,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);

    if (error.name === 'ValidationError') {
      const details = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project data',
          details
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to create project'
      }
    });
  }
};

// Get all projects with pagination and filtering
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-updatedAt', search = '', isDraft } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (isDraft !== undefined) {
      filter.isDraft = isDraft === 'true';
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch projects'
      }
    });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
          details: { projectId: id }
        }
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch project'
      }
    });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Allowed fields for update
    const allowedFields = ['name', 'description', 'sections', 'brandColors', 'typography', 'isDraft'];
    const updateData = {};

    for (const field of allowedFields) {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    }

    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);

    if (error.name === 'ValidationError') {
      const details = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project data',
          details
        }
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update project'
      }
    });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete project'
      }
    });
  }
};

// Duplicate a project
export const duplicateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name: customName } = req.body;

    const originalProject = await Project.findById(id);

    if (!originalProject) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Original project not found'
        }
      });
    }

    // Create duplicate
    const duplicateData = {
      name: customName || `${originalProject.name} (Copy)`,
      description: originalProject.description,
      sections: JSON.parse(JSON.stringify(originalProject.sections)),
      brandColors: [...originalProject.brandColors],
      typography: { ...originalProject.typography },
      isDraft: true
    };

    const duplicatedProject = new Project(duplicateData);
    const savedProject = await duplicatedProject.save();

    res.status(201).json({
      success: true,
      data: savedProject,
      message: 'Project duplicated successfully'
    });
  } catch (error) {
    console.error('Error duplicating project:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid project ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to duplicate project'
      }
    });
  }
};
