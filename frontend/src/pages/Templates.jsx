import { useEffect, useState } from 'react';
import { Star, Eye, Download } from 'lucide-react';
import templateService from '../services/templateService';

/**
 * Templates Page
 * Browse and use pre-built templates
 */
export function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['tech', 'fashion', 'home', 'beauty', 'sports', 'general'];

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, showFeaturedOnly, searchTerm]);

  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (showFeaturedOnly) params.isFeatured = true;
      if (searchTerm) params.search = searchTerm;

      const response = await templateService.getFilteredTemplates(params);
      setTemplates(response.data.templates || []);
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    try {
      await templateService.useTemplate(templateId);
      // Template usage recorded - could trigger navigation to editor or other action
      console.log('Template used:', templateId);
    } catch (err) {
      console.error('Failed to use template:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      tech: 'blue',
      fashion: 'pink',
      home: 'orange',
      beauty: 'purple',
      sports: 'red',
      general: 'gray',
    };
    return colors[category] || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">✨ Templates</h1>
          <p className="text-gray-600 mt-1">Choose from our pre-built templates or create your own</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Templates
              </label>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      selectedCategory === category
                        ? `bg-${getCategoryColor(category)}-500 text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm text-gray-700 cursor-pointer">
                Show featured templates only
              </label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No templates found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Templates Grid */}
        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {template.isFeatured && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          <Star size={12} />
                          Featured
                        </span>
                      )}
                      {template.isPrebuilt && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Prebuilt
                        </span>
                      )}
                      <span className={`text-xs bg-${getCategoryColor(template.category)}-100 text-${getCategoryColor(template.category)}-800 px-2 py-1 rounded-full capitalize`}>
                        {template.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {template.usageCount} uses
                    </span>
                    <span>{template.sections?.length || 0} sections</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 p-3 flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template._id)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Use Template
                  </button>
                  <button className="btn-secondary px-3">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Templates;
