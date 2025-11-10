import aiService from '../services/aiService.js';
import agenticAIService from '../services/agenticAIService.js';
import contentMapper from '../services/contentMapper.js';
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

/**
 * Generate secondary keywords from product title
 * POST /api/ai/keywords
 */
export const generateSecondaryKeywords = async (req, res) => {
  try {
    const { productTitle } = req.body;

    if (!productTitle || productTitle.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title is required',
        },
      });
    }

    // Generate keywords using AI service
    const result = await aiService.generateSecondaryKeywords(productTitle);

    res.json({
      success: true,
      data: {
        keywords: result.keywords || [],
      },
    });
  } catch (error) {
    console.error('Generate keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate keywords',
      },
    });
  }
};


/**
 * Plan sections for product page
 * POST /api/ai/section-builder/plan-sections
 */
export const planSections = async (req, res) => {
  try {
    const { productContext, mediaInventory = {} } = req.body;

    if (!productContext) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product context is required',
        },
      });
    }

    // Call AI service to plan sections
    const result = await aiService.planSections(productContext, mediaInventory);

    res.json({
      success: true,
      data: {
        sections: result.sections,
        usage: result.usage,
      },
    });
  } catch (error) {
    console.error('Plan sections error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PLAN_ERROR',
        message: error.message || 'Failed to plan sections',
      },
    });
  }
};

/**
 * Realize (generate content for) a single section
 * POST /api/ai/section-builder/realize-section
 */
export const realizeSection = async (req, res) => {
  try {
    const { sectionPlan, productContext } = req.body;

    if (!sectionPlan || !productContext) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section plan and product context are required',
        },
      });
    }

    // Call AI service to realize section
    const result = await aiService.realizeSection(sectionPlan, productContext);

    res.json({
      success: true,
      data: {
        sectionIndex: result.sectionIndex,
        type: result.type,
        content: result.content,
        usage: result.usage,
      },
    });
  } catch (error) {
    console.error('Realize section error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REALIZE_ERROR',
        message: error.message || 'Failed to realize section',
      },
    });
  }
};

/**
 * Assign media to a section
 * POST /api/ai/section-builder/assign-media
 */
export const assignMediaToSection = async (req, res) => {
  try {
    const { sectionPlan, sectionContent, mediaInventory, secondaryKeywords = [] } = req.body;

    if (!sectionPlan || !sectionContent || !mediaInventory) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section plan, content, and media inventory are required',
        },
      });
    }

    // Call AI service to assign media with keyword-rich alt text
    const result = await aiService.assignMedia(
      sectionPlan,
      sectionContent,
      mediaInventory,
      secondaryKeywords
    );

    res.json({
      success: true,
      data: {
        updatedContent: result.updatedContent,
        imagesUsed: result.imagesUsed,
        rationale: result.rationale,
        usage: result.usage,
      },
    });
  } catch (error) {
    console.error('Assign media error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MEDIA_ERROR',
        message: error.message || 'Failed to assign media',
      },
    });
  }
};

/**
 * Validate a section
 * POST /api/ai/section-builder/validate-section
 */
export const validateSectionContent = async (req, res) => {
  try {
    const { sectionPlan, sectionContent } = req.body;

    if (!sectionPlan || !sectionContent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Section plan and content are required',
        },
      });
    }

    // Call AI service to validate section
    const result = await aiService.validateSection(sectionPlan, sectionContent);

    res.json({
      success: true,
      data: {
        validation: result.validation,
        usage: result.usage,
      },
    });
  } catch (error) {
    console.error('Validate section error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message || 'Failed to validate section',
      },
    });
  }
};

/**
 * Agentic AI Workflow Endpoints
 */

/**
 * Stage 1: Generate problem identification suggestions
 * POST /api/ai/agentic/stage1-problem
 */
export const generateProblemSuggestions = async (req, res) => {
  try {
    const { productTitle, supplierDescription } = req.body;

    if (!productTitle || !supplierDescription) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title and supplier description are required',
        },
      });
    }

    const result = await agenticAIService.generateProblemIdentification(
      productTitle,
      supplierDescription
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate problem suggestions error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate problem suggestions',
      },
    });
  }
};

/**
 * Stage 2: Generate solution explanation
 * POST /api/ai/agentic/stage2-solution
 */
export const generateSolution = async (req, res) => {
  try {
    const {
      productTitle,
      supplierDescription,
      problemStatement,
      customerAvatar,
      secondaryKeywords = [],
    } = req.body;

    if (!productTitle || !supplierDescription || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title, supplier description, and problem statement are required',
        },
      });
    }

    const result = await agenticAIService.generateSolutionExplanation(
      productTitle,
      supplierDescription,
      problemStatement,
      customerAvatar,
      secondaryKeywords
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate solution error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate solution explanation',
      },
    });
  }
};

/**
 * Stage 3: Generate feature-benefit mappings
 * POST /api/ai/agentic/stage3-features
 */
export const generateFeatures = async (req, res) => {
  try {
    const {
      productTitle,
      supplierDescription,
      problemStatement,
      secondaryKeywords = [],
    } = req.body;

    if (!productTitle || !supplierDescription || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title, supplier description, and problem statement are required',
        },
      });
    }

    const result = await agenticAIService.generateFeatureBenefits(
      productTitle,
      supplierDescription,
      problemStatement,
      secondaryKeywords
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate features error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate feature benefits',
      },
    });
  }
};

/**
 * Stage 4: Generate technical specifications
 * POST /api/ai/agentic/stage4-specs
 */
export const generateSpecs = async (req, res) => {
  try {
    const {
      productTitle,
      supplierDescription,
      problemStatement,
      secondaryKeywords = [],
    } = req.body;

    if (!productTitle || !supplierDescription || !problemStatement) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title, supplier description, and problem statement are required',
        },
      });
    }

    const result = await agenticAIService.generateTechnicalSpecs(
      productTitle,
      supplierDescription,
      problemStatement,
      secondaryKeywords
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate specs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate technical specifications',
      },
    });
  }
};

/**
 * Stage 5: Generate conclusion with CTA
 * POST /api/ai/agentic/stage5-conclusion
 */
export const generateConclusionCTA = async (req, res) => {
  try {
    const { productTitle, problemStatement, keyBenefits = [] } = req.body;

    if (!productTitle || !problemStatement || keyBenefits.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product title, problem statement, and key benefits are required',
        },
      });
    }

    const result = await agenticAIService.generateConclusion(
      productTitle,
      problemStatement,
      keyBenefits
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Generate conclusion error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error.message || 'Failed to generate conclusion',
      },
    });
  }
};

/**
 * Self-critique stage content
 * POST /api/ai/agentic/critique
 */
export const critiqueContent = async (req, res) => {
  try {
    const { stageNumber, stageContent, checklistItems = [] } = req.body;

    if (!stageNumber || !stageContent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Stage number and content are required',
        },
      });
    }

    const result = await agenticAIService.critiqueStageContent(
      stageNumber,
      stageContent,
      checklistItems
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Critique content error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CRITIQUE_ERROR',
        message: error.message || 'Failed to critique content',
      },
    });
  }
};

/**
 * Map Content to Sections
 * POST /api/ai/agentic/map-content
 */
export const mapContentToSections = async (req, res) => {
  try {
    const { stageContent, secondaryKeywords = [], mediaInventory = {}, mainKeyword } = req.body;

    if (!stageContent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Stage content is required',
        },
      });
    }

    if (!mainKeyword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Main keyword (product title) is required',
        },
      });
    }

    const sections = contentMapper.mapContentToSections(
      stageContent,
      secondaryKeywords,
      mediaInventory,
      mainKeyword
    );

    // Validate each section's field mapping
    const validations = sections.map((section, index) => ({
      sectionIndex: index,
      ...contentMapper.validateSectionFieldMapping(section),
    }));

    const allValid = validations.every((v) => v.valid);

    res.json({
      success: true,
      data: {
        sections,
        validations,
        allValid,
        sectionCount: sections.length,
      },
    });
  } catch (error) {
    console.error('Map content to sections error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'MAPPING_ERROR',
        message: error.message || 'Failed to map content to sections',
      },
    });
  }
};

/**
 * Recommend Section Types
 * POST /api/ai/agentic/recommend-sections
 */
export const recommendSections = async (req, res) => {
  try {
    const { productContext, stageContent } = req.body;

    if (!productContext || !stageContent) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product context and stage content are required',
        },
      });
    }

    const recommendations = contentMapper.recommendSectionTypes(productContext, stageContent);

    res.json({
      success: true,
      data: {
        recommendations,
      },
    });
  } catch (error) {
    console.error('Recommend sections error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RECOMMENDATION_ERROR',
        message: error.message || 'Failed to recommend section types',
      },
    });
  }
};

/**
 * Evaluate Alt Text Quality
 * POST /api/ai/agentic/evaluate-alt-text
 */
export const evaluateAltText = async (req, res) => {
  try {
    const { sections, secondaryKeywords = [] } = req.body;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Sections array is required',
        },
      });
    }

    const result = await agenticAIService.evaluateAltTextQuality(sections, secondaryKeywords);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Evaluate alt text error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EVALUATION_ERROR',
        message: error.message || 'Failed to evaluate alt text quality',
      },
    });
  }
};

/**
 * Evaluate Keyword Coverage
 * POST /api/ai/agentic/evaluate-keywords
 */
export const evaluateKeywords = async (req, res) => {
  try {
    const { sections, secondaryKeywords = [], mainKeyword } = req.body;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Sections array is required',
        },
      });
    }

    if (!mainKeyword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Main keyword is required',
        },
      });
    }

    const result = await agenticAIService.evaluateKeywordCoverage(
      sections,
      secondaryKeywords,
      mainKeyword
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Evaluate keyword coverage error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'EVALUATION_ERROR',
        message: error.message || 'Failed to evaluate keyword coverage',
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
  generateSecondaryKeywords,
  // Section Builder Framework endpoints
  planSections,
  realizeSection,
  assignMediaToSection,
  validateSectionContent,
  // Agentic AI Workflow endpoints
  generateProblemSuggestions,
  generateSolution,
  generateFeatures,
  generateSpecs,
  generateConclusionCTA,
  critiqueContent,
  // Agentic AI Evaluation endpoints
  evaluateAltText,
  evaluateKeywords,
  // Content Mapper endpoints
  mapContentToSections,
  recommendSections,
};
