export default function SearchBar({
  searchTerm, setSearchTerm,
  sortMode, setSortMode,
  activeCategory, setActiveCategory,
  activeSource, setActiveSource,
  categories,
  sources,
  totalCount,
  shownCount,
  onExportJSON, onExportCSV, onImportJSON,
}) {

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImportJSON(ev.target.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <div className="controls">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search prompts by title, description, category…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        <select value={activeSource} onChange={e => setActiveSource(e.target.value)}>
          <option value="All">All Sources</option>
          {sources.map(([src, count]) => (
            <option key={src} value={src}>{src} ({count})</option>
          ))}
        </select>
        <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      <div className="cat-filters">
        <button
          className={`cat-pill${activeCategory === 'All' ? ' active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All <span className="pill-count">{totalCount}</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            className={`cat-pill${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat} <span className="pill-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="results-bar">
        <span className="results-count">Showing {shownCount} prompt{shownCount !== 1 ? 's' : ''}</span>
        <div className="export-btns">
          <button className="export-btn" onClick={handleImport}>Import</button>
          <button className="export-btn" onClick={onExportCSV}>CSV</button>
          <button className="export-btn" onClick={onExportJSON}>JSON</button>
        </div>
      </div>
    </>
  );
}
