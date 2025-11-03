import { useState } from 'react';
import { Trash2, Copy, Move, Zap } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import AIGeneratorModal from './AIGeneratorModal';

/**
 * Canvas Component
 * Main editing canvas where sections are displayed and managed
 */
export function Canvas({ projectId }) {
  const [showAIModal, setShowAIModal] = useState(false);

  const {
    sections,
    selectedSectionId,
    addSection,
    removeSection,
    duplicateSection,
    reorderSections,
    selectSection,
  } = useEditor();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sectionType = e.dataTransfer.getData('section-type');
    if (sectionType) {
      addSection(sectionType);
    }
  };

  const getSectionPreview = (section) => {
    switch (section.type) {
      case 'hero':
        return (
          <div
            className="p-12 rounded text-center"
            style={{
              backgroundColor: section.styles?.bgColor || '#3B82F6',
              color: section.styles?.textColor || '#FFFFFF'
            }}
          >
            <h2
              className="font-bold mb-2"
              style={{ fontSize: `${section.styles?.titleSize || 40}px` }}
            >
              {section.content?.title || 'Hero Title'}
            </h2>
            <p
              className="opacity-90"
              style={{ fontSize: `${section.styles?.subtitleSize || 16}px` }}
            >
              {section.content?.subtitle || 'Hero subtitle goes here'}
            </p>
          </div>
        );
      case 'text':
        return (
          <div
            className="p-8 bg-gray-50 rounded prose prose-sm max-w-none"
            style={{ color: section.styles?.color || '#374151' }}
            dangerouslySetInnerHTML={{
              __html: section.content?.text || '<p>Sample text content. Add your own text here to customize this section.</p>'
            }}
          />
        );
      case 'features': {
        const features = section.content?.features || [{}, {}, {}];
        const gridCols = {
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4'
        }[features.length] || 'grid-cols-3';

        const renderFeatureTitle = (feature, index) => {
          const headingLevel = feature.headingLevel || 'h3';
          const titleText = feature.title || `Feature ${index + 1}`;
          const titleClass = 'font-semibold text-gray-900';

          const HeadingTag = headingLevel;

          const headingSizes = {
            h1: 'text-lg',
            h2: 'text-base',
            h3: 'text-sm',
            h4: 'text-xs'
          };

          return (
            <HeadingTag className={`${titleClass} ${headingSizes[headingLevel]}`}>
              {titleText}
            </HeadingTag>
          );
        };

        return (
          <div className={`grid ${gridCols} gap-4 p-6`}>
            {features.map((feature, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded text-center">
                {feature.icon ? (
                  <img
                    src={feature.icon}
                    alt={feature.title || `Feature ${i + 1}`}
                    className="w-12 h-12 rounded mx-auto mb-2 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-200 rounded mx-auto mb-2"></div>
                )}
                {renderFeatureTitle(feature, i)}
                {feature.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }
      case 'image':
        return (
          <div className="bg-gray-100 rounded flex items-center justify-center h-64">
            <div className="text-center text-gray-400">
              <p className="text-lg">🖼️ Image Section</p>
              <p className="text-sm">Click to upload</p>
            </div>
          </div>
        );
      case 'gallery': {
        const media = section.content?.media || [{}, {}, {}];
        const gridCols = {
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4'
        }[media.length] || 'grid-cols-3';

        return (
          <div className={`grid ${gridCols} gap-3 p-4`}>
            {media.map((item, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  item.url ? (
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: item.url }}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p className="text-sm">🎬 Video</p>
                    </div>
                  )
                ) : (
                  <img
                    src={item.url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                    alt={item.altText || `Gallery item ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        );
      }
      case 'cta':
        return (
          <div className="p-6 flex items-center justify-center">
            <a
              href={section.content?.buttonLink || '#'}
              className="btn-primary inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              {section.content?.buttonText || 'Shop Now'}
            </a>
          </div>
        );
      case 'testimonial': {
        const testimonials = section.content?.testimonials || [
          { quote: 'Great product! Highly recommended.', author: 'Customer Name' }
        ];
        const gridCols = {
          1: 'grid-cols-1 max-w-2xl mx-auto',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4'
        }[testimonials.length] || 'grid-cols-1';

        return (
          <div className={`grid ${gridCols} gap-6 p-6 w-full`}>
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-yellow-50 p-6 rounded border border-yellow-200 flex flex-col items-center text-center h-full">
                {testimonial.photo && (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.author || `Reviewer ${i + 1}`}
                    className="h-16 w-16 object-cover rounded-full border-2 border-yellow-200 mb-4 flex-shrink-0"
                  />
                )}
                <p className="text-gray-700 italic mb-4 flex-1">
                  "{testimonial.quote || 'Great product! Highly recommended.'}"
                </p>
                <div className="w-full">
                  <p className="font-semibold text-gray-900">
                    — {testimonial.author || 'Customer Name'}
                  </p>
                  {testimonial.authorTitle && (
                    <p className="text-xs text-gray-600">
                      {testimonial.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 'comparison':
        const table = section.content?.table || {
          headers: ['Feature', 'Basic', 'Pro'],
          rows: [['Feature A', '✓', '✓']]
        };
        const colCount = table.headers?.length || 3;
        const colWidthClass = {
          2: 'w-1/2',
          3: 'w-1/3',
          4: 'w-1/4',
          5: 'w-1/5'
        }[colCount] || 'w-1/3';

        return (
          <div className="p-6 bg-gray-50 rounded overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  {table.headers?.map((header, i) => (
                    <th
                      key={i}
                      className={`${colWidthClass} text-left py-3 px-2 font-semibold ${i === 0 ? 'text-left' : 'text-center'}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows?.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
                    {row?.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`${colWidthClass} py-3 px-2 ${colIndex === 0 ? 'text-left' : 'text-center'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'twoColumn':
        return (
          <div className="grid grid-cols-2 gap-6 p-6">
            {section.styles?.imagePosition === 'left' ? (
              <>
                <img
                  src={section.content?.rightImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                  alt="Column image"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-gray-700 text-sm">{section.content?.leftText || 'Column text here'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center">
                  <p className="text-gray-700 text-sm">{section.content?.leftText || 'Column text here'}</p>
                </div>
                <img
                  src={section.content?.rightImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                  alt="Column image"
                  className="w-full h-48 object-cover rounded"
                />
              </>
            )}
          </div>
        );

      case 'sideBySide':
        return (
          <div className="grid grid-cols-2 gap-6 p-6">
            <div className="text-center">
              <img
                src={section.content?.col1Image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                alt="Column 1"
                className="w-full h-48 object-cover rounded mb-3"
              />
              <p className="text-gray-700 text-xs">{section.content?.col1Text || 'Column 1 text'}</p>
            </div>
            <div className="text-center">
              <img
                src={section.content?.col2Image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                alt="Column 2"
                className="w-full h-48 object-cover rounded mb-3"
              />
              <p className="text-gray-700 text-xs">{section.content?.col2Text || 'Column 2 text'}</p>
            </div>
          </div>
        );

      case 'threeColumns':
        return (
          <div className="grid grid-cols-3 gap-4 p-6">
            {[1, 2, 3].map((colNum) => (
              <div key={colNum} className="text-center">
                <img
                  src={section.content?.[`col${colNum}Image`] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                  alt={`Column ${colNum}`}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p className="text-gray-700 text-xs">{section.content?.[`col${colNum}Text`] || `Column ${colNum}`}</p>
              </div>
            ))}
          </div>
        );

      case 'fourColumns':
        return (
          <div className="grid grid-cols-4 gap-3 p-6">
            {[1, 2, 3, 4].map((colNum) => (
              <div key={colNum} className="text-center">
                <img
                  src={section.content?.[`col${colNum}Image`] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                  alt={`Column ${colNum}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-gray-700 text-xs">{section.content?.[`col${colNum}Text`] || `Col ${colNum}`}</p>
              </div>
            ))}
          </div>
        );

      case 'twoColumnHighlight':
        return (
          <div className="grid grid-cols-2 gap-8 p-6 items-center">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: section.content?.richText || '<p>Rich text content here</p>'
              }}
            />
            {section.content?.mediaType === 'video' ? (
              <div
                className="w-full h-64 rounded overflow-hidden"
                dangerouslySetInnerHTML={{ __html: section.content?.mediaUrl || '<div className="bg-gray-300 w-full h-64"></div>' }}
              />
            ) : (
              <img
                src={section.content?.mediaUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3C/svg%3E'}
                alt="Media"
                className="w-full h-64 object-cover rounded"
              />
            )}
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
            <p>{section.type} section</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
      {/* Canvas Header */}
      <div className="border-b border-gray-200 p-4 bg-white flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Canvas Preview</h2>
        <button
          onClick={() => setShowAIModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Zap size={18} />
          AI Generate
        </button>
      </div>

      {/* AI Generator Modal */}
      <AIGeneratorModal isOpen={showAIModal} onClose={() => setShowAIModal(false)} projectId={projectId} />

      {/* Canvas Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {sections.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p>Drag sections here or click "Add" in the library</p>
            <p className="text-xs mt-1">Drop from the left panel</p>
          </div>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('section-index'));
                if (fromIndex !== index) {
                  reorderSections(fromIndex, index);
                }
              }}
              className={`rounded-lg border-2 transition-colors cursor-pointer group flex gap-0 ${
                selectedSectionId === section.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Left Control Panel */}
              <div className="flex flex-col items-center gap-1 p-2 bg-gray-100 rounded-l border-r border-gray-200">
                {/* Move/Drag Handle - 6 dots */}
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('section-index', index);
                  }}
                  className="grid grid-cols-2 gap-1 cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  title="Drag to reorder sections"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-current rounded-full"></div>
                  ))}
                </div>

                {/* Duplicate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateSection(section.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded transition-colors"
                  title="Duplicate section"
                >
                  <Copy size={16} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(section.id);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded transition-colors"
                  title="Delete section"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Main Content Area */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() => selectSection(section.id)}
              >
                {/* Section Preview */}
                <div className="p-4">
                  {getSectionPreview(section)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Canvas;
