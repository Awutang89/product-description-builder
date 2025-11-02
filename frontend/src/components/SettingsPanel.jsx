import { useState } from 'react';
import { Settings, X, Wand2, BookOpen } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEditor } from '../store/editorStore';
import AIGenerator from './AIGenerator';
import ExampleManager from './ExampleManager';

/**
 * Settings Panel Component
 * Edit properties and styles for selected sections
 */
export function SettingsPanel({ projectId }) {
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
                Title Size (px)
              </label>
              <input
                type="number"
                min="10"
                max="48"
                value={selectedSection.styles?.titleSize || 40}
                onChange={(e) => {
                  const val = Math.min(48, Math.max(10, parseInt(e.target.value) || 10));
                  handleStyleChange('titleSize', val);
                }}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Range: 10px - 48px</p>
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
                Subtitle Size (px)
              </label>
              <input
                type="number"
                min="10"
                max="48"
                value={selectedSection.styles?.subtitleSize || 16}
                onChange={(e) => {
                  const val = Math.min(48, Math.max(10, parseInt(e.target.value) || 10));
                  handleStyleChange('subtitleSize', val);
                }}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">Range: 10px - 48px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={selectedSection.styles?.textColor || '#FFFFFF'}
                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 cursor-pointer"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <div className="bg-white border border-gray-300 rounded">
                <ReactQuill
                  value={selectedSection.content?.text || ''}
                  onChange={(value) => handleContentChange('text', value)}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'script': 'sub' }, { 'script': 'super' }],
                      ['link'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['blockquote'],
                      ['clean']
                    ]
                  }}
                  theme="snow"
                  placeholder="Enter your text here"
                  style={{ height: '200px' }}
                />
              </div>
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
                Button Text
              </label>
              <input
                type="text"
                value={selectedSection.content?.buttonText || 'Shop Now'}
                onChange={(e) => handleContentChange('buttonText', e.target.value)}
                placeholder="Shop Now"
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

      case 'image': {
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
      }

      case 'comparison': {
        const handleTableChange = (rowIndex, colIndex, value) => {
          const table = selectedSection.content?.table || {
            headers: ['Feature', 'Basic', 'Pro'],
            rows: [['Feature A', '✓', '✓']]
          };
          if (!table.rows) table.rows = [];
          if (!table.rows[rowIndex]) table.rows[rowIndex] = [];
          table.rows[rowIndex][colIndex] = value;
          handleContentChange('table', table);
        };

        const handleHeaderChange = (colIndex, value) => {
          const table = selectedSection.content?.table || {
            headers: ['Feature', 'Basic', 'Pro'],
            rows: [['Feature A', '✓', '✓']]
          };
          if (!table.headers) table.headers = [];
          table.headers[colIndex] = value;
          handleContentChange('table', table);
        };

        const table = selectedSection.content?.table || {
          headers: ['Feature', 'Basic', 'Pro'],
          rows: [['Feature A', '✓', '✓']]
        };
        const columnCount = table.headers?.length || 3;
        const rowCount = table.rows?.length || 1;

        return (
          <>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Columns (max 5)
              </label>
              <select
                value={columnCount}
                onChange={(e) => {
                  const newColCount = parseInt(e.target.value);
                  const newTable = {
                    headers: Array(newColCount).fill('').map((_, i) => table.headers?.[i] || `Column ${i + 1}`),
                    rows: table.rows?.map(row => Array(newColCount).fill('').map((_, i) => row?.[i] || '')) || [Array(newColCount).fill('')]
                  };
                  handleContentChange('table', newTable);
                }}
                className="input-field"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
                <option value="5">5 Columns</option>
              </select>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rows (max 10)
              </label>
              <select
                value={rowCount}
                onChange={(e) => {
                  const newRowCount = parseInt(e.target.value);
                  const newRows = Array(newRowCount).fill('').map((_, i) =>
                    Array(columnCount).fill('').map((_, j) => table.rows?.[i]?.[j] || '')
                  );
                  handleContentChange('table', { ...table, rows: newRows });
                }}
                className="input-field"
              >
                <option value="1">1 Row</option>
                <option value="2">2 Rows</option>
                <option value="3">3 Rows</option>
                <option value="4">4 Rows</option>
                <option value="5">5 Rows</option>
                <option value="6">6 Rows</option>
                <option value="7">7 Rows</option>
                <option value="8">8 Rows</option>
                <option value="9">9 Rows</option>
                <option value="10">10 Rows</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Column Headers</h3>
              <div className="space-y-2">
                {table.headers?.map((header, colIndex) => (
                  <div key={colIndex}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Column {colIndex + 1}
                    </label>
                    <input
                      type="text"
                      value={header || ''}
                      onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                      placeholder={`Column ${colIndex + 1}`}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Table Data</h3>
              <div className="space-y-4">
                {table.rows?.map((row, rowIndex) => (
                  <div key={rowIndex} className="border border-gray-200 rounded p-3">
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Row {rowIndex + 1}</h4>
                    <div className="space-y-2">
                      {row?.map((cell, colIndex) => (
                        <div key={colIndex}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {table.headers?.[colIndex] || `Column ${colIndex + 1}`}
                          </label>
                          <input
                            type="text"
                            value={cell || ''}
                            onChange={(e) => handleTableChange(rowIndex, colIndex, e.target.value)}
                            placeholder={`Enter data`}
                            className="input-field text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      }

      case 'gallery': {
        const handleMediaChange = (mediaIndex, field, value) => {
          const media = selectedSection.content?.media || [{}, {}, {}];
          media[mediaIndex] = { ...media[mediaIndex], [field]: value };
          handleContentChange('media', media);
        };

        const mediaCount = selectedSection.content?.media?.length || 3;

        return (
          <>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Items in Gallery
              </label>
              <select
                value={mediaCount}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value);
                  const media = selectedSection.content?.media || [{}, {}, {}];
                  // Add or remove media based on selection
                  if (newCount > media.length) {
                    media.push(...Array(newCount - media.length).fill({}));
                  } else {
                    media.splice(newCount);
                  }
                  handleContentChange('media', media);
                }}
                className="input-field"
              >
                <option value="2">2 Items</option>
                <option value="3">3 Items</option>
                <option value="4">4 Items</option>
              </select>
            </div>

            {Array(mediaCount).fill(null).map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">
                  Media {index + 1}
                </h3>

                {/* Media Type Toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded">
                    <button
                      onClick={() => handleMediaChange(index, 'type', 'image')}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                        (selectedSection.content?.media?.[index]?.type || 'image') === 'image'
                          ? 'bg-blue-500 text-white'
                          : 'bg-transparent text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Image
                    </button>
                    <button
                      onClick={() => handleMediaChange(index, 'type', 'video')}
                      className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                        (selectedSection.content?.media?.[index]?.type || 'image') === 'video'
                          ? 'bg-blue-500 text-white'
                          : 'bg-transparent text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                {/* Image Upload Section */}
                {(selectedSection.content?.media?.[index]?.type || 'image') === 'image' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={selectedSection.content?.media?.[index]?.url || ''}
                        onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="input-field"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={selectedSection.content?.media?.[index]?.altText || ''}
                        onChange={(e) => handleMediaChange(index, 'altText', e.target.value)}
                        placeholder="Describe the image"
                        className="input-field"
                      />
                    </div>
                    {selectedSection.content?.media?.[index]?.url && (
                      <div className="mt-3 flex justify-center">
                        <img
                          src={selectedSection.content.media[index].url}
                          alt={selectedSection.content.media[index].altText || `Media ${index + 1}`}
                          className="h-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Video Embed Code Section */}
                {selectedSection.content?.media?.[index]?.type === 'video' && (
                  <>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video Embed Code
                      </label>
                      <textarea
                        value={selectedSection.content?.media?.[index]?.url || ''}
                        onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
                        placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                        className="input-field resize-none font-mono text-xs"
                        rows="6"
                      />
                      <p className="text-xs text-gray-500 mt-1">Paste your DSBT lazy code here as well</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        );
      }

      case 'features': {
        const handleFeatureChange = (featureIndex, field, value) => {
          const features = selectedSection.content?.features || [{}, {}, {}];
          features[featureIndex] = { ...features[featureIndex], [field]: value };
          handleContentChange('features', features);
        };

        const featureCount = selectedSection.content?.features?.length || 3;

        return (
          <>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Features
              </label>
              <select
                value={featureCount}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value);
                  const features = selectedSection.content?.features || [{}, {}, {}];
                  // Add or remove features based on selection
                  if (newCount > features.length) {
                    features.push(...Array(newCount - features.length).fill({}));
                  } else {
                    features.splice(newCount);
                  }
                  handleContentChange('features', features);
                }}
                className="input-field"
              >
                <option value="2">2 Features</option>
                <option value="3">3 Features</option>
                <option value="4">4 Features</option>
              </select>
            </div>

            {Array(featureCount).fill(null).map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">
                  Feature {index + 1}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      value={selectedSection.content?.features?.[index]?.icon || ''}
                      onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                      placeholder="https://example.com/icon.png"
                      className="input-field"
                    />
                    {selectedSection.content?.features?.[index]?.icon && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={selectedSection.content.features[index].icon}
                          alt={`Feature ${index + 1} icon`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={selectedSection.content?.features?.[index]?.title || ''}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder={`Feature ${index + 1} title`}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title Heading Level
                    </label>
                    <select
                      value={selectedSection.content?.features?.[index]?.headingLevel || 'h3'}
                      onChange={(e) => handleFeatureChange(index, 'headingLevel', e.target.value)}
                      className="input-field"
                    >
                      <option value="h1">Heading 1 (H1)</option>
                      <option value="h2">Heading 2 (H2)</option>
                      <option value="h3">Heading 3 (H3)</option>
                      <option value="h4">Heading 4 (H4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={selectedSection.content?.features?.[index]?.description || ''}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder={`Feature ${index + 1} description`}
                      className="input-field resize-none"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      }

      case 'testimonial': {
        const handleTestimonialChange = (testimonialIndex, field, value) => {
          const testimonials = selectedSection.content?.testimonials || [{}, {}];
          testimonials[testimonialIndex] = { ...testimonials[testimonialIndex], [field]: value };
          handleContentChange('testimonials', testimonials);
        };

        const testimonialCount = selectedSection.content?.testimonials?.length || 1;

        return (
          <>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Testimonials (1-4)
              </label>
              <select
                value={testimonialCount}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value);
                  const testimonials = selectedSection.content?.testimonials || [{}, {}];
                  // Add or remove testimonials based on selection
                  if (newCount > testimonials.length) {
                    testimonials.push(...Array(newCount - testimonials.length).fill({}));
                  } else {
                    testimonials.splice(newCount);
                  }
                  handleContentChange('testimonials', testimonials);
                }}
                className="input-field"
              >
                <option value="1">1 Testimonial</option>
                <option value="2">2 Testimonials</option>
                <option value="3">3 Testimonials</option>
                <option value="4">4 Testimonials</option>
              </select>
            </div>

            {Array(testimonialCount).fill(null).map((_, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">
                  Testimonial {index + 1}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reviewer Photo URL
                    </label>
                    <input
                      type="url"
                      value={selectedSection.content?.testimonials?.[index]?.photo || ''}
                      onChange={(e) => handleTestimonialChange(index, 'photo', e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="input-field"
                    />
                    {selectedSection.content?.testimonials?.[index]?.photo && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={selectedSection.content.testimonials[index].photo}
                          alt={`Reviewer ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-full border-2 border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial Quote
                    </label>
                    <textarea
                      value={selectedSection.content?.testimonials?.[index]?.quote || ''}
                      onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)}
                      placeholder="Enter the customer testimonial or quote here"
                      className="input-field resize-none"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reviewer Name
                    </label>
                    <input
                      type="text"
                      value={selectedSection.content?.testimonials?.[index]?.author || ''}
                      onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)}
                      placeholder="Customer Name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reviewer Title/Position
                    </label>
                    <input
                      type="text"
                      value={selectedSection.content?.testimonials?.[index]?.authorTitle || ''}
                      onChange={(e) => handleTestimonialChange(index, 'authorTitle', e.target.value)}
                      placeholder="e.g., CEO at Company"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      }

      case 'twoColumn':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Left Column Text
              </label>
              <textarea
                value={selectedSection.content?.leftText || ''}
                onChange={(e) => handleContentChange('leftText', e.target.value)}
                placeholder="Enter text for left column"
                className="input-field resize-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Right Column Image URL
              </label>
              <input
                type="url"
                value={selectedSection.content?.rightImage || ''}
                onChange={(e) => handleContentChange('rightImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Position
              </label>
              <select
                value={selectedSection.styles?.imagePosition || 'right'}
                onChange={(e) => handleStyleChange('imagePosition', e.target.value)}
                className="input-field"
              >
                <option value="right">Image on Right</option>
                <option value="left">Image on Left</option>
              </select>
            </div>
          </>
        );

      case 'sideBySide':
        return (
          <>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Column 1</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={selectedSection.content?.col1Image || ''}
                    onChange={(e) => handleContentChange('col1Image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Below Image
                  </label>
                  <textarea
                    value={selectedSection.content?.col1Text || ''}
                    onChange={(e) => handleContentChange('col1Text', e.target.value)}
                    placeholder="Enter text for column 1"
                    className="input-field resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Column 2</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={selectedSection.content?.col2Image || ''}
                    onChange={(e) => handleContentChange('col2Image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Below Image
                  </label>
                  <textarea
                    value={selectedSection.content?.col2Text || ''}
                    onChange={(e) => handleContentChange('col2Text', e.target.value)}
                    placeholder="Enter text for column 2"
                    className="input-field resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'threeColumns':
        return (
          <>
            {[1, 2, 3].map((colNum) => (
              <div key={colNum} className={colNum < 3 ? 'border-b border-gray-200 pb-4 mb-4' : ''}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Column {colNum}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={selectedSection.content?.[`col${colNum}Image`] || ''}
                      onChange={(e) => handleContentChange(`col${colNum}Image`, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Below Image
                    </label>
                    <textarea
                      value={selectedSection.content?.[`col${colNum}Text`] || ''}
                      onChange={(e) => handleContentChange(`col${colNum}Text`, e.target.value)}
                      placeholder={`Enter text for column ${colNum}`}
                      className="input-field resize-none"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        );

      case 'fourColumns':
        return (
          <>
            {[1, 2, 3, 4].map((colNum) => (
              <div key={colNum} className={colNum < 4 ? 'border-b border-gray-200 pb-4 mb-4' : ''}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Column {colNum}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={selectedSection.content?.[`col${colNum}Image`] || ''}
                      onChange={(e) => handleContentChange(`col${colNum}Image`, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Below Image
                    </label>
                    <textarea
                      value={selectedSection.content?.[`col${colNum}Text`] || ''}
                      onChange={(e) => handleContentChange(`col${colNum}Text`, e.target.value)}
                      placeholder={`Enter text for column ${colNum}`}
                      className="input-field resize-none"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        );

      case 'twoColumnHighlight':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <div className="bg-white border border-gray-300 rounded">
                <ReactQuill
                  value={selectedSection.content?.richText || ''}
                  onChange={(value) => handleContentChange('richText', value)}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ 'script': 'sub' }, { 'script': 'super' }],
                      ['link'],
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      ['blockquote'],
                      ['clean']
                    ]
                  }}
                  theme="snow"
                  placeholder="Enter your text here"
                  style={{ height: '200px' }}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Type
              </label>
              <div className="flex gap-2 bg-gray-100 p-1 rounded mb-3">
                <button
                  onClick={() => handleStyleChange('mediaType', 'image')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    (selectedSection.styles?.mediaType || 'image') === 'image'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Image
                </button>
                <button
                  onClick={() => handleStyleChange('mediaType', 'video')}
                  className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    selectedSection.styles?.mediaType === 'video'
                      ? 'bg-blue-500 text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Video
                </button>
              </div>
            </div>
            {(selectedSection.styles?.mediaType || 'image') === 'image' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={selectedSection.content?.mediaUrl || ''}
                  onChange={(e) => handleContentChange('mediaUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Embed Code
                </label>
                <textarea
                  value={selectedSection.content?.mediaUrl || ''}
                  onChange={(e) => handleContentChange('mediaUrl', e.target.value)}
                  placeholder='<iframe width="560" height="315" src="..." frameborder="0" allow="accelerometer; autoplay;" allowfullscreen></iframe>'
                  className="input-field resize-none font-mono text-xs"
                  rows="6"
                />
              </div>
            )}
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

      {/* Section Info */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
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

      {/* Content Editor */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Content Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3 px-1">Content</h3>
          <div className="space-y-3">
            {renderContentFields()}
          </div>
        </div>

        {/* Common Styles - Hidden for text and image sections */}
        {selectedSection.type !== 'text' && selectedSection.type !== 'image' && (
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
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 text-xs text-gray-600">
        <p>💾 Changes saved automatically</p>
      </div>
    </div>
  );
}

export default SettingsPanel;
