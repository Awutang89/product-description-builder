import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Download } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import SectionLibrary from '../components/SectionLibrary';
import Canvas from '../components/Canvas';
import SettingsPanel from '../components/SettingsPanel';
import ExportModal from '../components/ExportModal';

/**
 * Editor Page
 * Main editing interface with 3-column layout
 */
export function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const {
    project,
    sections,
    isDirty,
    isSaving,
    error,
    initializeEditor,
    saveProject,
    clearError,
    addSection,
  } = useEditor();

  // Initialize editor when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      initializeEditor(projectId).catch(() => {
        navigate('/');
      });
    }
  }, [projectId, initializeEditor, navigate]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (isDirty) {
        saveProject();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [isDirty, saveProject]);

  const handleSave = async () => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-xs text-gray-500">
              {isDirty ? '● Unsaved changes' : '✓ All changes saved'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 flex items-center justify-between">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Editor Container - 3 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Section Library */}
        <div className="w-64 flex-shrink-0 overflow-hidden">
          <SectionLibrary onAddSection={addSection} />
        </div>

        {/* Middle Column - Canvas */}
        <div className="flex-1 overflow-hidden">
          <Canvas projectId={projectId} />
        </div>

        {/* Right Column - Settings Panel */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <SettingsPanel projectId={projectId} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <p>💡 Drag sections from the left panel to add them to your project</p>
          <p>Right-click sections to access more options</p>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectId={projectId}
        sections={sections}
        projectData={project}
      />
    </div>
  );
}

export default Editor;
