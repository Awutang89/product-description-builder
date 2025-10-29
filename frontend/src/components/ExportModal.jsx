import { useState, useEffect } from 'react';
import { X, Download, Copy, Eye, FileJson, Code } from 'lucide-react';
import exportService from '../services/exportService';

/**
 * Export Modal Component
 * UI for exporting projects in various formats
 */
export function ExportModal({ isOpen, onClose, projectId, sections, projectData }) {
  const [selectedFormat, setSelectedFormat] = useState('html');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formats, setFormats] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(null);

  // Load available formats
  useEffect(() => {
    if (isOpen) {
      loadFormats();
      generatePreview('html');
    }
  }, [isOpen]);

  const loadFormats = async () => {
    try {
      const response = await exportService.getFormats();
      setFormats(response.data.formats || []);
    } catch (error) {
      console.error('Failed to load formats:', error);
    }
  };

  const generatePreview = async (format) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await exportService.previewExport(sections, projectData, format);
      setPreview(response.data);
      setSelectedFormat(format);
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to generate preview');
      console.error('Preview error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      let filename = '';
      const projectName = projectData?.name || 'product_description';
      const safeFilename = projectName.replace(/\s+/g, '_');

      let content;
      let contentType = 'text/html';

      switch (selectedFormat) {
        case 'html':
          const htmlResp = await fetch(
            `/api/export/projects/${projectId}/html`
          );
          content = await htmlResp.text();
          filename = `${safeFilename}.html`;
          break;

        case 'document':
          const docResp = await fetch(
            `/api/export/projects/${projectId}/document`
          );
          content = await docResp.text();
          filename = `${safeFilename}_document.html`;
          break;

        case 'shopify':
          const shopifyResp = await exportService.exportShopify(projectId);
          content = shopifyResp.data.html;
          filename = `${safeFilename}_shopify.html`;
          break;

        case 'css':
          const cssResp = await fetch(`/api/export/projects/${projectId}/css`);
          content = await cssResp.text();
          filename = `${safeFilename}.css`;
          contentType = 'text/css';
          break;

        default:
          return;
      }

      exportService.downloadFile(content, filename, contentType);
    } catch (error) {
      setError('Failed to download file');
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!preview?.html) return;

    const result = await exportService.copyToClipboard(preview.html);

    if (result.success) {
      setCopiedFormat(selectedFormat);
      setTimeout(() => setCopiedFormat(null), 2000);
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  const currentFormat = formats.find((f) => f.id === selectedFormat) || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Project</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose a format and download or copy your project
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Format</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => generatePreview(format.id)}
                  disabled={isLoading}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {format.id === 'html' && <Code size={20} className="text-blue-500" />}
                      {format.id === 'document' && <FileJson size={20} className="text-green-500" />}
                      {format.id === 'shopify' && <FileJson size={20} className="text-purple-500" />}
                      {format.id === 'css' && <Code size={20} className="text-orange-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{format.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Details */}
          {currentFormat && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">File Type</p>
                  <p className="font-medium text-gray-900">{currentFormat.extension}</p>
                </div>
                <div>
                  <p className="text-gray-600">Content Type</p>
                  <p className="font-medium text-gray-900">{currentFormat.contentType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Preview</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Eye size={16} />
                {showPreview ? 'Hide' : 'Show'}
              </button>
            </div>

            {showPreview && preview && (
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-200">
                {selectedFormat === 'shopify' || selectedFormat === 'html' || selectedFormat === 'document' ? (
                  <div className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words line-clamp-10">
                    {preview.html?.substring(0, 500)}...
                  </div>
                ) : (
                  <div className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words line-clamp-10">
                    {preview.css?.substring(0, 500)}...
                  </div>
                )}
              </div>
            )}

            {isLoading && (
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Info Box */}
          {selectedFormat === 'shopify' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                <strong>Shopify Tip:</strong> This format is optimized for Shopify product
                descriptions. Paste the HTML directly into your product description field.
              </p>
            </div>
          )}

          {selectedFormat === 'html' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>HTML Fragment:</strong> Use this to embed your content into an existing
                HTML page. Pair with the CSS export for complete styling.
              </p>
            </div>
          )}

          {selectedFormat === 'document' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <strong>Complete Document:</strong> This is a standalone HTML file with all
                styling included. Open it directly in a browser.
              </p>
            </div>
          )}

          {selectedFormat === 'css' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-900">
                <strong>CSS Only:</strong> Use this to get just the styles. Useful if you
                already have the HTML and need styling only.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
          <button
            onClick={handleCopy}
            disabled={isLoading || !preview}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
          >
            <Copy size={18} />
            {copiedFormat === selectedFormat ? 'Copied!' : 'Copy to Clipboard'}
          </button>

          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium"
          >
            <Download size={18} />
            {isLoading ? 'Processing...' : 'Download'}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
