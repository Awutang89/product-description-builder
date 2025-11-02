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
            className="text-white p-12 rounded text-center"
            style={{ backgroundColor: section.styles?.bgColor || '#3B82F6' }}
          >
            <h2 className="text-3xl font-bold mb-2">
              {section.content?.title || 'Hero Title'}
            </h2>
            <p className="text-blue-100">
              {section.content?.subtitle || 'Hero subtitle goes here'}
            </p>
          </div>
        );
      case 'text':
        return (
          <div className="p-8 bg-gray-50 rounded text-gray-700" style={{ color: section.styles?.color || '#374151' }}>
            <p className="line-clamp-3">
              {section.content?.text || 'Sample text content. Add your own text here to customize this section.'}
            </p>
          </div>
        );
      case 'features':
        return (
          <div className="grid grid-cols-3 gap-4 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-4 rounded text-center">
                <div className="w-12 h-12 bg-blue-200 rounded mx-auto mb-2"></div>
                <p className="text-sm font-semibold text-gray-900">Feature {i}</p>
              </div>
            ))}
          </div>
        );
      case 'image':
        return (
          <div className="bg-gray-100 rounded flex items-center justify-center h-64">
            <div className="text-center text-gray-400">
              <p className="text-lg">🖼️ Image Section</p>
              <p className="text-sm">Click to upload</p>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="grid grid-cols-4 gap-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded"></div>
            ))}
          </div>
        );
      case 'cta':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="font-bold text-gray-900 mb-2">Call to Action</h3>
            <p className="text-gray-600 mb-4">Add your CTA text here</p>
            <button className="btn-primary">Action Button</button>
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
        return (
          <div className="p-6 bg-gray-50 rounded">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 font-semibold">Feature</th>
                  <th className="text-center py-2 font-semibold">Basic</th>
                  <th className="text-center py-2 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2">Feature A</td>
                  <td className="text-center">✓</td>
                  <td className="text-center">✓</td>
                </tr>
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
