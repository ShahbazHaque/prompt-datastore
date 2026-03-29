import { useState } from 'react';
import { usePrompts } from './hooks/usePrompts';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PromptGrid from './components/PromptGrid';
import PromptModal from './components/PromptModal';
import VisitorCounter from './components/VisitorCounter';

export default function App() {
  const {
    prompts,
    totalCount,
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    activeSource, setActiveSource,
    sortMode, setSortMode,
    categories,
    sources,
    addPrompt,
    updatePrompt,
    deletePrompt,
    exportJSON,
    exportCSV,
    importJSON,
  } = usePrompts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddClick = () => {
    setEditingPrompt(null);
    setModalOpen(true);
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deletePrompt(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleSave = (promptData) => {
    if (promptData.id) {
      updatePrompt(promptData.id, promptData);
    } else {
      addPrompt(promptData);
    }
  };

  return (
    <div className="app">
      <Header
        totalCount={totalCount}
        shownCount={prompts.length}
        categoryCount={categories.length}
        onAddClick={handleAddClick}
      />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortMode={sortMode}
        setSortMode={setSortMode}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeSource={activeSource}
        setActiveSource={setActiveSource}
        categories={categories}
        sources={sources}
        totalCount={totalCount}
        shownCount={prompts.length}
        onExportJSON={exportJSON}
        onExportCSV={exportCSV}
        onImportJSON={importJSON}
      />

      <PromptGrid
        prompts={prompts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PromptModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPrompt(null); }}
        onSave={handleSave}
        editingPrompt={editingPrompt}
      />

      {/* Delete confirmation overlay */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-dialog" onClick={e => e.stopPropagation()}>
            <h3>Delete Prompt?</h3>
            <p>This action cannot be undone.</p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>Shahbaz's Prompt Library — Prompt Datastore v2.0</p>
        <VisitorCounter />
      </footer>
    </div>
  );
}
