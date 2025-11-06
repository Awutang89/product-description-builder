import { useState } from 'react';
import { X, Loader, ChevronRight } from 'lucide-react';
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
  });
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [stageContent, setStageContent] = useState({});
  const [editingStage, setEditingStage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addSection } = useEditor();

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

      const response = await aiService.generateProductDescription(
        inputData.supplierDescription,
        imageUrls,
        inputData.productTitle,
        stageNum,
        {
          secondaryKeywords: selectedKeywords,
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

  const handleApplyToCanvas = async () => {
    try {
      // Create sections based on generated content
      // Stage 1: Hero
      addSection('hero');

      // Stage 2: Text section
      addSection('text');

      // Stage 3: Features
      addSection('features');

      // Stage 4: Comparison/Text
      addSection('comparison');

      // Stage 5: CTA
      addSection('cta');

      // Add gallery with images if provided
      const imageUrls = inputData.imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url);

      if (imageUrls.length > 0) {
        addSection('gallery');
      }

      onClose();
    } catch (err) {
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

              <p className="text-sm text-gray-600">
                You can also manually edit keywords - just type them in the field below and press Enter
              </p>

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
              <h3 className="text-lg font-bold text-gray-900 mb-6">Final Review - All Stages</h3>

              {[1, 2, 3, 4, 5].map((stage) => (
                <div key={stage} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stage {stage}: {stageLabels[stage]}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-[150px] overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: stageContent[stage] || 'No content generated',
                      }}
                    />
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-600 mt-6">
                ✅ This will create 6 sections on your canvas (Hero, Text, Features, Comparison, CTA, and Gallery)
              </p>

              <button
                onClick={handleApplyToCanvas}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
