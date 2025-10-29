import api from './api';

/**
 * Export Service
 * Handles all export-related API calls
 */

export const exportService = {
  /**
   * Get available export formats
   */
  getFormats: async () => {
    const response = await api.get('/export/formats');
    return response.data;
  },

  /**
   * Preview export before download
   */
  previewExport: async (sections, projectData = {}, format = 'html') => {
    const response = await api.post('/export/preview', {
      sections,
      projectData,
      format,
    });
    return response.data;
  },

  /**
   * Export as HTML fragment
   */
  exportHTML: async (projectId) => {
    const response = await api.get(`/export/projects/${projectId}/html`);
    return response;
  },

  /**
   * Export as complete HTML document
   */
  exportDocument: async (projectId) => {
    const response = await api.get(`/export/projects/${projectId}/document`);
    return response;
  },

  /**
   * Export for Shopify
   */
  exportShopify: async (projectId) => {
    const response = await api.get(`/export/projects/${projectId}/shopify`);
    return response.data;
  },

  /**
   * Export CSS only
   */
  exportCSS: async (projectId) => {
    const response = await api.get(`/export/projects/${projectId}/css`);
    return response;
  },

  /**
   * Download file helper
   */
  downloadFile: (content, filename, contentType = 'text/html') => {
    const blob = new Blob([content], { type: `${contentType}; charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Copy to clipboard
   */
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, message: 'Copied to clipboard!' };
    } catch (error) {
      return { success: false, message: 'Failed to copy' };
    }
  },
};

export default exportService;
