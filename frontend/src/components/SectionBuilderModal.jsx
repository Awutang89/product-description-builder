import { useState } from 'react';
import { X, Loader, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import aiService from '../services/aiService';
import { useAIStore } from '../store/aiStore';

/**
 * Section Builder Modal
 * Guides users through section-by-section product page generation (2-8 sections)
 * Uses the new Section Builder Framework instead of rigid 5-stage approach
 */
export function SectionBuilderModal({ isOpen, onClose, projectId }) {
  const [step, setStep] = useState('input'); // 'input', 'keywords', 'planning', 'review-plan', 'generating', 'complete'
  const [inputData, setInputData] = useState({
    productTitle: '',
    supplierDescription: '',
    imageUrls: '',
    manualUrls: '',
    videoEmbed: '',
  });
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sectionPlan, setSectionPlan] = useState([]);
  const [generatedSections, setGeneratedSections] = useState([]);
  const [sectionsToInclude, setSectionsToInclude] = useState([]);
  const [progress, setProgress] = useState({
    step: '',
    progress: 0,
    message: '',
    currentSection: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addSection, setProjectContext } = useEditor();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartKeywordGeneration = async () => {
    if (!inputData.productTitle.trim() || !inputData.supplierDescription.trim()) {
      setError('Please fill in product title and description');
      return;
    }

    setError(null);
    setIsLoading(true);
    setStep('keywords');

    try {
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

  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const handleKeywordConfirm = async () => {
    if (selectedKeywords.length === 0) {
      setError('Please select at least one keyword');
      return;
    }
    setError(null);
    setStep('planning');
    await handleStartPlanning();
  };

  const parseProductContext = () => {
    // Parse supplier description to extract benefits, features, specs
    const lines = inputData.supplierDescription.split('\n').filter((l) => l.trim());
    const benefits = [];
    const features = [];
    const specs = [];

    lines.forEach((line) => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map((s) => s.trim());
        specs.push({ name: key, value });
      } else if (line.length < 100) {
        benefits.push(line.trim());
      } else {
        features.push({ title: '', description: line.trim() });
      }
    });

    return {
      title: inputData.productTitle,
      keywords: selectedKeywords,
      benefits,
      features,
      specs,
      manuals_links: inputData.manualUrls
        .split('\n')
        .filter((url) => url.trim())
        .map((url) => ({
          label: 'Product Manual',
          url: url.trim(),
          type: 'pdf',
        })),
    };
  };

  const parseMediaInventory = () => {
    const imageUrls = inputData.imageUrls
      .split('\n')
      .filter((url) => url.trim());

    const videoEmbeds = inputData.videoEmbed
      .split('\n')
      .filter((url) => url.trim())
      .map((embed) => {
        // Extract YouTube embed URL - only accept youtube.com/embed/ format
        let embedUrl = '';
        if (embed.includes('youtube.com/embed/')) {
          const urlMatch = embed.match(/https:\/\/www\.youtube\.com\/embed\/[^\s"'<>]*/);
          if (urlMatch) {
            embedUrl = urlMatch[0];
            embedUrl = embedUrl.replace(/[<>"]/, '');
          }
        }
        return embedUrl;
      })
      .filter((url) => url);

    return {
      images: imageUrls.map((url, i) => ({
        id: `img_${i + 1}`,
        url: url.trim(),
        w: 1200,
        h: 800,
        tags: ['product'],
        qualityScore: 0.8,
      })),
      videos: videoEmbeds.map((url, i) => ({
        id: `video_${i + 1}`,
        url: url,
        type: 'youtube',
      })),
      pdfs: [],
    };
  };

  const handleStartPlanning = async () => {
    if (!inputData.productTitle.trim() || !inputData.supplierDescription.trim()) {
      setError('Please fill in product title and description');
      return;
    }

    setError(null);
    setIsLoading(true);
    setStep('planning');

    try {
      const productContext = parseProductContext();
      const mediaInventory = parseMediaInventory();

      const response = await aiService.planSections(productContext, mediaInventory);
      setSectionPlan(response.data.sections);
      setStep('review-plan');
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to plan sections');
      setIsLoading(false);
      setStep('input');
    }
  };

  const handleGenerateSections = async () => {
    setError(null);
    setIsLoading(true);
    setStep('generating');

    try {
      const productContext = parseProductContext();
      const mediaInventory = parseMediaInventory();

      // Save project context for future AI generation of user-added sections
      setProjectContext({
        productTitle: inputData.productTitle,
        productDescription: inputData.supplierDescription,
        secondaryKeywords: selectedKeywords,
        mediaInventory,
      });

      const result = await aiService.generateSectionBuilderPage(
        productContext,
        mediaInventory,
        (progressData) => {
          setProgress(progressData);
        }
      );

      setGeneratedSections(result.sections);
      // Initialize all sections as included by default
      setSectionsToInclude(result.sections.map((_, i) => i));
      setStep('complete');
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to generate sections');
      setIsLoading(false);
      setStep('review-plan');
    }
  };

  const handleToggleSection = (index) => {
    setSectionsToInclude((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleApplyToCanvas = () => {
    // Convert selected sections to canvas sections
    generatedSections.forEach((section, index) => {
      if (sectionsToInclude.includes(index)) {
        const canvasSection = {
          type: section.plan.type,
          content: section.content,
          styles: {},
        };
        addSection(canvasSection.type, canvasSection);
      }
    });

    onClose();
  };

  const renderContentPreview = (section) => {
    const content = section.content;
    const type = section.plan.type;

    // Show relevant content based on section type
    if (type === 'hero') {
      return `${content.title || ''} — ${content.subtitle || ''}`;
    }
    if (type === 'text') {
      return content.text?.substring(0, 150) || '';
    }
    if (type === 'features') {
      return content.features?.map((f) => f.title).join(', ') || '';
    }
    if (type === 'gallery') {
      return `Gallery with ${content.images?.length || 0} images`;
    }
    if (type === 'testimonial') {
      return content.testimonials?.[0]?.quote?.substring(0, 100) || '';
    }
    if (type === 'comparison') {
      return `Comparison table with ${content.table?.rows?.length || 0} rows`;
    }
    if (type === 'cta') {
      return content.buttonText || '';
    }
    if (type === 'image') {
      return content.altText || 'Product image';
    }
    if (type === 'twoColumn') {
      return content.leftText?.substring(0, 100) || '';
    }
    if (type === 'sideBySide') {
      return `${content.col1Text?.substring(0, 50)} | ${content.col2Text?.substring(0, 50)}`;
    }
    if (type === 'threeColumns') {
      return '3 columns layout';
    }
    if (type === 'fourColumns') {
      return '4 columns layout';
    }
    if (type === 'twoColumnHighlight') {
      return content.richText?.substring(0, 100) || '';
    }

    return 'Section content';
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Sparkles className="text-blue-600" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Section Builder</h2>
              <p className="text-sm text-gray-600">
                AI-powered section-by-section page generation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Input */}
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="productTitle"
                  value={inputData.productTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Duramax SideMate Shed 4x8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description *
                </label>
                <textarea
                  name="supplierDescription"
                  value={inputData.supplierDescription}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="Paste supplier description, features, specs, benefits..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs (Optional, one per line)
                </label>
                <textarea
                  name="imageUrls"
                  value={inputData.imageUrls}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manual/Document URLs (Optional, one per line)
                </label>
                <textarea
                  name="manualUrls"
                  value={inputData.manualUrls}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="https://example.com/manual.pdf&#10;https://example.com/spec-sheet.pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Embed Codes (Optional, one per line)
                </label>
                <textarea
                  name="videoEmbed"
                  value={inputData.videoEmbed}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ&#10;https://www.youtube.com/embed/jNQXAC9IVRw"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleStartKeywordGeneration}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin" size={20} />
                    Generating keywords...
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          )}

          {/* Step 2: Keywords */}
          {step === 'keywords' && (
            <div className="space-y-6">
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

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={handleKeywordConfirm}
                  disabled={isLoading || selectedKeywords.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Planning...
                    </>
                  ) : (
                    'Plan Sections'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Planning */}
          {step === 'planning' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-lg font-medium text-gray-900">Analyzing your product...</p>
              <p className="text-sm text-gray-600 mt-2">
                Planning the optimal sections for your product page
              </p>
            </div>
          )}

          {/* Step 3: Review Plan */}
          {step === 'review-plan' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  ✓ Planned {sectionPlan.length} sections
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Review the planned sections below, then click Generate to create content
                </p>
              </div>

              <div className="space-y-3">
                {sectionPlan.map((section, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-500">
                            Section {section.index}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {section.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{section.goal}</p>
                        {section.notes.todos.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            ⚠️ {section.notes.todos.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            section.confidence >= 0.8
                              ? 'bg-green-500'
                              : section.confidence >= 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        />
                        <span className="text-xs text-gray-500">
                          {Math.round(section.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateSections}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate All Sections
              </button>
            </div>
          )}

          {/* Step 4: Generating */}
          {step === 'generating' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-blue-900">{progress.message}</p>
                  <span className="text-sm font-semibold text-blue-900">
                    {Math.round(progress.progress)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>

              {progress.currentSection && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader className="animate-spin text-blue-600" size={16} />
                    <span className="text-sm font-medium text-gray-900">
                      Generating {progress.currentSection.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{progress.currentSection.goal}</p>
                </div>
              )}

              <div className="space-y-2">
                {generatedSections.map((section, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>
                      Section {section.plan.index}: {section.plan.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 'complete' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="text-green-600 mx-auto mb-3" size={48} />
                <p className="text-lg font-semibold text-green-900 mb-1">
                  All sections generated!
                </p>
                <p className="text-sm text-green-700">
                  {sectionsToInclude.length} of {generatedSections.length} sections selected for canvas
                </p>
              </div>

              <div className="space-y-2">
                {generatedSections.map((section, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 transition-colors ${
                      sectionsToInclude.includes(i)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={sectionsToInclude.includes(i)}
                            onChange={() => handleToggleSection(i)}
                            className="w-5 h-5 text-blue-600 rounded mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-500">
                                Section {section.plan.index}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {section.plan.type}
                              </span>
                              {section.validation?.valid && (
                                <CheckCircle className="text-green-600" size={14} />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{section.plan.goal}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded p-3 ml-8">
                        <p className="text-sm text-gray-700">
                          {renderContentPreview(section)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApplyToCanvas}
                disabled={sectionsToInclude.length === 0}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {sectionsToInclude.length} Sections to Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SectionBuilderModal;
