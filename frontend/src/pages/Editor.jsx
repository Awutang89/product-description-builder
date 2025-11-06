import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Download, ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { useEditor } from '../store/editorStore';
import SectionLibrary from '../components/SectionLibrary';
import Canvas from '../components/Canvas';
import SettingsPanel from '../components/SettingsPanel';
import ExportModal from '../components/ExportModal';
import AIGeneratorModal from '../components/AIGeneratorModal';
import SectionBuilderModal from '../components/SectionBuilderModal';

/**
 * Editor Page
 * Main editing interface with 3-column layout
 */
export function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSectionBuilderModal, setShowSectionBuilderModal] = useState(false);
  const [showAIDropdown, setShowAIDropdown] = useState(false);
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

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

  const handleEditName = () => {
    setEditedName(project.name);
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== project.name) {
      try {
        // Update the project name in the store and save
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editedName.trim() }),
        });
        if (response.ok) {
          // Update local project object
          project.name = editedName.trim();
        }
      } catch (error) {
        console.error('Failed to update project name:', error);
      }
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
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
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  className="text-xl font-bold text-gray-900 border border-blue-500 rounded px-2 py-1"
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h1
                  onClick={handleEditName}
                  className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  title="Click to edit project name"
                >
                  {project.name}
                </h1>
                <p className="text-xs text-gray-500">
                  {isDirty ? '● Unsaved changes' : '✓ All changes saved'}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI Generate Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAIDropdown(!showAIDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Zap size={18} />
              AI Generate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAIDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
                <button
                  onClick={() => {
                    setShowSectionBuilderModal(true);
                    setShowAIDropdown(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                >
                  <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">Section Builder</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Smart section-by-section generation (Recommended)
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowAIModal(true);
                    setShowAIDropdown(false);
                  }}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Zap className="text-gray-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm">Classic Mode</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      5-stage generation (Legacy)
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

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
        {/* Left Column - Section Library (Collapsible) */}
        {!isLibraryCollapsed && (
          <div className="w-64 flex-shrink-0 overflow-hidden">
            <SectionLibrary onAddSection={addSection} />
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsLibraryCollapsed(!isLibraryCollapsed)}
          className="flex-shrink-0 w-4 bg-gray-100 border-r border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
          title={isLibraryCollapsed ? 'Expand library' : 'Collapse library'}
        >
          {isLibraryCollapsed ? (
            <ChevronRight size={14} className="text-gray-600" />
          ) : (
            <ChevronLeft size={14} className="text-gray-600" />
          )}
        </button>

        {/* Middle Column - Canvas */}
        <div className="flex-1 overflow-hidden">
          <Canvas projectId={projectId} />
        </div>

        {/* Right Column - Settings Panel (Collapsible) */}
        {!isPropertiesCollapsed && (
          <div className="w-80 flex-shrink-0 overflow-hidden">
            <SettingsPanel projectId={projectId} />
          </div>
        )}

        {/* Properties Collapse Toggle Button */}
        <button
          onClick={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}
          className="flex-shrink-0 w-4 bg-gray-100 border-l border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
          title={isPropertiesCollapsed ? 'Expand properties' : 'Collapse properties'}
        >
          {isPropertiesCollapsed ? (
            <ChevronLeft size={14} className="text-gray-600" />
          ) : (
            <ChevronRight size={14} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* AI Generator Modal (Classic Mode) */}
      <AIGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        projectId={projectId}
      />

      {/* Section Builder Modal (New Mode) */}
      <SectionBuilderModal
        isOpen={showSectionBuilderModal}
        onClose={() => setShowSectionBuilderModal(false)}
        projectId={projectId}
      />

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
