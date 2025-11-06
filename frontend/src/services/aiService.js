import api from './api';

/**
 * AI Service
 * Handles all AI-related API calls
 */

export const aiService = {
  /**
   * Generate content using AI
   */
  generateContent: async (prompt, sectionType, exampleIds = [], options = {}) => {
    const response = await api.post('/ai/generate', {
      prompt,
      sectionType,
      exampleIds,
      ...options,
    });
    return response.data;
  },

  /**
   * Generate multiple variations for A/B testing
   */
  generateVariations: async (prompt, sectionType, count = 3, exampleIds = [], options = {}) => {
    const response = await api.post('/ai/variations', {
      prompt,
      sectionType,
      count,
      exampleIds,
      ...options,
    });
    return response.data;
  },

  /**
   * Score content quality
   */
  scoreContent: async (content, sectionType, criteria = []) => {
    const response = await api.post('/ai/score', {
      content,
      sectionType,
      criteria,
    });
    return response.data;
  },

  /**
   * Refine content based on feedback
   */
  refineContent: async (originalContent, feedback, sectionType, exampleIds = []) => {
    const response = await api.post('/ai/refine', {
      originalContent,
      feedback,
      sectionType,
      exampleIds,
    });
    return response.data;
  },

  /**
   * Example Management
   */

  /**
   * Create new example
   */
  createExample: async (exampleData) => {
    const response = await api.post('/ai/examples', exampleData);
    return response.data;
  },

  /**
   * Get all approved examples
   */
  getExamples: async (params = {}) => {
    const response = await api.get('/ai/examples', { params });
    return response.data;
  },

  /**
   * Get examples by section type
   */
  getExamplesByType: async (sectionType, category = null) => {
    const params = { sectionType };
    if (category) params.category = category;
    return aiService.getExamples(params);
  },

  /**
   * Get single example
   */
  getExampleById: async (exampleId) => {
    const response = await api.get(`/ai/examples/${exampleId}`);
    return response.data;
  },

  /**
   * Update example
   */
  updateExample: async (exampleId, updates) => {
    const response = await api.put(`/ai/examples/${exampleId}`, updates);
    return response.data;
  },

  /**
   * Delete example
   */
  deleteExample: async (exampleId) => {
    const response = await api.delete(`/ai/examples/${exampleId}`);
    return response.data;
  },

  /**
   * Approve example for public use
   */
  approveExample: async (exampleId, feedback = '') => {
    const response = await api.post(`/ai/examples/${exampleId}/approve`, { feedback });
    return response.data;
  },

  /**
   * Record example usage
   */
  useExample: async (exampleId) => {
    const response = await api.post(`/ai/examples/${exampleId}/use`);
    return response.data;
  },

  /**
   * Search examples
   */
  searchExamples: async (searchTerm, sectionType = null) => {
    const params = { search: searchTerm };
    if (sectionType) params.sectionType = sectionType;
    return aiService.getExamples(params);
  },

  /**
   * Generate secondary keywords from product title
   * Used for SEO optimization and heading variation
   */
  generateSecondaryKeywords: async (productTitle) => {
    const response = await api.post('/ai/keywords', {
      productTitle,
    });
    return response.data;
  },

  /**
   * Generate product description in stages
   * Stage 1: Problem Identification
   * Stage 2: Solution Explanation
   * Stage 3: Feature → Benefit Mapping
   * Stage 4: Technical Specifications
   * Stage 5: Call-to-Action Conclusion
   */
  generateProductDescription: async (
    supplierDescription,
    imageUrls = [],
    productTitle,
    stage = 1,
    options = {}
  ) => {
    const response = await api.post('/ai/product-description', {
      supplierDescription,
      imageUrls,
      productTitle,
      stage,
      secondaryKeywords: options.secondaryKeywords || [],
      examples: options.examples || [],
      previousStageContent: options.previousStageContent || null,
    });
    return response.data;
  },

  /**
   * Refine product description stage based on feedback
   */
  refineProductStage: async (
    stageContent,
    feedback,
    stage,
    productTitle,
    options = {}
  ) => {
    const response = await api.post('/ai/product-description/refine', {
      stageContent,
      feedback,
      stage,
      productTitle,
      secondaryKeywords: options.secondaryKeywords || [],
    });
    return response.data;
  },

  /**
   * Get example product descriptions for reference
   * These are used to train the AI on good product copy
   */
  getProductDescriptionExamples: async (category = null, limit = 3) => {
    const params = { limit };
    if (category) params.category = category;
    const response = await api.get('/ai/product-examples', { params });
    return response.data;
  },

  /**
   * SECTION BUILDER FRAMEWORK
   * Section-by-section product page generation
   */

  /**
   * Plan sections for a product page
   * Returns ordered list of 2-8 sections to generate
   */
  planSections: async (productContext, mediaInventory = {}) => {
    const response = await api.post('/ai/section-builder/plan-sections', {
      productContext,
      mediaInventory,
    });
    return response.data;
  },

  /**
   * Generate content for a single section
   * Takes section plan and product context, returns section content
   */
  realizeSection: async (sectionPlan, productContext) => {
    const response = await api.post('/ai/section-builder/realize-section', {
      sectionPlan,
      productContext,
    });
    return response.data;
  },

  /**
   * Assign media to a section
   * Selects best image/video for the section and generates alt text
   */
  assignMediaToSection: async (sectionPlan, sectionContent, mediaInventory) => {
    const response = await api.post('/ai/section-builder/assign-media', {
      sectionPlan,
      sectionContent,
      mediaInventory,
    });
    return response.data;
  },

  /**
   * Validate section content
   * Validates content against schema and auto-fixes common issues
   */
  validateSection: async (sectionPlan, sectionContent) => {
    const response = await api.post('/ai/section-builder/validate-section', {
      sectionPlan,
      sectionContent,
    });
    return response.data;
  },

  /**
   * Generate complete product page using Section Builder
   * High-level helper that orchestrates the entire section-by-section flow
   */
  generateSectionBuilderPage: async (productContext, mediaInventory = {}, onProgress = null) => {
    try {
      // Step 1: Plan sections
      if (onProgress) onProgress({ step: 'planning', progress: 0, message: 'Planning sections...' });
      const planResponse = await aiService.planSections(productContext, mediaInventory);
      const sections = planResponse.data.sections;

      if (onProgress) {
        onProgress({
          step: 'planned',
          progress: 10,
          message: `Planned ${sections.length} sections`,
          sections,
        });
      }

      // Step 2: Generate each section
      const generatedSections = [];
      for (let i = 0; i < sections.length; i++) {
        const sectionPlan = sections[i];
        const progress = 10 + ((i + 1) / sections.length) * 70; // 10-80%

        if (onProgress) {
          onProgress({
            step: 'generating',
            progress,
            message: `Generating section ${i + 1} of ${sections.length}: ${sectionPlan.type}`,
            currentSection: sectionPlan,
          });
        }

        // Realize section content
        const realizeResponse = await aiService.realizeSection(sectionPlan, productContext);
        const sectionContent = realizeResponse.data.content;

        // Validate section
        const validateResponse = await aiService.validateSection(sectionPlan, sectionContent);
        const finalContent = validateResponse.data.validation.fixed || sectionContent;

        // Assign media (if media inventory provided)
        let mediaAssignment = null;
        if (mediaInventory.images?.length > 0 || mediaInventory.videos?.length > 0) {
          const mediaResponse = await aiService.assignMediaToSection(
            sectionPlan,
            finalContent,
            mediaInventory
          );
          mediaAssignment = mediaResponse.data.assignment;
        }

        generatedSections.push({
          plan: sectionPlan,
          content: finalContent,
          mediaAssignment,
          validation: validateResponse.data.validation,
        });
      }

      if (onProgress) {
        onProgress({
          step: 'complete',
          progress: 100,
          message: 'All sections generated!',
          sections: generatedSections,
        });
      }

      return {
        success: true,
        sections: generatedSections,
        totalSections: sections.length,
      };
    } catch (error) {
      console.error('Section Builder Error:', error);
      throw error;
    }
  },
};

export default aiService;
