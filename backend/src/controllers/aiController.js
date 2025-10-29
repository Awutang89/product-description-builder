import aiService from '../services/aiService.js';
import AIExample from '../models/AIExample.js';

/**
 * AI Controller
 * Handles AI content generation and example management
 */

/**
 * Generate content using AI
 * POST /api/ai/generate
 */
export const generateContent = async (req, res) => {
  try {
    const { prompt, sectionType, exampleIds = [], model, temperature, maxTokens } = req.body;

    // Validation
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt is required',
        },
      });
    }

    if (!sectionType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section type is required',
        },
      });
    }

    // Fetch examples if provided
    let examples = [];
    if (exampleIds && exampleIds.length > 0) {
      examples = await AIExample.find({
        _id: { $in: exampleIds },
        'quality.isApproved': true,
      }).select('input output note');
    }

    // Call AI service
    const result = await aiService.generateContent(prompt, sectionType, examples, {
      model,
      temperature,
      maxTokens,
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Content generated successfully',
    });
  } catch (error) {
    console.error('Generate Content Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || 'GENERATION_ERROR',
        message: error.message || 'Failed to generate content',
      },
    });
  }
};

/**
 * Generate multiple variations
 * POST /api/ai/variations
 */
export const generateVariations = async (req, res) => {
  try {
    const { prompt, sectionType, count = 3, exampleIds = [], temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Prompt is required',
        },
      });
    }

    if (!sectionType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section type is required',
        },
      });
    }

    // Fetch examples
    let examples = [];
    if (exampleIds && exampleIds.length > 0) {
      examples = await AIExample.find({
        _id: { $in: exampleIds },
        'quality.isApproved': true,
      }).select('input output note');
    }

    // Generate variations
    const result = await aiService.generateVariations(
      prompt,
      sectionType,
      Math.min(count, 5), // Max 5 variations to save tokens
      examples,
      { temperature }
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Variations generated successfully',
    });
  } catch (error) {
    console.error('Generate Variations Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || 'VARIATION_ERROR',
        message: error.message || 'Failed to generate variations',
      },
    });
  }
};

/**
 * Score content quality
 * POST /api/ai/score
 */
export const scoreContent = async (req, res) => {
  try {
    const { content, sectionType, criteria = [] } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Content is required',
        },
      });
    }

    if (!sectionType) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section type is required',
        },
      });
    }

    const result = await aiService.scoreContent(content, sectionType, criteria);

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Content scored successfully',
    });
  } catch (error) {
    console.error('Score Content Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || 'SCORE_ERROR',
        message: error.message || 'Failed to score content',
      },
    });
  }
};

/**
 * Refine content based on feedback
 * POST /api/ai/refine
 */
export const refineContent = async (req, res) => {
  try {
    const { originalContent, feedback, sectionType, exampleIds = [] } = req.body;

    if (!originalContent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Original content is required',
        },
      });
    }

    if (!feedback) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Feedback is required',
        },
      });
    }

    // Fetch examples
    let examples = [];
    if (exampleIds && exampleIds.length > 0) {
      examples = await AIExample.find({
        _id: { $in: exampleIds },
        'quality.isApproved': true,
      }).select('input output note');
    }

    const result = await aiService.refineContent(
      originalContent,
      feedback,
      sectionType,
      examples
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Content refined successfully',
    });
  } catch (error) {
    console.error('Refine Content Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: error.code || 'REFINE_ERROR',
        message: error.message || 'Failed to refine content',
      },
    });
  }
};

/**
 * Create new example
 * POST /api/ai/examples
 */
export const createExample = async (req, res) => {
  try {
    const { name, sectionType, category, input, output, note, tags } = req.body;

    // Validation
    if (!name || !sectionType || !input || !output) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, section type, input, and output are required',
        },
      });
    }

    // Create example
    const example = new AIExample({
      name,
      sectionType,
      category: category || 'general',
      input,
      output,
      note,
      tags,
      isPublic: false,
    });

    await example.save();

    return res.status(201).json({
      success: true,
      data: example,
      message: 'Example created successfully',
    });
  } catch (error) {
    console.error('Create Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error.message || 'Failed to create example',
      },
    });
  }
};

/**
 * Get all approved examples
 * GET /api/ai/examples
 */
export const getExamples = async (req, res) => {
  try {
    const { sectionType, category, search, page = 1, limit = 20 } = req.query;

    let query = { 'quality.isApproved': true };

    if (sectionType) query.sectionType = sectionType;
    if (category) query.category = category;

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { input: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await AIExample.countDocuments(query);

    const examples = await AIExample.find(query)
      .select('-__v')
      .sort({ usageCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: {
        examples,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
      message: 'Examples retrieved successfully',
    });
  } catch (error) {
    console.error('Get Examples Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to retrieve examples',
      },
    });
  }
};

/**
 * Get single example
 * GET /api/ai/examples/:id
 */
export const getExampleById = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await AIExample.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Example not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: example,
      message: 'Example retrieved successfully',
    });
  } catch (error) {
    console.error('Get Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to retrieve example',
      },
    });
  }
};

/**
 * Update example
 * PUT /api/ai/examples/:id
 */
export const updateExample = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const example = await AIExample.findByIdAndUpdate(id, updates, { new: true });

    if (!example) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Example not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: example,
      message: 'Example updated successfully',
    });
  } catch (error) {
    console.error('Update Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update example',
      },
    });
  }
};

/**
 * Delete example
 * DELETE /api/ai/examples/:id
 */
export const deleteExample = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await AIExample.findByIdAndDelete(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Example not found',
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Example deleted successfully',
    });
  } catch (error) {
    console.error('Delete Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete example',
      },
    });
  }
};

/**
 * Approve example for public use
 * POST /api/ai/examples/:id/approve
 */
export const approveExample = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const example = await AIExample.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Example not found',
        },
      });
    }

    await example.approve(feedback);

    return res.status(200).json({
      success: true,
      data: example,
      message: 'Example approved successfully',
    });
  } catch (error) {
    console.error('Approve Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to approve example',
      },
    });
  }
};

/**
 * Record example usage
 * POST /api/ai/examples/:id/use
 */
export const useExample = async (req, res) => {
  try {
    const { id } = req.params;

    const example = await AIExample.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Example not found',
        },
      });
    }

    await example.incrementUsage();

    return res.status(200).json({
      success: true,
      data: example,
      message: 'Example usage recorded',
    });
  } catch (error) {
    console.error('Use Example Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to record usage',
      },
    });
  }
};

export default {
  generateContent,
  generateVariations,
  scoreContent,
  refineContent,
  createExample,
  getExamples,
  getExampleById,
  updateExample,
  deleteExample,
  approveExample,
  useExample,
};
