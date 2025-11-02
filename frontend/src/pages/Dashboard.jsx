import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

/**
 * Dashboard Page
 * Main page for viewing and managing projects
 */
export function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const {
    projects,
    loading,
    error,
    pagination,
    searchTerm,
    filterDraft,
    fetchProjects,
    setSearchTerm,
    setFilterDraft,
    setPage,
    deleteProject,
    duplicateProject,
    clearError,
  } = useProjectStore();

  // Fetch projects on mount and when filters change
  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filterDraft]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleFilterChange = (filter) => {
    setFilterDraft(filterDraft === filter ? null : filter);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProjects({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📝 Project Database</h1>
              <p className="text-gray-600 mt-1">
                {pagination.totalItems} project{pagination.totalItems !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </button>
          </form>

          {/* Filter Options */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterDraft === true}
                    onChange={() => handleFilterChange(true)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Draft Projects</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterDraft === false}
                    onChange={() => handleFilterChange(false)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Published Projects</span>
                </label>
              </div>
              {filterDraft !== null && (
                <button
                  onClick={() => setFilterDraft(null)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Active Filters Display */}
          {(searchTerm || filterDraft !== null) && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-700 flex items-center gap-2">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm('')}
                      className="hover:text-blue-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {filterDraft !== null && (
                  <div className="bg-purple-50 border border-purple-200 rounded-full px-3 py-1 text-sm text-purple-700 flex items-center gap-2">
                    {filterDraft ? 'Draft' : 'Published'}
                    <button
                      onClick={() => setFilterDraft(null)}
                      className="hover:text-purple-900 font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm || filterDraft !== null
                ? 'No projects match your filters.'
                : 'No projects yet. Create one to get started!'}
            </p>
            {!(searchTerm || filterDraft !== null) && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create Your First Project
              </button>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={deleteProject}
                onDuplicate={duplicateProject}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pagination.currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
