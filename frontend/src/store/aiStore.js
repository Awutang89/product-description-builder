import { create } from 'zustand';
import aiService from '../services/aiService';

/**
 * AI Store
 * Manages AI content generation and example state
 */
export const useAIStore = create((set, get) => ({
  // Content Generation State
  generatedContent: null,
  variations: [],
  isGenerating: false,
  error: null,

  // Examples State
  examples: [],
  selectedExamples: [],
  isLoadingExamples: false,

  // Current Task State
  currentPrompt: '',
  currentSectionType: null,
  currentScore: null,

  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Generate content
  generateContent: async (prompt, sectionType, exampleIds = []) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await aiService.generateContent(prompt, sectionType, exampleIds);
      set({
        generatedContent: response.data,
        currentPrompt: prompt,
        currentSectionType: sectionType,
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to generate content',
        isGenerating: false,
      });
      throw error;
    }
  },

  // Generate variations
  generateVariations: async (prompt, sectionType, count = 3, exampleIds = []) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await aiService.generateVariations(
        prompt,
        sectionType,
        count,
        exampleIds
      );
      set({
        variations: response.data.variations,
        isGenerating: false,
      });
      return response.data.variations;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to generate variations',
        isGenerating: false,
      });
      throw error;
    }
  },

  // Score content
  scoreContent: async (content, sectionType, criteria = []) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await aiService.scoreContent(content, sectionType, criteria);
      set({
        currentScore: response.data,
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to score content',
        isGenerating: false,
      });
      throw error;
    }
  },

  // Refine content
  refineContent: async (originalContent, feedback, sectionType, exampleIds = []) => {
    set({ isGenerating: true, error: null });
    try {
      const response = await aiService.refineContent(
        originalContent,
        feedback,
        sectionType,
        exampleIds
      );
      set({
        generatedContent: response.data,
        isGenerating: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to refine content',
        isGenerating: false,
      });
      throw error;
    }
  },

  /**
   * Example Management
   */

  // Fetch examples
  fetchExamples: async (filters = {}) => {
    set({ isLoadingExamples: true, error: null });
    try {
      const response = await aiService.getExamples(filters);
      set({
        examples: response.data.examples,
        isLoadingExamples: false,
      });
      return response.data.examples;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch examples',
        isLoadingExamples: false,
      });
      throw error;
    }
  },

  // Fetch examples by type
  fetchExamplesByType: async (sectionType, category = null) => {
    set({ isLoadingExamples: true, error: null });
    try {
      const response = await aiService.getExamplesByType(sectionType, category);
      set({
        examples: response.data.examples,
        isLoadingExamples: false,
      });
      return response.data.examples;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to fetch examples',
        isLoadingExamples: false,
      });
      throw error;
    }
  },

  // Select examples for generation
  selectExamples: (exampleIds) => {
    set({ selectedExamples: exampleIds });
  },

  // Toggle example selection
  toggleExample: (exampleId) => {
    const { selectedExamples } = get();
    const isSelected = selectedExamples.includes(exampleId);
    set({
      selectedExamples: isSelected
        ? selectedExamples.filter((id) => id !== exampleId)
        : [...selectedExamples, exampleId],
    });
  },

  // Create example
  createExample: async (exampleData) => {
    set({ error: null });
    try {
      const response = await aiService.createExample(exampleData);
      // Refresh examples list
      const { examples } = get();
      set({
        examples: [response.data, ...examples],
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to create example',
      });
      throw error;
    }
  },

  // Update example
  updateExample: async (exampleId, updates) => {
    set({ error: null });
    try {
      const response = await aiService.updateExample(exampleId, updates);
      const { examples } = get();
      set({
        examples: examples.map((ex) => (ex._id === exampleId ? response.data : ex)),
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to update example',
      });
      throw error;
    }
  },

  // Delete example
  deleteExample: async (exampleId) => {
    set({ error: null });
    try {
      await aiService.deleteExample(exampleId);
      const { examples, selectedExamples } = get();
      set({
        examples: examples.filter((ex) => ex._id !== exampleId),
        selectedExamples: selectedExamples.filter((id) => id !== exampleId),
      });
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to delete example',
      });
      throw error;
    }
  },

  // Approve example
  approveExample: async (exampleId, feedback = '') => {
    set({ error: null });
    try {
      const response = await aiService.approveExample(exampleId, feedback);
      const { examples } = get();
      set({
        examples: examples.map((ex) => (ex._id === exampleId ? response.data : ex)),
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to approve example',
      });
      throw error;
    }
  },

  // Search examples
  searchExamples: async (searchTerm, sectionType = null) => {
    set({ isLoadingExamples: true, error: null });
    try {
      const response = await aiService.searchExamples(searchTerm, sectionType);
      set({
        examples: response.data.examples,
        isLoadingExamples: false,
      });
      return response.data.examples;
    } catch (error) {
      set({
        error: error.response?.data?.error?.message || 'Failed to search examples',
        isLoadingExamples: false,
      });
      throw error;
    }
  },

  // Clear generated content
  clearGeneratedContent: () => {
    set({
      generatedContent: null,
      variations: [],
      currentPrompt: '',
      currentScore: null,
    });
  },
}));

export default useAIStore;
