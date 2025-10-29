import { useState, useEffect } from 'react';
import { Wand2, Copy, RefreshCw, ThumbsUp, ChevronDown } from 'lucide-react';
import { useAIStore } from '../store/aiStore';

/**
 * AI Generator Component
 * Generates content using AI with example-based learning
 */
export function AIGenerator({ sectionType, onContentGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [variationCount, setVariationCount] = useState(3);

  const {
    generatedContent,
    variations,
    examples,
    selectedExamples,
    isGenerating,
    error,
    generateContent,
    generateVariations,
    fetchExamplesByType,
    toggleExample,
    selectExamples,
    clearError,
    clearGeneratedContent,
  } = useAIStore();

  // Load examples when component mounts or section type changes
  useEffect(() => {
    if (sectionType) {
      fetchExamplesByType(sectionType);
    }
  }, [sectionType, fetchExamplesByType]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    try {
      await generateContent(prompt, sectionType, selectedExamples);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleGenerateVariations = async () => {
    if (!prompt.trim()) {
      return;
    }

    try {
      await generateVariations(prompt, sectionType, variationCount, selectedExamples);
      setShowVariations(true);
    } catch (error) {
      console.error('Variation generation failed:', error);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent?.content) {
      navigator.clipboard.writeText(generatedContent.content);
    }
  };

  const handleUseContent = () => {
    if (generatedContent?.content && onContentGenerated) {
      onContentGenerated(generatedContent.content);
      clearGeneratedContent();
    }
  };

  const handleCopyVariation = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleUseVariation = (content) => {
    if (onContentGenerated) {
      onContentGenerated(content);
      clearGeneratedContent();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wand2 size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">AI Content Generator</h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What do you want to generate?
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`e.g., "Create a compelling hero title for a premium coffee product" or "Write a feature description for noise-canceling headphones"`}
          className="input-field resize-none"
          rows="3"
          disabled={isGenerating}
        />
        <p className="text-xs text-gray-500 mt-1">
          Be specific about what you want. The more details, the better!
        </p>
      </div>

      {/* Examples Section */}
      <div>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${showExamples ? 'rotate-180' : ''}`}
          />
          <span className="text-sm font-medium text-gray-700">
            Learn from Examples ({selectedExamples.length} selected)
          </span>
        </button>

        {showExamples && (
          <div className="mt-2 space-y-2 pl-6 border-l-2 border-blue-200">
            {examples.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No examples available yet</p>
            ) : (
              examples.map((example) => (
                <label key={example._id} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExamples.includes(example._id)}
                    onChange={() => toggleExample(example._id)}
                    className="w-4 h-4 rounded border-gray-300 mt-0.5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{example.name}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">Input: {example.input}</p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      Output: {example.output}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 size={16} />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>

        <button
          onClick={handleGenerateVariations}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} />
          Variations ({variationCount})
        </button>
      </div>

      {/* Variation Count Selector */}
      {showVariations && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Number of variations:</label>
          <select
            value={variationCount}
            onChange={(e) => setVariationCount(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
            disabled={isGenerating}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && !showVariations && (
        <div className="bg-white border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Generated Content</h4>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Ready to use
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap">{generatedContent.content}</p>
          </div>

          <div className="flex gap-2 text-xs text-gray-600 mb-3">
            {generatedContent.usage && (
              <>
                <span>Tokens: {generatedContent.usage.totalTokens}</span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyContent}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm"
            >
              <Copy size={14} />
              Copy
            </button>
            <button
              onClick={handleUseContent}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-sm"
            >
              <ThumbsUp size={14} />
              Use This
            </button>
          </div>
        </div>
      )}

      {/* Variations */}
      {variations.length > 0 && showVariations && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">
            Variations ({variations.length})
          </h4>
          {variations.map((variation, idx) => (
            <div key={variation.id} className="bg-white border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Variation {variation.index}
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3">
                <p className="text-gray-800 text-sm whitespace-pre-wrap">
                  {variation.content}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyVariation(variation.content)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm"
                >
                  <Copy size={14} />
                  Copy
                </button>
                <button
                  onClick={() => handleUseVariation(variation.content)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-sm"
                >
                  <ThumbsUp size={14} />
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
        <p>💡 Select examples to teach the AI your preferred style</p>
        <p>🎨 Use variations to A/B test different content</p>
        <p>✨ The AI learns from your selected examples</p>
      </div>
    </div>
  );
}

export default AIGenerator;
