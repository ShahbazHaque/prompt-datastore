import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Business & Revenue',
  'Personal Growth',
  'Productivity & Systems',
  'Thinking & Analysis',
  'Professional Skills',
  'Creativity',
];

const SOURCES = ['TAAFT', 'X', 'Reddit', 'Custom'];

const EMPTY_FORM = {
  title: '',
  category: CATEGORIES[0],
  source: SOURCES[0],
  description: '',
  promptText: '',
  link: '',
};

export default function PromptModal({ isOpen, onClose, onSave, editingPrompt }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingPrompt) {
      const isCustomCat = !CATEGORIES.includes(editingPrompt.category);
      setForm({
        title: editingPrompt.title || '',
        category: isCustomCat ? '' : editingPrompt.category,
        source: editingPrompt.source || SOURCES[0],
        description: editingPrompt.description || '',
        promptText: editingPrompt.promptText || '',
        link: editingPrompt.link || '',
      });
      setCustomCategory(isCustomCat ? editingPrompt.category : '');
      setUseCustomCategory(isCustomCat);
    } else {
      setForm(EMPTY_FORM);
      setCustomCategory('');
      setUseCustomCategory(false);
    }
    setErrors({});
  }, [editingPrompt, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    const cat = useCustomCategory ? customCategory.trim() : form.category;
    if (!cat) errs.category = 'Category is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const category = useCustomCategory ? customCategory.trim() : form.category;
    onSave({
      ...(editingPrompt ? { id: editingPrompt.id } : {}),
      title: form.title.trim(),
      category,
      source: form.source,
      description: form.description.trim(),
      promptText: form.promptText.trim(),
      link: form.link.trim(),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prompt-title">Title *</label>
            <input
              id="prompt-title"
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Business Model Mixer"
              className={errors.title ? 'error' : ''}
              autoFocus
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prompt-category">Category *</label>
              {!useCustomCategory ? (
                <select
                  id="prompt-category"
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className={errors.category ? 'error' : ''}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="prompt-category"
                  type="text"
                  value={customCategory}
                  onChange={e => { setCustomCategory(e.target.value); if (errors.category) setErrors(prev => ({...prev, category: null})); }}
                  placeholder="Enter custom category"
                  className={errors.category ? 'error' : ''}
                />
              )}
              <button type="button" className="text-btn" onClick={() => setUseCustomCategory(!useCustomCategory)}>
                {useCustomCategory ? '← Use preset' : '+ Custom category'}
              </button>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="prompt-source">Source</label>
              <select
                id="prompt-source"
                value={form.source}
                onChange={e => handleChange('source', e.target.value)}
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prompt-desc">Description</label>
            <textarea
              id="prompt-desc"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Brief summary of what this prompt does..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="prompt-text">
              Full Prompt Text
              <span className="label-hint">This is what gets copied to clipboard</span>
            </label>
            <textarea
              id="prompt-text"
              value={form.promptText}
              onChange={e => handleChange('promptText', e.target.value)}
              placeholder="Paste the full prompt here..."
              rows={8}
              className="prompt-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="prompt-link">Link (optional)</label>
            <input
              id="prompt-link"
              type="url"
              value={form.link}
              onChange={e => handleChange('link', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingPrompt ? 'Save Changes' : 'Add Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
