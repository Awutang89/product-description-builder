import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

/**
 * Create Project Modal
 * Modal form for creating new projects
 */
export function CreateProjectModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brandColors: ['#3B82F6'],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProject = useProjectStore((state) => state.createProject);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.brandColors];
    newColors[index] = value;
    setFormData((prev) => ({
      ...prev,
      brandColors: newColors,
    }));
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      brandColors: [...prev.brandColors, '#000000'],
    }));
  };

  const removeColor = (index) => {
    if (formData.brandColors.length > 1) {
      setFormData((prev) => ({
        ...prev,
        brandColors: prev.brandColors.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Project name cannot exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    formData.brandColors.forEach((color, index) => {
      if (!color.match(/^#[0-9A-Fa-f]{6}$/)) {
        newErrors[`color${index}`] = 'Invalid hex color';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(formData);
      await fetchProjects({ page: 1 });
      setFormData({
        name: '',
        description: '',
        brandColors: ['#3B82F6'],
      });
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Wireless Headphones"
              className="input-field"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your project..."
              rows="3"
              maxLength="500"
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Brand Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Colors
            </label>
            <div className="space-y-2">
              {formData.brandColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    placeholder="#000000"
                    className="input-field flex-1"
                  />
                  {formData.brandColors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  {errors[`color${index}`] && (
                    <p className="text-red-500 text-sm">{errors[`color${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColor}
              className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors text-sm"
            >
              <Plus size={16} />
              Add Color
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
