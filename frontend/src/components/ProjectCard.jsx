import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Trash2, Edit2, Lock } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';

/**
 * Project Card Component
 * Displays a single project with actions
 */
export function ProjectCard({ project, onDelete, onDuplicate }) {
  const navigate = useNavigate();
  const updateProject = useProjectStore((state) => state.updateProject);
  const [isActing, setIsActing] = useState(false);

  const handleEdit = () => {
    navigate(`/editor/${project._id}`);
  };

  const handleDuplicate = async () => {
    setIsActing(true);
    try {
      await onDuplicate(project._id);
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      setIsActing(true);
      try {
        await onDelete(project._id);
      } finally {
        setIsActing(false);
      }
    }
  };

  const handlePublish = async () => {
    setIsActing(true);
    try {
      await updateProject(project._id, { isDraft: false });
    } finally {
      setIsActing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      {/* Color Preview */}
      <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 flex">
        {project.brandColors && project.brandColors.slice(0, 3).map((color, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: color }}
            className="flex-1"
            title={color}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 break-words">
            {project.name}
          </h3>
          {project.isDraft && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full whitespace-nowrap">
              Draft
            </span>
          )}
        </div>

        {project.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{project.sections?.length || 0} sections</span>
          <span>{formatDate(project.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-3 grid grid-cols-4 gap-2">
        <button
          onClick={handleEdit}
          disabled={isActing}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
          title="Edit project"
        >
          <Edit2 size={16} />
        </button>

        <button
          onClick={handleDuplicate}
          disabled={isActing}
          className="p-2 text-green-500 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
          title="Duplicate project"
        >
          <Copy size={16} />
        </button>

        {project.isDraft && (
          <button
            onClick={handlePublish}
            disabled={isActing}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
            title="Publish project"
          >
            <Lock size={16} />
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isActing}
          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
