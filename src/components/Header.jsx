export default function Header({ totalCount, shownCount, categoryCount, onAddClick }) {
  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <div className="masthead-rule" />
          <h1>The Prompt Library</h1>
          <p className="masthead-sub">A Curated Collection by Shahbaz</p>
          <div className="masthead-edition">
            <span>Est. December 2024</span>
            <span>·</span>
            <span>Prompt Datastore v2.0</span>
          </div>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-num">{totalCount}</div>
            <div className="stat-label">Prompts</div>
          </div>
          <div className="stat">
            <div className="stat-num">{categoryCount}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat">
            <div className="stat-num">{shownCount}</div>
            <div className="stat-label">Showing</div>
          </div>
          <div className="stat add-stat">
            <button className="add-btn" onClick={onAddClick} title="Add new prompt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Prompt</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
