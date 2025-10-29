import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import projectService from '../services/projectService';

/**
 * Editor Store
 * Manages editor state and canvas operations
 */
export const useEditor = create((set, get) => ({
  // State
  projectId: null,
  project: null,
  sections: [],
  selectedSectionId: null,
  isDirty: false,
  isSaving: false,
  error: null,

  // Initialize editor with project
  initializeEditor: async (projectId) => {
    set({ projectId, isSaving: true });
    try {
      const response = await projectService.getProjectById(projectId);
      const project = response.data;

      set({
        project,
        sections: project.sections || [],
        isDirty: false,
        isSaving: false,
      });
    } catch (error) {
      set({
        error: 'Failed to load project',
        isSaving: false,
      });
      throw error;
    }
  },

  // Add new section
  addSection: (sectionType) => {
    const newSection = {
      id: uuidv4(),
      type: sectionType,
      order: get().sections.length,
      config: {},
      content: {},
      styles: {
        padding: 'md',
        marginBottom: 'md',
      },
    };

    set((state) => ({
      sections: [...state.sections, newSection],
      isDirty: true,
    }));
  },

  // Remove section
  removeSection: (sectionId) => {
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
      selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
      isDirty: true,
    }));
  },

  // Update section
  updateSection: (sectionId, updates) => {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              ...updates,
              content: { ...s.content, ...updates.content },
              styles: { ...s.styles, ...updates.styles },
              config: { ...s.config, ...updates.config },
            }
          : s
      ),
      isDirty: true,
    }));
  },

  // Duplicate section
  duplicateSection: (sectionId) => {
    const section = get().sections.find((s) => s.id === sectionId);
    if (!section) return;

    const duplicated = {
      ...section,
      id: uuidv4(),
      order: section.order + 1,
    };

    set((state) => {
      // Update order for sections after the original
      const newSections = state.sections.map((s) =>
        s.order > section.order ? { ...s, order: s.order + 1 } : s
      );
      newSections.splice(section.order + 1, 0, duplicated);

      return {
        sections: newSections,
        isDirty: true,
      };
    });
  },

  // Reorder sections
  reorderSections: (sourceIndex, destIndex) => {
    set((state) => {
      const newSections = Array.from(state.sections);
      const [removed] = newSections.splice(sourceIndex, 1);
      newSections.splice(destIndex, 0, removed);

      // Update order values
      const updatedSections = newSections.map((s, idx) => ({
        ...s,
        order: idx,
      }));

      return {
        sections: updatedSections,
        isDirty: true,
      };
    });
  },

  // Select section
  selectSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },

  // Save project
  saveProject: async () => {
    const state = get();
    if (!state.isDirty || !state.projectId) return;

    set({ isSaving: true, error: null });
    try {
      await projectService.updateProject(state.projectId, {
        sections: state.sections.map((s, idx) => ({
          ...s,
          order: idx,
        })),
      });

      set({
        isDirty: false,
        isSaving: false,
      });
    } catch (error) {
      set({
        error: 'Failed to save project',
        isSaving: false,
      });
      throw error;
    }
  },

  // Auto-save project (debounced)
  autoSave: async () => {
    const state = get();
    if (state.isDirty) {
      await state.saveProject();
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset editor
  resetEditor: () => {
    set({
      projectId: null,
      project: null,
      sections: [],
      selectedSectionId: null,
      isDirty: false,
      isSaving: false,
      error: null,
    });
  },
}));
