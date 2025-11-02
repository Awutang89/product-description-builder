import { Layers, Type, Image, Grid3x3, MousePointerClick, MessageSquare, Zap } from 'lucide-react';

/**
 * Section Library Component
 * Displays available sections that can be added to the canvas
 */
export function SectionLibrary({ onAddSection }) {
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
  ];

  const categories = ['layout', 'content', 'interaction', 'social'];

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers size={20} />
          Section Library
        </h2>
        <p className="text-xs text-gray-500 mt-1">Drag sections to canvas or click to add</p>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('section-type', section.id);
              }}
              onClick={() => onAddSection(section.id)}
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
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 text-xs text-gray-600">
        <p>💡 Drag & drop to reorder sections</p>
      </div>
    </div>
  );
}

export default SectionLibrary;
