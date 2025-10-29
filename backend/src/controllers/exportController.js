import exportService from '../services/exportService.js';
import Project from '../models/Project.js';

/**
 * Export Controller
 * Handles project export to various formats
 */

/**
 * Export project as HTML
 * GET /api/export/projects/:id/html
 */
export const exportHTML = async (req, res) => {
  try {
    const { id } = req.params;
    const { responsive = true } = req.query;

    // Get project
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    // Generate HTML
    const result = exportService.generateHTML(project.sections || [], project, {
      responsive: responsive === 'true',
      format: 'html',
    });

    // Return as attachment
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${project.name.replace(/\s+/g, '_')}.html"`
    );

    return res.status(200).send(result.html);
  } catch (error) {
    console.error('Export HTML Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Failed to export HTML',
      },
    });
  }
};

/**
 * Export project as complete HTML document
 * GET /api/export/projects/:id/document
 */
export const exportDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const html = exportService.generateHTMLDocument(project.sections || [], project);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${project.name.replace(/\s+/g, '_')}_document.html"`
    );

    return res.status(200).send(html);
  } catch (error) {
    console.error('Export Document Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Failed to export document',
      },
    });
  }
};

/**
 * Export project as Shopify HTML
 * GET /api/export/projects/:id/shopify
 */
export const exportShopify = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const result = exportService.generateShopifyHTML(project.sections || [], project);

    // Return as JSON with HTML content (easy to copy)
    return res.status(200).json({
      success: true,
      data: {
        html: result.html,
        type: 'shopify',
        projectName: project.name,
        sections: project.sections.length,
      },
      message: 'Project exported for Shopify',
    });
  } catch (error) {
    console.error('Export Shopify Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Failed to export for Shopify',
      },
    });
  }
};

/**
 * Preview export
 * POST /api/export/preview
 */
export const previewExport = async (req, res) => {
  try {
    const { sections, projectData, format = 'html' } = req.body;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Sections array is required',
        },
      });
    }

    let result;
    switch (format) {
      case 'shopify':
        result = exportService.generateShopifyHTML(sections, projectData);
        break;
      case 'document':
        result = {
          success: true,
          html: exportService.generateHTMLDocument(sections, projectData),
        };
        break;
      default:
        result = exportService.generateHTML(sections, projectData, {
          format: 'html',
          includeStyles: true,
        });
    }

    return res.status(200).json({
      success: true,
      data: {
        html: result.html,
        css: result.css || '',
        format,
      },
      message: 'Preview generated successfully',
    });
  } catch (error) {
    console.error('Preview Export Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'PREVIEW_ERROR',
        message: 'Failed to generate preview',
      },
    });
  }
};

/**
 * Export as CSS
 * GET /api/export/projects/:id/css
 */
export const exportCSS = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const result = exportService.generateHTML(project.sections || [], project, {
      includeStyles: true,
    });

    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${project.name.replace(/\s+/g, '_')}.css"`
    );

    return res.status(200).send(result.css);
  } catch (error) {
    console.error('Export CSS Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_ERROR',
        message: 'Failed to export CSS',
      },
    });
  }
};

/**
 * Get export formats info
 * GET /api/export/formats
 */
export const getExportFormats = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      formats: [
        {
          id: 'html',
          name: 'HTML Fragment',
          description: 'HTML without document wrapper - perfect for pasting into existing pages',
          extension: '.html',
          contentType: 'text/html',
        },
        {
          id: 'document',
          name: 'Complete HTML Document',
          description: 'Full HTML document with head, body, and styling',
          extension: '.html',
          contentType: 'text/html',
        },
        {
          id: 'shopify',
          name: 'Shopify Product Description',
          description: 'HTML optimized for Shopify product description field',
          extension: '.html',
          contentType: 'text/html',
        },
        {
          id: 'css',
          name: 'CSS Stylesheet',
          description: 'Extracted CSS styles for all sections',
          extension: '.css',
          contentType: 'text/css',
        },
      ],
    },
    message: 'Export formats retrieved',
  });
};

export default {
  exportHTML,
  exportDocument,
  exportShopify,
  previewExport,
  exportCSS,
  getExportFormats,
};
