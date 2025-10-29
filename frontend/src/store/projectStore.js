import { create } from 'zustand';
import projectService from '../services/projectService';

/**
 * Project Store
 * Manages global project state using Zustand
 */
export const useProjectStore = create((set, get) => ({
  // State
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  },
  searchTerm: '',
  filterDraft: null,
  sortBy: '-createdAt',

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setFilterDraft: (filterDraft) => set({ filterDraft, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),

  // Fetch all projects
  fetchProjects: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { searchTerm, filterDraft, sortBy } = get();

      const queryParams = {
        page: params.page || get().pagination.currentPage,
        limit: 20,
        sort: params.sort || sortBy,
        ...params,
      };

      if (searchTerm) queryParams.search = searchTerm;
      if (filterDraft !== null) queryParams.isDraft = filterDraft;

      const response = await projectService.getAllProjects(queryParams);

      set({
        projects: response.data.projects,
        pagination: response.data.pagination,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch projects',
        loading: false,
      });
    }
  },

  // Create project
  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.createProject(projectData);
      const { projects } = get();
      set({
        projects: [response.data, ...projects],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to create project',
        loading: false,
      });
      throw error;
    }
  },

  // Get single project
  getProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.getProjectById(projectId);
      set({
        selectedProject: response.data,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch project',
        loading: false,
      });
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.updateProject(projectId, updates);
      const { projects, selectedProject } = get();

      set({
        projects: projects.map((p) => (p._id === projectId ? response.data : p)),
        selectedProject: selectedProject?._id === projectId ? response.data : selectedProject,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to update project',
        loading: false,
      });
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await projectService.deleteProject(projectId);
      const { projects } = get();

      set({
        projects: projects.filter((p) => p._id !== projectId),
        selectedProject: null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to delete project',
        loading: false,
      });
      throw error;
    }
  },

  // Duplicate project
  duplicateProject: async (projectId, customName = null) => {
    set({ loading: true, error: null });
    try {
      const response = await projectService.duplicateProject(projectId, customName);
      const { projects } = get();

      set({
        projects: [response.data, ...projects],
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to duplicate project',
        loading: false,
      });
      throw error;
    }
  },

  // Set page
  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page }
  })),

  // Clear selected project
  clearSelectedProject: () => set({ selectedProject: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));
