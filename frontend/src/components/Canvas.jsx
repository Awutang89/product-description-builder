import { Trash2, Copy, Move } from 'lucide-react';
import { useEditor } from '../store/editorStore';

/**
 * Canvas Component
 * Main editing canvas where sections are displayed and managed
 */
export function Canvas({ projectId }) {
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
      case 'testimonial':
        return (
          <div className="bg-yellow-50 p-6 rounded border border-yellow-200">
            <p className="text-gray-700 italic mb-3">"Great product! Highly recommended."</p>
            <p className="font-semibold text-gray-900">— Customer Name</p>
          </div>
        );
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
      <div className="border-b border-gray-200 p-4 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Canvas Preview</h2>
        <p className="text-xs text-gray-500 mt-1">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </p>
      </div>

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
              onClick={() => selectSection(section.id)}
              className={`rounded-lg border-2 transition-colors cursor-pointer group ${
                selectedSectionId === section.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t group-hover:from-gray-100 group-hover:to-gray-200">
                <Move size={16} className="text-gray-400 cursor-grab active:cursor-grabbing" />
                <span className="text-sm font-semibold text-gray-900 capitalize">
                  {section.type}
                </span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded ml-auto">
                  #{index + 1}
                </span>
              </div>

              {/* Section Preview */}
              <div className="p-4">
                {getSectionPreview(section)}
              </div>

              {/* Section Actions */}
              {selectedSectionId === section.id && (
                <div className="flex gap-2 p-3 bg-gray-100 border-t border-gray-200 rounded-b">
                  <button
                    onClick={() => duplicateSection(section.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    <Copy size={14} />
                    Duplicate
                  </button>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors ml-auto"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Canvas Footer */}
      <div className="border-t border-gray-200 p-3 bg-white text-xs text-gray-600">
        <p>📌 Click sections to edit properties in the right panel</p>
      </div>
    </div>
  );
}

export default Canvas;
