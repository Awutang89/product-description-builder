import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Star } from 'lucide-react';
import { useAIStore } from '../store/aiStore';

/**
 * Example Manager Component
 * Create and manage AI learning examples
 */
export function ExampleManager({ sectionType }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    input: '',
    output: '',
    note: '',
    tags: '',
  });

  const { examples, isLoadingExamples, error, createExample, deleteExample, approveExample } =
    useAIStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.input || !formData.output) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createExample({
        ...formData,
        sectionType,
        category: 'general',
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      });

      setFormData({
        name: '',
        input: '',
        output: '',
        note: '',
        tags: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create example:', error);
    }
  };

  const handleDelete = async (exampleId) => {
    if (window.confirm('Delete this example?')) {
      try {
        await deleteExample(exampleId);
      } catch (error) {
        console.error('Failed to delete example:', error);
      }
    }
  };

  const handleApprove = async (exampleId) => {
    try {
      await approveExample(exampleId, 'Approved for public use');
    } catch (error) {
      console.error('Failed to approve example:', error);
    }
  };

  const filteredExamples = examples.filter((ex) => ex.sectionType === sectionType);
  const unapprovedExamples = filteredExamples.filter((ex) => !ex.quality.isApproved);
  const approvedExamples = filteredExamples.filter((ex) => ex.quality.isApproved);

  return (
    <div className="space-y-4 p-4 bg-gradient-to-b from-purple-50 to-white rounded-lg border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Learning Examples</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm btn-primary"
        >
          <Plus size={16} />
          New Example
        </button>
      </div>

      {/* Create Example Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-purple-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Example Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Premium Coffee Hero"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Input/Prompt *
            </label>
            <textarea
              name="input"
              value={formData.input}
              onChange={handleInputChange}
              placeholder="What was the prompt or request?"
              className="input-field text-sm resize-none"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output/Result *
            </label>
            <textarea
              name="output"
              value={formData.output}
              onChange={handleInputChange}
              placeholder="What was the generated content?"
              className="input-field text-sm resize-none"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Why is this a good example?"
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., premium, coffee, catchy"
              className="input-field text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 btn-primary text-sm"
            >
              Save Example
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Unapproved Examples */}
      {unapprovedExamples.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Pending Approval ({unapprovedExamples.length})</h4>
          <div className="space-y-2">
            {unapprovedExamples.map((example) => (
              <div key={example._id} className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{example.name}</h5>
                  <button
                    onClick={() => handleApprove(example._id)}
                    className="flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                </div>
                <p className="text-gray-700 mb-1">📝 {example.input}</p>
                <p className="text-gray-600 text-xs mb-2">✨ {example.output}</p>
                <button
                  onClick={() => handleDelete(example._id)}
                  className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Examples */}
      {approvedExamples.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            Approved Examples ({approvedExamples.length})
          </h4>
          <div className="space-y-2">
            {approvedExamples.map((example) => (
              <div key={example._id} className="bg-white border border-green-200 rounded p-3 text-sm">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{example.name}</h5>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle size={12} />
                    Approved
                  </span>
                </div>
                <p className="text-gray-700 mb-1 line-clamp-1">📝 {example.input}</p>
                <p className="text-gray-600 text-xs mb-1 line-clamp-1">✨ {example.output}</p>
                {example.note && <p className="text-gray-500 text-xs mb-2">💡 {example.note}</p>}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Used {example.usageCount} times</span>
                  <button
                    onClick={() => handleDelete(example._id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredExamples.length === 0 && !showForm && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm mb-2">No examples yet</p>
          <p className="text-xs">Create examples to teach the AI your preferred style</p>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-200">
        <p>💡 Examples help the AI learn your writing style and preferences</p>
        <p>✅ Approve examples before using them in generation</p>
        <p>📊 Usage metrics help identify most valuable examples</p>
      </div>
    </div>
  );
}

export default ExampleManager;
