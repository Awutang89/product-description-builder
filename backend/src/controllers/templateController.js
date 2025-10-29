import Template from '../models/Template.js';

// Create a new template
export const createTemplate = async (req, res) => {
  try {
    const {
      name,
      description,
      category = 'general',
      sections = [],
      brandColors = [],
      tags = [],
      thumbnail = ''
    } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Template name is required',
          details: [{ field: 'name', message: 'Name is required' }]
        }
      });
    }

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Template description is required',
          details: [{ field: 'description', message: 'Description is required' }]
        }
      });
    }

    const template = new Template({
      name: name.trim(),
      description: description.trim(),
      category,
      sections,
      brandColors,
      tags,
      thumbnail,
      isPrebuilt: false,
      usageCount: 0
    });

    const savedTemplate = await template.save();

    res.status(201).json({
      success: true,
      data: savedTemplate,
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Error creating template:', error);

    if (error.name === 'ValidationError') {
      const details = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template data',
          details
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to create template'
      }
    });
  }
};

// Get all templates with filtering
export const getAllTemplates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      isPrebuilt,
      isFeatured,
      search = '',
      sort = '-usageCount'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (isPrebuilt !== undefined) {
      filter.isPrebuilt = isPrebuilt === 'true';
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query
    const templates = await Template.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Template.countDocuments(filter);

    res.json({
      success: true,
      data: {
        templates,
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
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch templates'
      }
    });
  }
};

// Get a single template by ID
export const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found',
          details: { templateId: id }
        }
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch template'
      }
    });
  }
};

// Update a template
export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Allowed fields for update
    const allowedFields = ['name', 'description', 'category', 'sections', 'brandColors', 'tags', 'thumbnail', 'isFeatured'];
    const updateData = {};

    for (const field of allowedFields) {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    }

    const template = await Template.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found'
        }
      });
    }

    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error) {
    console.error('Error updating template:', error);

    if (error.name === 'ValidationError') {
      const details = Object.entries(error.errors).map(([field, err]) => ({
        field,
        message: err.message
      }));

      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template data',
          details
        }
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update template'
      }
    });
  }
};

// Delete a template (only non-prebuilt)
export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found'
        }
      });
    }

    // Don't allow deletion of prebuilt templates
    if (template.isPrebuilt) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Cannot delete prebuilt templates'
        }
      });
    }

    await Template.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete template'
      }
    });
  }
};

// Use a template (increment usage count)
export const useTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Template not found'
        }
      });
    }

    await template.incrementUsage();

    res.json({
      success: true,
      message: 'Template usage recorded'
    });
  } catch (error) {
    console.error('Error recording template usage:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid template ID'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to record template usage'
      }
    });
  }
};

// Get featured templates
export const getFeaturedTemplates = async (req, res) => {
  try {
    const templates = await Template.findFeatured().limit(10);

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching featured templates:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch featured templates'
      }
    });
  }
};

// Get templates by category
export const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const templates = await Template.findByCategory(category);

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates by category:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch templates'
      }
    });
  }
};
