import { useState, useEffect, useMemo, useCallback } from 'react';
import { SEED_PROMPTS } from '../data/seedPrompts';

const STORAGE_KEY = 'prompt-datastore-prompts';
const DATA_VERSION = '4'; // Bumped for TAAFT Apr 2026 update (109 prompts)
const VERSION_KEY = 'prompt-datastore-version';

function generateId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function loadPrompts() {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored && storedVersion === DATA_VERSION) {
      // Data is up to date — load from localStorage
      return JSON.parse(stored);
    }

    if (stored && storedVersion !== DATA_VERSION) {
      // Version mismatch — merge: keep user-added prompts (non-TAAFT or id doesn't start with 'p0')
      // but replace seed prompts with the new updated seed data
      const existing = JSON.parse(stored);
      const seedIds = new Set(SEED_PROMPTS.map(p => p.id));
      const userAdded = existing.filter(p => !seedIds.has(p.id));
      const merged = [...SEED_PROMPTS, ...userAdded];
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.error('Failed to load prompts from localStorage:', e);
  }
  // First run — seed with imported prompts
  localStorage.setItem(VERSION_KEY, DATA_VERSION);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PROMPTS));
  return [...SEED_PROMPTS];
}

function savePrompts(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

export function usePrompts() {
  const [prompts, setPrompts] = useState(loadPrompts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSource, setActiveSource] = useState('All');
  const [sortMode, setSortMode] = useState('newest');

  // Persist whenever prompts change
  useEffect(() => {
    savePrompts(prompts);
  }, [prompts]);

  // Derived: categories with counts
  const categories = useMemo(() => {
    const cats = {};
    prompts.forEach(p => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    return Object.entries(cats).sort(([a], [b]) => a.localeCompare(b));
  }, [prompts]);

  // Derived: sources with counts
  const sources = useMemo(() => {
    const srcs = {};
    prompts.forEach(p => {
      const s = p.source || 'Unknown';
      srcs[s] = (srcs[s] || 0) + 1;
    });
    return Object.entries(srcs).sort(([a], [b]) => a.localeCompare(b));
  }, [prompts]);

  // Filtered + sorted prompts
  const filteredPrompts = useMemo(() => {
    let list = [...prompts];

    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (activeSource !== 'All') {
      list = list.filter(p => (p.source || 'Unknown') === activeSource);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.source || '').toLowerCase().includes(q) ||
        (p.promptText || '').toLowerCase().includes(q)
      );
    }

    switch (sortMode) {
      case 'oldest':
        list.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case 'az':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return list;
  }, [prompts, activeCategory, activeSource, searchTerm, sortMode]);

  // CRUD
  const addPrompt = useCallback((prompt) => {
    const newPrompt = {
      id: generateId(),
      title: prompt.title,
      category: prompt.category,
      source: prompt.source || 'Custom',
      description: prompt.description || '',
      promptText: prompt.promptText || '',
      link: prompt.link || '',
      dateAdded: new Date().toISOString().split('T')[0],
      tags: prompt.tags || [],
      isFavorite: false,
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt;
  }, []);

  const updatePrompt = useCallback((id, updates) => {
    setPrompts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePrompt = useCallback((id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Export
  const exportJSON = useCallback(() => {
    const data = JSON.stringify(prompts, null, 2);
    downloadFile(data, 'prompt-library.json', 'application/json');
  }, [prompts]);

  const exportCSV = useCallback(() => {
    const header = 'ID,Title,Category,Source,Description,Prompt Text,Link,Date Added\n';
    const rows = prompts.map(p =>
      `"${p.id}","${esc(p.title)}","${esc(p.category)}","${esc(p.source)}","${esc(p.description)}","${esc(p.promptText)}","${p.link}","${p.dateAdded}"`
    ).join('\n');
    downloadFile(header + rows, 'prompt-library.csv', 'text/csv');
  }, [prompts]);

  // Import
  const importJSON = useCallback((jsonString) => {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) throw new Error('Invalid format');
      // Assign new IDs to avoid conflicts
      const withIds = imported.map(p => ({
        ...p,
        id: p.id || generateId(),
        source: p.source || 'Imported',
        dateAdded: p.dateAdded || new Date().toISOString().split('T')[0],
        tags: p.tags || [],
        isFavorite: p.isFavorite || false,
      }));
      setPrompts(prev => [...withIds, ...prev]);
      return { success: true, count: withIds.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  const resetToSeed = useCallback(() => {
    setPrompts([...SEED_PROMPTS]);
  }, []);

  return {
    prompts: filteredPrompts,
    totalCount: prompts.length,
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
    resetToSeed,
  };
}

function esc(str) {
  return (str || '').replace(/"/g, '""');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
