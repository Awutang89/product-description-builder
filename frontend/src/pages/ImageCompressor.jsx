import { useState } from 'react';
import { Upload, Download, Archive, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import {
  compressAndRenameImages,
  downloadSingleImage,
  downloadBatchAsZip,
  formatFileSize,
} from '../services/imageCompressorService';

/**
 * Image Compressor Page
 * Allows users to compress images and rename them with AI descriptions
 */
export function ImageCompressor() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // Handle file selection
  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  // Process files
  const handleFiles = (files) => {
    const newFiles = Array.from(files).filter((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(file.type);
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  // Toggle image selection
  const toggleImageSelection = (index) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Process images
  const handleCompress = async () => {
    if (uploadedFiles.length === 0) {
      setErrors(['Please upload at least one image']);
      return;
    }

    if (!secondaryKeywords.trim()) {
      setErrors(['Please enter at least one secondary keyword']);
      return;
    }

    setProcessing(true);
    setErrors([]);

    try {
      const result = await compressAndRenameImages(uploadedFiles, secondaryKeywords);

      if (result.success) {
        setProcessedImages(result.images);
        setUploadedFiles([]);
        setSelectedImages(new Set());
      } else {
        // Handle backend errors
        if (result.errors && Array.isArray(result.errors)) {
          const errorMessages = result.errors.map((e) => e.error || e.message || 'Unknown error');
          setErrors(errorMessages);
        } else {
          setErrors([result.error || 'Processing failed']);
        }
      }
    } catch (error) {
      setErrors([error.message || 'An unexpected error occurred']);
    } finally {
      setProcessing(false);
    }
  };

  // Download all processed images
  const handleDownloadAll = async () => {
    if (processedImages.length === 0) {
      return;
    }

    try {
      await downloadBatchAsZip(processedImages);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  // Download single image
  const handleDownloadSingle = async (image) => {
    try {
      await downloadSingleImage(image);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  // Clear processed images
  const handleClearProcessed = () => {
    setProcessedImages([]);
    setSecondaryKeywords('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🖼️</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Image Compressor</h1>
              <p className="text-gray-600 mt-1">
                Compress JPEG/PNG images and rename them with AI descriptions
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Errors occurred</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setErrors([])}
                className="text-red-500 hover:text-red-700 ml-auto"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {processedImages.length === 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload size={24} className="text-blue-500" />
                  Upload Images
                </h2>

                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-600 font-medium mb-1">
                    Drag and drop images here
                  </p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,.jpg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="btn-primary inline-block cursor-pointer"
                  >
                    Select Images
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Supported: JPEG, PNG (Max 10MB per file)
                  </p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Uploaded Files ({uploadedFiles.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(idx)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Keywords Section */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Secondary Keywords
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter keywords (one per line)
                  </label>
                  <textarea
                    value={secondaryKeywords}
                    onChange={(e) => setSecondaryKeywords(e.target.value)}
                    placeholder="Example:&#10;organic coffee&#10;fresh beans&#10;premium quality"
                    className="input-field w-full h-48 p-3 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Keywords will be combined with AI-generated descriptions to create filenames.
                    Use one keyword per line. If fewer keywords than images, the first keyword will
                    be repeated.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCompress}
                    disabled={uploadedFiles.length === 0 || !secondaryKeywords.trim() || processing}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Compress & Rename Images
                      </>
                    )}
                  </button>

                  {uploadedFiles.length > 0 && (
                    <button
                      onClick={() => {
                        setUploadedFiles([]);
                        setSelectedImages(new Set());
                      }}
                      className="btn-secondary w-full"
                    >
                      Clear Upload
                    </button>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span>ℹ️</span>
                    How it works
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      1. Upload your JPEG or PNG images using drag & drop or the file picker
                    </li>
                    <li>2. Enter secondary keywords that describe the image categories</li>
                    <li>3. Click "Compress & Rename" to process all images</li>
                    <li>
                      4. AI will analyze each image and generate descriptions automatically
                    </li>
                    <li>
                      5. Filenames are created by combining keywords with AI descriptions
                    </li>
                    <li>6. Download individual images or all as a ZIP file</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Results Section
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Processing Complete!</h2>
                    <p className="text-gray-600">
                      {processedImages.length} image{processedImages.length !== 1 ? 's' : ''} compressed
                      and renamed
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearProcessed}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Upload size={18} />
                  Process More
                </button>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownloadAll}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <Archive size={20} />
                  Download All as ZIP
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedImages.map((image, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  {/* Filename Preview */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-sm break-all">
                      {image.optimizedName}
                    </h3>
                  </div>

                  {/* Image Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Original:</p>
                      <p className="text-gray-900 font-medium truncate">
                        {image.originalName}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">AI Description:</p>
                      <p className="text-gray-900 italic">{image.aiDescription}</p>
                    </div>

                    <div>
                      <p className="text-gray-600">Secondary Keyword:</p>
                      <p className="text-gray-900 font-medium">{image.secondaryKeyword}</p>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-gray-600 text-xs">Original Size</p>
                        <p className="text-gray-900 font-medium">
                          {formatFileSize(image.originalSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Compressed</p>
                        <p className="text-gray-900 font-medium">
                          {formatFileSize(image.compressedSize)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Saved</p>
                        <p className="text-green-600 font-medium">{image.compressionRatio}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadSingle(image)}
                    className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ImageCompressor;
