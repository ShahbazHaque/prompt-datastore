import { useState } from 'react';

const SOURCE_COLORS = {
  'TAAFT': '#c0392b',
  'X': '#1da1f2',
  'Reddit': '#ff4500',
  'Custom': '#2c6e49',
  'Imported': '#6c3483',
};

export default function PromptCard({ prompt, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const textToCopy = prompt.promptText || prompt.description;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const sourceColor = SOURCE_COLORS[prompt.source] || '#888';

  return (
    <div className={`card${expanded ? ' expanded' : ''}`} onClick={() => setExpanded(!expanded)}>
      <div className="card-top">
        <div className="card-top-left">
          <span className="card-cat" data-cat={prompt.category}>{prompt.category}</span>
          <span className="card-source" style={{ background: sourceColor }}>{prompt.source || 'Unknown'}</span>
        </div>
        <span className="card-meta">{prompt.dateAdded}</span>
      </div>
      <h3>{prompt.title}</h3>
      {!expanded && <div className="card-expand-hint">Click to expand</div>}
      {expanded && (
        <>
          <div className="card-desc">{prompt.description}</div>
          {prompt.promptText && (
            <div className="card-prompt-text">
              <div className="card-prompt-label">Full Prompt:</div>
              <pre className="card-prompt-pre">{prompt.promptText}</pre>
            </div>
          )}
          <div className="card-footer">
            <div className="card-actions">
              <button
                className={`card-btn copy-btn${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                title="Copy prompt to clipboard"
              >
                {copied ? (
                  <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                ) : (
                  <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
                )}
              </button>
              {prompt.link && (
                <a className="card-btn link-btn" href={prompt.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open
                </a>
              )}
              <button className="card-btn edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(prompt); }} title="Edit prompt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit
              </button>
              <button className="card-btn delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(prompt.id); }} title="Delete prompt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
