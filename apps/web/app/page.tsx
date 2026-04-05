'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SearchControls } from '../components/SearchControls';
import { ListingCard } from '../components/ListingCard';
import { ListingDetailModal } from '../components/ListingDetailModal';
import { ComparePanel } from '../components/ComparePanel';
import { NeighborhoodInsights } from '../components/NeighborhoodInsights';
import { SavedSearches } from '../components/SavedSearches';
import { StatsBar } from '../components/StatsBar';
import { runSearch, shortlistListing, rejectListing } from '../lib/api';
import {
  Map, LayoutGrid, List, Building2, AlertTriangle,
} from 'lucide-react';

// Dynamic import for map (no SSR)
const MapView = dynamic(() => import('../components/MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  ),
});

type ViewMode = 'grid' | 'map' | 'split';

export default function HomePage() {
  const [results, setResults] = useState<any[]>([]);
  const [rejected, setRejected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPayload, setCurrentPayload] = useState<any>({
    move_in_from: '2026-05-01',
    move_in_to: '2026-05-20',
    min_stay_days: 30,
    max_budget: 4500,
    pet_required: false,
    location: 'New York, NY',
    max_commute_minutes: 45,
  });
  const [showRejected, setShowRejected] = useState(false);

  async function handleRun(payload: any) {
    setLoading(true);
    setCurrentPayload(payload);
    try {
      const data = await runSearch(payload);
      setResults(data.accepted || []);
      setRejected(data.rejected || []);
      setCompareIds(new Set());
    } finally {
      setLoading(false);
    }
  }

  function handleLoadSearch(payload: any) {
    setCurrentPayload(payload);
    handleRun(payload);
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }

  async function handleShortlist(id: string) {
    await shortlistListing(id);
    setResults((prev) => prev.filter((r) => r.listing.id !== id));
  }

  async function handleReject(id: string) {
    await rejectListing(id);
    setResults((prev) => prev.filter((r) => r.listing.id !== id));
  }

  const handleSelectListing = useCallback((item: any) => {
    setSelectedItem(item);
  }, []);

  const compareItems = results.filter((r) => compareIds.has(r.listing.id));

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NYC Rent Search</h1>
              <p className="text-xs text-gray-500">Zillow &middot; Airbnb &middot; StreetEasy &middot; Craigslist</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition ${viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded-lg transition ${viewMode === 'split' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Split view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Search Controls */}
        <SearchControls onRun={handleRun} loading={loading} />

        {/* Stats Bar */}
        {(results.length > 0 || loading) && (
          <StatsBar results={results} rejected={rejected} loading={loading} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600 font-medium">Searching across all sources...</p>
              <p className="text-sm text-gray-400 mt-1">Zillow, Airbnb, StreetEasy, Craigslist</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && results.length > 0 && (
          <div className={viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : ''}>
            {/* Map View */}
            {(viewMode === 'map' || viewMode === 'split') && (
              <div className={viewMode === 'map' ? 'h-[600px]' : 'h-[500px]'}>
                <MapView items={results} onSelectListing={handleSelectListing} />
              </div>
            )}

            {/* Grid View */}
            {(viewMode === 'grid' || viewMode === 'split') && (
              <div>
                <div className={`grid gap-4 ${
                  viewMode === 'split'
                    ? 'grid-cols-1 max-h-[500px] overflow-y-auto pr-2'
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                }`}>
                  {results.map((item) => (
                    <ListingCard
                      key={item.listing.id}
                      item={item}
                      onSelect={() => setSelectedItem(item)}
                      onShortlist={() => handleShortlist(item.listing.id)}
                      onReject={() => handleReject(item.listing.id)}
                      onCompareToggle={() => toggleCompare(item.listing.id)}
                      isComparing={compareIds.has(item.listing.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map-only: show cards below */}
            {viewMode === 'map' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((item) => (
                  <ListingCard
                    key={item.listing.id}
                    item={item}
                    onSelect={() => setSelectedItem(item)}
                    onShortlist={() => handleShortlist(item.listing.id)}
                    onReject={() => handleReject(item.listing.id)}
                    onCompareToggle={() => toggleCompare(item.listing.id)}
                    isComparing={compareIds.has(item.listing.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sidebar panels (Insights + Saved) */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeighborhoodInsights items={results} />
            <SavedSearches currentPayload={currentPayload} onLoadSearch={handleLoadSearch} />
          </div>
        )}

        {/* Rejected Listings */}
        {!loading && rejected.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <button
              onClick={() => setShowRejected(!showRejected)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="font-semibold">
                {rejected.length} Rejected Listing{rejected.length > 1 ? 's' : ''}
              </span>
              <span className="text-sm text-gray-400">{showRejected ? '(hide)' : '(show)'}</span>
            </button>
            {showRejected && (
              <div className="mt-4 space-y-2">
                {rejected.map((r) => (
                  <div key={r.listingId} className="flex items-center gap-3 text-sm py-2 border-b border-gray-100 last:border-0">
                    <span className="font-mono text-xs text-gray-400 truncate max-w-[200px]">{r.listingId}</span>
                    <div className="flex gap-1.5">
                      {r.reasonCodes.map((code: string) => (
                        <span key={code} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state (before search) */}
        {!loading && results.length === 0 && rejected.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Ready to find your NYC rental</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Configure your search filters above and hit search. We'll scan Zillow, Airbnb, StreetEasy, and Craigslist to find the best verified listings for you.
            </p>
          </div>
        )}

        {/* Saved Searches (show before first search too) */}
        {!loading && results.length === 0 && (
          <SavedSearches currentPayload={currentPayload} onLoadSearch={handleLoadSearch} />
        )}
      </main>

      {/* Detail Modal */}
      {selectedItem && (
        <ListingDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {/* Compare Panel */}
      {compareItems.length > 0 && (
        <ComparePanel
          items={compareItems}
          onClose={() => setCompareIds(new Set())}
          onRemove={(id) => {
            setCompareIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }}
        />
      )}
    </div>
  );
}
