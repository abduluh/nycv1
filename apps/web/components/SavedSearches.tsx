'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Clock, Trash2, Play } from 'lucide-react';

type SavedSearch = {
  id: string;
  name: string;
  payload: any;
  savedAt: string;
};

const STORAGE_KEY = 'nyc-search-saved';

function loadSaved(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistSaved(searches: SavedSearch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function SavedSearches({
  currentPayload,
  onLoadSearch,
}: {
  currentPayload: any;
  onLoadSearch: (payload: any) => void;
}) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    setSearches(loadSaved());
  }, []);

  function handleSave() {
    if (!name.trim()) return;
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: name.trim(),
      payload: currentPayload,
      savedAt: new Date().toISOString(),
    };
    const updated = [newSearch, ...searches];
    setSearches(updated);
    persistSaved(updated);
    setName('');
    setShowSave(false);
  }

  function handleDelete(id: string) {
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    persistSaved(updated);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5" /> Saved Searches
        </h3>
        <button
          onClick={() => setShowSave(!showSave)}
          className="text-sm text-primary hover:text-primary-dark font-medium"
        >
          {showSave ? 'Cancel' : '+ Save Current'}
        </button>
      </div>

      {showSave && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name this search..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition"
          >
            Save
          </button>
        </div>
      )}

      {searches.length === 0 ? (
        <p className="text-sm text-gray-500">No saved searches yet</p>
      ) : (
        <div className="space-y-2">
          {searches.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl group"
            >
              <div className="min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">{s.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {new Date(s.savedAt).toLocaleDateString()}
                  &middot; ${s.payload.max_budget}/mo
                  &middot; {s.payload.target_areas?.length || 0} areas
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => onLoadSearch(s.payload)}
                  className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition"
                  title="Run this search"
                >
                  <Play className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
