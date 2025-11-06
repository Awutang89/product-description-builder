import { useState } from 'react';
import { X, Loader, ChevronRight, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useAIStore } from '../store/aiStore';
import { useEditor } from '../store/editorStore';
import aiService from '../services/aiService';

/**
 * AI Generator Modal
 * Guides users through stage-by-stage product description generation
 */
export function AIGeneratorModal({ isOpen, onClose, projectId }) {
  const [step, setStep] = useState('input'); // 'input', 'keywords', 'generating', 'review', 'finalReview'
  const [currentStage, setCurrentStage] = useState(1);
  const [inputData, setInputData] = useState({
    supplierDescription: '',
    productTitle: '',
    imageUrls: '',
    manualUrls: '',
    videoEmbed: '',
  });
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [stageContent, setStageContent] = useState({});
  const [editingStage, setEditingStage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Section mapping: tracks which stage maps to which section type
  const [sectionMappings, setSectionMappings] = useState([
    { stageNum: 1, sectionType: 'hero', label: 'Hero' },
    { stageNum: 2, sectionType: 'text', label: 'Solution' },
    { stageNum: 3, sectionType: 'features', label: 'Features' },
    { stageNum: 4, sectionType: 'comparison', label: 'Specs' },
    { stageNum: 5, sectionType: 'cta', label: 'Call-to-Action' },
  ]);

  const { addSection } = useEditor();

  // Available section types (predefined in app)
  const availableSectionTypes = [
    { value: 'hero', label: 'Hero' },
    { value: 'text', label: 'Text' },
    { value: 'features', label: 'Features' },
    { value: 'image', label: 'Image' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'cta', label: 'CTA Button' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'twoColumn', label: 'Two Column w/ Image' },
    { value: 'sideBySide', label: 'Side by Side Text w/ Image' },
    { value: 'threeColumns', label: 'Three Columns w/ Images' },
    { value: 'fourColumns', label: 'Four Columns w/ Images' },
    { value: 'twoColumnHighlight', label: 'Two Column Highlight' },
  ];

  const stageLabels = {
    1: 'Problem Identification',
    2: 'Solution Explanation',
    3: 'Feature → Benefit Mapping',
    4: 'Technical Specifications',
    5: 'Call-to-Action Conclusion',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartGeneration = async () => {
    if (!inputData.supplierDescription.trim() || !inputData.productTitle.trim()) {
      setError('Please fill in supplier description and product title');
      return;
    }

    setError(null);
    setStep('keywords');
    await generateKeywords();
  };

  const generateKeywords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API to generate secondary keywords from product title
      const response = await aiService.generateSecondaryKeywords(inputData.productTitle);
      setSuggestedKeywords(response.data.keywords || []);
      setSelectedKeywords(response.data.keywords || []);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate keywords');
      // Fallback: create basic keywords from product title
      const basicKeywords = inputData.productTitle.split(' ').slice(0, 3);
      setSuggestedKeywords(basicKeywords);
      setSelectedKeywords(basicKeywords);
      setIsLoading(false);
    }
  };

  const handleKeywordConfirm = async () => {
    if (selectedKeywords.length === 0) {
      setError('Please select at least one keyword');
      return;
    }
    setError(null);
    setStep('generating');
    await generateStage(1);
  };

  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const generateStage = async (stageNum) => {
    setIsLoading(true);
    setError(null);

    try {
      const imageUrls = inputData.imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url);

      // Parse and format YouTube embed codes
      const youtubeEmbeds = inputData.videoEmbed
        .split('\n')
        .map((embed) => embed.trim())
        .filter((embed) => embed)
        .map((embed) => {
          // Extract embed URL - only accept youtube.com/embed/ format
          let embedUrl = '';
          if (embed.includes('youtube.com/embed/')) {
            // Match the full YouTube embed URL including query parameters
            const urlMatch = embed.match(/https:\/\/www\.youtube\.com\/embed\/[^\s"'<>]*/);
            if (urlMatch) {
              embedUrl = urlMatch[0];
              // Clean up any trailing special characters that might have been captured
              embedUrl = embedUrl.replace(/[<>"]/, '');
            }
          }

          if (embedUrl) {
            return `<noscript class="loading-lazy">
<iframe loading="lazy" width="1280" height="720" src="${embedUrl}" title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>
</noscript>`;
          }
          return '';
        })
        .filter((embed) => embed);

      // Parse manual/file URLs
      const manualUrls = inputData.manualUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url);

      const response = await aiService.generateProductDescription(
        inputData.supplierDescription,
        imageUrls,
        inputData.productTitle,
        stageNum,
        {
          secondaryKeywords: selectedKeywords,
          youtubeEmbeds: youtubeEmbeds,
          manualUrls: manualUrls,
          // examples will be loaded from backend based on product type
        }
      );

      setStageContent((prev) => ({
        ...prev,
        [stageNum]: response.data.content,
      }));

      setCurrentStage(stageNum);
      setEditingStage(null);
      setStep('review');
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate stage');
      setIsLoading(false);
    }
  };

  const handleEditStageContent = (stageNum, newContent) => {
    setStageContent((prev) => ({
      ...prev,
      [stageNum]: newContent,
    }));
  };

  const handleApproveStage = async () => {
    if (currentStage < 5) {
      setStep('generating');
      await generateStage(currentStage + 1);
    } else {
      // All stages complete, show final review
      setStep('finalReview');
    }
  };

  const handleRejectStage = async () => {
    setStep('generating');
    await generateStage(currentStage);
  };

  // Section management handlers
  const handleDeleteSection = (index) => {
    setSectionMappings(sectionMappings.filter((_, i) => i !== index));
  };

  const handleMoveSection = (index, direction) => {
    const newMappings = [...sectionMappings];
    if (direction === 'up' && index > 0) {
      [newMappings[index], newMappings[index - 1]] = [newMappings[index - 1], newMappings[index]];
    } else if (direction === 'down' && index < newMappings.length - 1) {
      [newMappings[index], newMappings[index + 1]] = [newMappings[index + 1], newMappings[index]];
    }
    setSectionMappings(newMappings);
  };

  const handleChangeSectionType = (index, newType) => {
    const newMappings = [...sectionMappings];
    newMappings[index].sectionType = newType;
    newMappings[index].label = availableSectionTypes.find(t => t.value === newType)?.label || newType;
    setSectionMappings(newMappings);
  };

  const handleAddSection = () => {
    const newMapping = {
      stageNum: null, // Not tied to a stage - will use custom content
      sectionType: 'text',
      label: 'New Section'
    };
    setSectionMappings([...sectionMappings, newMapping]);
  };

  // Extract preview text from stage content
  const getContentPreview = (stageNum) => {
    const content = stageContent[stageNum] || '';
    // Remove markdown/formatting and get first 150 characters
    const text = content.replace(/\[HEADING\]|\[BODY\]|\[CTA.*?\]/g, '').trim();
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  };

  const handleApplyToCanvas = async () => {
    try {
      const { updateSection } = useEditor.getState();

      // Helper function to extract heading and body from stage content
      const parseStageContent = (content) => {
        if (!content) return { heading: '', body: '' };

        // Match [HEADING] ... [BODY] pattern
        const headingMatch = content.match(/\[HEADING\]\s*\n?([\s\S]*?)(?=\[BODY\]|\n\n|$)/);
        const bodyMatch = content.match(/\[BODY\]\s*\n?([\s\S]*?)(?:\[CTA|$)/);

        let heading = headingMatch ? headingMatch[1].trim() : '';
        let body = bodyMatch ? bodyMatch[1].trim() : '';

        // If no markers found, treat entire content as body
        if (!heading && !body) {
          body = content.trim();
        }

        return { heading, body };
      };

      // Process each section mapping
      sectionMappings.forEach((mapping) => {
        addSection(mapping.sectionType);
        const newSectionId = useEditor.getState().sections[useEditor.getState().sections.length - 1].id;

        // Get content from the mapped stage
        const stageContent_ = mapping.stageNum ? stageContent[mapping.stageNum] : '';
        const parsed = parseStageContent(stageContent_);

        // Populate content based on section type
        const updateData = { content: {} };

        switch (mapping.sectionType) {
          case 'hero':
            updateData.content = {
              title: parsed.heading || inputData.productTitle,
              subtitle: parsed.body.split('\n')[0] || 'High-quality product description'
            };
            updateData.styles = {
              bgColor: '#3B82F6',
              textColor: '#FFFFFF',
              titleSize: 40,
              subtitleSize: 16
            };
            break;

          case 'text':
            updateData.content = {
              text: parsed.heading ? `<h3>${parsed.heading}</h3>\n${parsed.body}` : parsed.body
            };
            break;

          case 'features':
            const featureLines = parsed.body.split('\n').filter(line => line.trim().length > 0);
            const features = featureLines.slice(0, 6).map((line, idx) => ({
              title: `Feature ${idx + 1}`,
              description: line.substring(0, 100),
              icon: null
            }));
            updateData.content = {
              features: features.length > 0 ? features : [
                { title: 'Feature 1', description: 'Feature description' },
                { title: 'Feature 2', description: 'Feature description' },
              ]
            };
            break;

          case 'comparison':
            updateData.content = {
              table: {
                headers: ['Specification', 'Value'],
                rows: [[]]
              },
              text: parsed.heading ? `<h3>${parsed.heading}</h3>\n${parsed.body}` : parsed.body
            };
            break;

          case 'cta':
            const ctaMatch = stageContent_?.match(/\[CTA BUTTON TEXT:\s*([^\]]+)\]/);
            const ctaButtonText = ctaMatch ? ctaMatch[1].trim() : 'Shop Now';
            updateData.content = {
              buttonText: ctaButtonText,
              buttonLink: '#'
            };
            break;

          case 'gallery':
            const imageUrls = inputData.imageUrls
              .split('\n')
              .map((url) => url.trim())
              .filter((url) => url);
            updateData.content = {
              images: imageUrls.map((url, idx) => ({
                url: url,
                title: `Product Image ${idx + 1}`,
                alt: `${inputData.productTitle} - Image ${idx + 1}`
              }))
            };
            break;

          default:
            updateData.content = {
              text: parsed.body || 'Add your content here'
            };
        }

        updateSection(newSectionId, updateData);
      });

      onClose();
    } catch (err) {
      console.error('Error applying sections:', err);
      setError('Failed to apply sections to canvas');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">🤖 AI Product Description Generator</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Provide information about your product and let AI generate a professional product description in 5 stages.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="productTitle"
                  value={inputData.productTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Austin Air HealthMate Plus Air Purifier"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Description *
                </label>
                <textarea
                  name="supplierDescription"
                  value={inputData.supplierDescription}
                  onChange={handleInputChange}
                  placeholder="Paste the supplier's product description, specifications, and features here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URLs (optional, one per line)
                </label>
                <textarea
                  name="imageUrls"
                  value={inputData.imageUrls}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manual & File URLs (optional, one per line)
                </label>
                <textarea
                  name="manualUrls"
                  value={inputData.manualUrls}
                  onChange={handleInputChange}
                  placeholder="https://example.com/manual.pdf&#10;https://example.com/specs.xlsx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Embed Codes (optional, one per line)
                </label>
                <textarea
                  name="videoEmbed"
                  value={inputData.videoEmbed}
                  onChange={handleInputChange}
                  placeholder="&lt;iframe width=&quot;853&quot; height=&quot;480&quot; src=&quot;https://www.youtube.com/embed/AnQZtUnMpPk?list=LL&quot; title=&quot;Video Title&quot; frameborder=&quot;0&quot; allow=&quot;accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share&quot; allowfullscreen&gt;&lt;/iframe&gt;"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
                />
              </div>

              <button
                onClick={handleStartGeneration}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Generation
              </button>
            </div>
          )}

          {step === 'keywords' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Secondary Keywords</h3>
                <p className="text-gray-600 text-sm mb-4">
                  These keywords will be used in your headings throughout the product description. Select the ones you want to use:
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader size={32} className="text-blue-600 animate-spin mb-2" />
                  <p className="text-gray-600">Generating keywords...</p>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  {suggestedKeywords.map((keyword, index) => (
                    <label key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedKeywords.includes(keyword)}
                        onChange={() => handleKeywordToggle(keyword)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 font-medium">{keyword}</span>
                    </label>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-600 mb-2">
                You can also manually edit keywords - just type them in the field below and press Enter
              </p>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Type a keyword and press Enter to add it"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newKeyword = e.target.value.trim();
                      if (!selectedKeywords.includes(newKeyword)) {
                        setSelectedKeywords([...selectedKeywords, newKeyword]);
                      }
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedKeywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{keyword}</span>
                        <button
                          onClick={() => setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword))}
                          className="text-blue-600 hover:text-blue-800 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleKeywordConfirm}
                disabled={selectedKeywords.length === 0 || isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Stage Generation →
              </button>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={48} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-700 font-semibold">
                Generating Stage {currentStage}: {stageLabels[currentStage]}...
              </p>
              <p className="text-gray-500 text-sm mt-2">Using keywords: {selectedKeywords.join(', ')}</p>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Stage {currentStage} of 5: {stageLabels[currentStage]}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Progress: {currentStage}/5</p>
                </div>
              </div>

              {editingStage === currentStage ? (
                <textarea
                  value={stageContent[currentStage] || ''}
                  onChange={(e) => handleEditStageContent(currentStage, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px] font-mono text-sm"
                  placeholder="Edit content here..."
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[300px] max-h-[400px] overflow-y-auto">
                  <div
                    className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: stageContent[currentStage] || 'No content generated',
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3">
                {editingStage === currentStage ? (
                  <button
                    onClick={() => setEditingStage(null)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    ✓ Done Editing
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingStage(currentStage)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleRejectStage}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      🔄 Regenerate
                    </button>
                  </>
                )}
                <button
                  onClick={handleApproveStage}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {currentStage === 5 ? 'Review All' : 'Continue'} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'finalReview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Review & Customize Sections</h3>
                <button
                  onClick={handleAddSection}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Plus size={16} />
                  Add Section
                </button>
              </div>

              {sectionMappings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No sections configured. Click "Add Section" to create one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sectionMappings.map((mapping, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500">Section {index + 1}</span>
                            <select
                              value={mapping.sectionType}
                              onChange={(e) => handleChangeSectionType(index, e.target.value)}
                              className="text-sm px-2 py-1 border border-gray-300 rounded bg-white font-medium text-gray-900 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {availableSectionTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>
                          {mapping.stageNum && (
                            <p className="text-xs text-gray-500">From: Stage {mapping.stageNum} - {stageLabels[mapping.stageNum]}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleMoveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveSection(index, 'down')}
                            disabled={index === sectionMappings.length - 1}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(index)}
                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                            title="Delete section"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Content preview */}
                      {mapping.stageNum && stageContent[mapping.stageNum] && (
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mt-3 border border-gray-100">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Preview:</p>
                          <p className="line-clamp-3 text-gray-600">
                            {getContentPreview(mapping.stageNum)}
                          </p>
                        </div>
                      )}

                      {!mapping.stageNum && (
                        <div className="bg-blue-50 p-3 rounded text-sm text-blue-700 mt-3 border border-blue-100">
                          <p className="text-xs">This section will be added with default content. Edit it on the canvas after applying.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-green-900">
                  ✅ Ready to add <strong>{sectionMappings.length}</strong> section{sectionMappings.length !== 1 ? 's' : ''} to your canvas
                </p>
              </div>

              <button
                onClick={handleApplyToCanvas}
                disabled={sectionMappings.length === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Apply All Sections to Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIGeneratorModal;
