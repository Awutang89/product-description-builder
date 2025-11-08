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
   * Section Builder Framework Methods
   */

  /**
   * Plan sections for product page
   * Analyzes product data and determines which sections to generate (2-8 sections)
   */
  planSections: async (productContext, mediaInventory = {}) => {
    const response = await api.post('/ai/section-builder/plan-sections', {
      productContext,
      mediaInventory,
    });
    return response.data;
  },

  /**
   * Realize (generate content for) a single section
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
   */
  assignMedia: async (sectionPlan, sectionContent, mediaInventory) => {
    const response = await api.post('/ai/section-builder/assign-media', {
      sectionPlan,
      sectionContent,
      mediaInventory,
    });
    return response.data;
  },

  /**
   * Validate section content
   */
  validateSection: async (sectionPlan, sectionContent) => {
    const response = await api.post('/ai/section-builder/validate-section', {
      sectionPlan,
      sectionContent,
    });
    return response.data;
  },

  /**
   * Generate entire page section-by-section
   * Orchestrates planning, realizing, and validating sections
   */
  generateSectionBuilderPage: async (productContext, mediaInventory, onProgress = null) => {
    // Step 1: Plan sections
    if (onProgress) {
      onProgress({
        step: 'planning',
        progress: 0,
        message: 'Planning optimal section layout...',
        currentSection: null,
      });
    }

    const planResponse = await aiService.planSections(productContext, mediaInventory);
    const sectionPlan = planResponse.data.sections;

    // Step 2: Realize and validate each section
    const generatedSections = [];
    const totalSections = sectionPlan.length;

    for (let i = 0; i < sectionPlan.length; i++) {
      const sectionInfo = sectionPlan[i];
      const progress = Math.round(((i + 1) / totalSections) * 100);

      if (onProgress) {
        onProgress({
          step: 'generating',
          progress,
          message: `Generating ${sectionInfo.type} section...`,
          currentSection: sectionInfo.index,
        });
      }

      try {
        // Generate section content
        const realizeResponse = await aiService.realizeSection(sectionInfo, productContext);
        let sectionContent = realizeResponse.data.content;
        let validation = null;

        // Validate section
        const validateResponse = await aiService.validateSection(sectionInfo, sectionContent);
        if (validateResponse.data.validation) {
          validation = validateResponse.data.validation;
          if (validation.fixed) {
            sectionContent = validation.fixed;
          }
        }

        generatedSections.push({
          plan: sectionInfo,
          content: sectionContent,
          validation: validation,
        });
      } catch (error) {
        console.error(`Failed to generate section ${i + 1}:`, error);
        // Continue with next section even if one fails
      }
    }

    return {
      sections: generatedSections,
    };
  },

};

export default aiService;
