import { useState } from 'react';
import { Settings, X, Wand2, BookOpen } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import AIGenerator from './AIGenerator';
import ExampleManager from './ExampleManager';

/**
 * Settings Panel V2 Component
 * Edit properties, use AI generation, and manage examples
 */
export function SettingsPanelV2({ projectId }) {
  const [activeTab, setActiveTab] = useState('properties');

  const {
    sections,
    selectedSectionId,
    updateSection,
    selectSection,
  } = useEditor();

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings size={20} />
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>Select a section to edit</p>
        </div>
      </div>
    );
  }

  const handleContentChange = (field, value) => {
    updateSection(selectedSection.id, {
      content: {
        ...selectedSection.content,
        [field]: value,
      },
    });
  };

  const handleStyleChange = (field, value) => {
    updateSection(selectedSection.id, {
      styles: {
        ...selectedSection.styles,
        [field]: value,
      },
    });
  };

  const handleConfigChange = (field, value) => {
    updateSection(selectedSection.id, {
      config: {
        ...selectedSection.config,
        [field]: value,
      },
    });
  };

  const handleAIContentGenerated = (content) => {
    // Determine which field to update based on section type
    let field = 'text';
    switch (selectedSection.type) {
      case 'hero':
        field = 'title';
        break;
      case 'cta':
        field = 'heading';
        break;
      case 'features':
        field = 'items';
        break;
      case 'testimonial':
        field = 'quote';
        break;
      default:
        field = 'text';
    }

    handleContentChange(field, content);
  };

  const renderContentFields = () => {
    switch (selectedSection.type) {
      case 'hero':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={selectedSection.content?.title || ''}
                onChange={(e) => handleContentChange('title', e.target.value)}
                placeholder="Enter hero title"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <textarea
                value={selectedSection.content?.subtitle || ''}
                onChange={(e) => handleContentChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
                className="input-field resize-none"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <input
                type="color"
                value={selectedSection.styles?.bgColor || '#3B82F6'}
                onChange={(e) => handleStyleChange('bgColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </>
        );

      case 'text':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <textarea
                value={selectedSection.content?.text || ''}
                onChange={(e) => handleContentChange('text', e.target.value)}
                placeholder="Enter your text here"
                className="input-field resize-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={selectedSection.styles?.fontSize || 'base'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="input-field"
              >
                <option value="sm">Small (14px)</option>
                <option value="base">Normal (16px)</option>
                <option value="lg">Large (18px)</option>
                <option value="xl">Extra Large (20px)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={selectedSection.styles?.color || '#1F2937'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
              />
            </div>
          </>
        );

      case 'cta':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={selectedSection.content?.heading || ''}
                onChange={(e) => handleContentChange('heading', e.target.value)}
                placeholder="CTA Heading"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedSection.content?.description || ''}
                onChange={(e) => handleContentChange('description', e.target.value)}
                placeholder="CTA Description"
                className="input-field resize-none"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={selectedSection.content?.buttonText || 'Learn More'}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="url"
                value={selectedSection.content?.buttonLink || '#'}
                onChange={(e) => handleContentChange('buttonLink', e.target.value)}
                placeholder="https://example.com"
                className="input-field"
              />
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={selectedSection.content?.imageUrl || ''}
                onChange={(e) => handleContentChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={selectedSection.content?.altText || ''}
                onChange={(e) => handleContentChange('altText', e.target.value)}
                placeholder="Image description"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <select
                value={selectedSection.styles?.height || 'medium'}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                className="input-field"
              >
                <option value="small">Small (200px)</option>
                <option value="medium">Medium (400px)</option>
                <option value="large">Large (600px)</option>
              </select>
            </div>
          </>
        );

      default:
        return (
          <div className="text-gray-500 text-sm">
            <p>No additional settings for this section type.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Settings size={20} />
          Properties
        </h2>
        <button
          onClick={() => selectSection(null)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex bg-gray-50">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings size={16} className="inline mr-2" />
          Properties
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Wand2 size={16} className="inline mr-2" />
          AI
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'examples'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen size={16} className="inline mr-2" />
          Learn
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            {/* Section Info */}
            <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {selectedSection.type} Section
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  ID: {selectedSection.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Customize the content and styling below
              </p>
            </div>

            {/* Content Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Content</h3>
              <div className="space-y-3">
                {renderContentFields()}
              </div>
            </div>

            {/* Common Styles */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Spacing</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Padding
                  </label>
                  <select
                    value={selectedSection.styles?.padding || 'md'}
                    onChange={(e) => handleStyleChange('padding', e.target.value)}
                    className="input-field"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margin Bottom
                  </label>
                  <select
                    value={selectedSection.styles?.marginBottom || 'md'}
                    onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
                    className="input-field"
                  >
                    <option value="none">None</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="p-4">
            <AIGenerator sectionType={selectedSection.type} onContentGenerated={handleAIContentGenerated} />
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="p-4">
            <ExampleManager sectionType={selectedSection.type} />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 text-xs text-gray-600">
        <p>💾 Changes saved automatically</p>
      </div>
    </div>
  );
}

export default SettingsPanelV2;
