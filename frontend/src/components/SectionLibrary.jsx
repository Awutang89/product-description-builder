import { useState } from 'react';
import { Layers, Type, Image, Grid3x3, MousePointerClick, MessageSquare, Zap, Sparkles, Loader } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import aiService from '../services/aiService';

/**
 * Section Library Component
 * Displays available sections that can be added to the canvas
 * Offers AI content generation for user-added sections
 */
export function SectionLibrary({ onAddSection }) {
  const { projectContext, addSection } = useEditor();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedForAI, setSelectedForAI] = useState(null);
  const sections = [
    {
      id: 'hero',
      name: 'Hero',
      description: 'Large header with title and subtitle',
      icon: Zap,
      category: 'layout',
    },
    {
      id: 'features',
      name: 'Features',
      description: 'Highlight key features or benefits',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'text',
      name: 'Text Block',
      description: 'Rich text content section',
      icon: Type,
      category: 'content',
    },
    {
      id: 'image',
      name: 'Image',
      description: 'Display single or multiple images',
      icon: Image,
      category: 'content',
    },
    {
      id: 'gallery',
      name: 'Gallery',
      description: 'Image carousel or grid',
      icon: Layers,
      category: 'content',
    },
    {
      id: 'cta',
      name: 'Button',
      description: 'Single action button with link',
      icon: MousePointerClick,
      category: 'interaction',
    },
    {
      id: 'testimonial',
      name: 'Testimonial',
      description: 'Customer review or quote',
      icon: MessageSquare,
      category: 'social',
    },
    {
      id: 'comparison',
      name: 'Comparison',
      description: 'Feature comparison table',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'twoColumn',
      name: 'Two Column w/ Image',
      description: 'Two columns with text and image',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'sideBySide',
      name: 'Side by Side Text w/ Image',
      description: 'Two columns with images and text below',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'threeColumns',
      name: 'Three Columns w/ Images',
      description: 'Three columns with text and images',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'fourColumns',
      name: 'Four Columns w/ Images',
      description: 'Four columns with text and images',
      icon: Grid3x3,
      category: 'content',
    },
    {
      id: 'twoColumnHighlight',
      name: 'Two Column Highlight',
      description: 'Highlight feature with text and image/video',
      icon: Grid3x3,
      category: 'content',
    },
  ];

  const categories = ['layout', 'content', 'interaction', 'social'];

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  const handleAddWithAI = async (sectionId) => {
    if (!projectContext.productTitle || !projectContext.productDescription) {
      onAddSection(sectionId);
      return;
    }

    setSelectedForAI(sectionId);
    setIsGenerating(true);
    setError(null);

    try {
      const response = await aiService.generateUserAddedSectionContent(
        sectionId,
        projectContext.productTitle,
        projectContext.productDescription,
        projectContext.secondaryKeywords || [],
        projectContext.mediaInventory || {},
        {}
      );

      if (response.success) {
        // Add section with AI-generated content
        addSection(sectionId, {
          type: sectionId,
          content: response.data.content,
          config: {},
          styles: {
            padding: 'md',
            marginBottom: 'md',
          },
        });
        onAddSection(sectionId);
      }
    } catch (err) {
      console.error('Failed to generate section content:', err);
      setError(`Failed to generate ${sectionId} content. Adding empty section instead.`);
      // Fall back to adding empty section
      onAddSection(sectionId);
    } finally {
      setIsGenerating(false);
      setSelectedForAI(null);
    }
  };

  const handleAddEmpty = (sectionId) => {
    // Add empty section (original behavior)
    addSection(sectionId);
    onAddSection(sectionId);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers size={20} />
          Section Library
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {projectContext.productTitle ? 'Click to add with AI or drag for empty' : 'Drag sections to canvas or click to add'}
        </p>
        {error && (
          <p className="text-xs text-red-600 mt-2">{error}</p>
        )}
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const hasContext = projectContext.productTitle && projectContext.productDescription;
          const isGeneratingThis = isGenerating && selectedForAI === section.id;

          return (
            <div key={section.id}>
              {hasContext ? (
                // With AI option
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddWithAI(section.id)}
                    disabled={isGenerating}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'copy';
                      e.dataTransfer.setData('section-type', section.id);
                    }}
                    className="flex-1 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-400 rounded-lg cursor-grab active:cursor-grabbing transition-colors group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <div className="flex items-start gap-3">
                      {isGeneratingThis ? (
                        <Loader size={18} className="text-blue-600 animate-spin flex-shrink-0 mt-0.5" />
                      ) : (
                        <>
                          <Icon size={18} className="text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">{section.name}</p>
                            <p className="text-xs text-gray-600 line-clamp-1">{section.description}</p>
                          </div>
                          <Sparkles size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => handleAddEmpty(section.id)}
                    disabled={isGenerating}
                    title="Add empty section"
                    className="px-3 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-gray-600 hover:text-gray-900 font-medium text-sm">+</span>
                  </button>
                </div>
              ) : (
                // Original style - no AI option
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('section-type', section.id);
                  }}
                  onClick={() => handleAddEmpty(section.id)}
                  className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg cursor-grab active:cursor-grabbing transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      size={18}
                      className="text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 group-hover:text-blue-900">
                        {section.name}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SectionLibrary;
