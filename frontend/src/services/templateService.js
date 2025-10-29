import api from './api';

/**
 * Template Service
 * Handles all template-related API calls
 */

export const templateService = {
  /**
   * Create a new template
   */
  createTemplate: async (templateData) => {
    const response = await api.post('/templates', templateData);
    return response.data;
  },

  /**
   * Get all templates with filtering
   */
  getAllTemplates: async (params = {}) => {
    const response = await api.get('/templates', { params });
    return response.data;
  },

  /**
   * Get a single template by ID
   */
  getTemplateById: async (templateId) => {
    const response = await api.get(`/templates/${templateId}`);
    return response.data;
  },

  /**
   * Update a template
   */
  updateTemplate: async (templateId, updates) => {
    const response = await api.put(`/templates/${templateId}`, updates);
    return response.data;
  },

  /**
   * Delete a template
   */
  deleteTemplate: async (templateId) => {
    const response = await api.delete(`/templates/${templateId}`);
    return response.data;
  },

  /**
   * Record template usage
   */
  useTemplate: async (templateId) => {
    const response = await api.post(`/templates/${templateId}/use`);
    return response.data;
  },

  /**
   * Get featured templates
   */
  getFeaturedTemplates: async () => {
    const response = await api.get('/templates/featured');
    return response.data;
  },

  /**
   * Get templates by category
   */
  getTemplatesByCategory: async (category) => {
    const response = await api.get(`/templates/category/${category}`);
    return response.data;
  },

  /**
   * Search templates
   */
  searchTemplates: async (searchTerm) => {
    return templateService.getAllTemplates({ search: searchTerm });
  },

  /**
   * Get templates with filters
   */
  getFilteredTemplates: async (filters = {}) => {
    return templateService.getAllTemplates(filters);
  }
};

export default templateService;
