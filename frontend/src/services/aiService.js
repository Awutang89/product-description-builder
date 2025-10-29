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
};

export default aiService;
