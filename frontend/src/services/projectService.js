import api from './api';

/**
 * Project Service
 * Handles all project-related API calls
 */

export const projectService = {
  /**
   * Create a new project
   */
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  /**
   * Get all projects with pagination and filtering
   */
  getAllProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  /**
   * Get a single project by ID
   */
  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Update a project
   */
  updateProject: async (projectId, updates) => {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  /**
   * Delete a project
   */
  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Duplicate a project
   */
  duplicateProject: async (projectId, customName = null) => {
    const response = await api.post(`/projects/${projectId}/duplicate`, {
      name: customName
    });
    return response.data;
  },

  /**
   * Search projects
   */
  searchProjects: async (searchTerm) => {
    return projectService.getAllProjects({ search: searchTerm });
  }
};

export default projectService;
