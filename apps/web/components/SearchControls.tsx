import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, MapPin, Calendar, DollarSign, Clock, PawPrint } from 'lucide-react';
import { getLocationSuggestions } from '../lib/api';

interface LocationSuggestion {
  id: string;
  name: string;
  type: 'neighborhood' | 'borough' | 'street' | 'landmark' | 'address';
  lat: number;
  lng: number;
  borough?: string;
  display_name?: string;
}

export function SearchControls({ onRun, loading }: { onRun: (payload: any) => Promise<void>; loading: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const [form, setForm] = useState({
    move_in_from: '2026-05-01',
    move_in_to: '2026-05-20',
    min_stay_days: 30,
    max_budget: 4500,
    pet_required: false,
    location: 'New York, NY',
    max_commute_minutes: 45,
  });

  // Fetch location suggestions from backend API
  useEffect(() => {
    if (!form.location || form.location.trim().length === 0) {
      setLocationSuggestions([]);
      return;
    }

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce API call: wait 300ms after user stops typing
    debounceTimer.current = setTimeout(async () => {
      try {
        setSuggestionsLoading(true);
        const suggestions = await getLocationSuggestions(form.location, 8);
        setLocationSuggestions(suggestions);
      } catch (error) {
        console.error('Failed to fetch location suggestions:', error);
        setLocationSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [form.location]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
            <p className="text-sm text-gray-500">
              {form.location} &middot; ${form.max_budget}/mo max &middot; {form.max_commute_minutes}min commute
            </p>
          </div>
        </div>
        <span className="text-gray-400 text-xl">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {/* Date & Stay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4" /> Move-in From
              </label>
              <input
                type="date"
                value={form.move_in_from}
                onChange={(e) => setForm({ ...form, move_in_from: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4" /> Move-in To
              </label>
              <input
                type="date"
                value={form.move_in_to}
                onChange={(e) => setForm({ ...form, move_in_to: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Clock className="w-4 h-4" /> Min Stay (days)
              </label>
              <input
                type="number"
                value={form.min_stay_days}
                onChange={(e) => setForm({ ...form, min_stay_days: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
          </div>

          {/* Budget & Commute */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign className="w-4 h-4" /> Max Budget ($/mo)
              </label>
              <input
                type="number"
                value={form.max_budget}
                onChange={(e) => setForm({ ...form, max_budget: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <MapPin className="w-4 h-4" /> Max Commute (min)
              </label>
              <input
                type="number"
                value={form.max_commute_minutes}
                onChange={(e) => setForm({ ...form, max_commute_minutes: Number(e.target.value) })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
              />
            </div>
          </div>

          {/* Pet */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pet_required}
                onChange={(e) => setForm({ ...form, pet_required: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <PawPrint className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Pet-friendly required</span>
            </label>
          </div>

          {/* Location */}
          <div className="mt-5 relative">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              placeholder="e.g., 5th Avenue or Williamsburg"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
            />
            
            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50">
                {locationSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => {
                      setForm({ ...form, location: suggestion.display_name || suggestion.name });
                      setShowLocationSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 border-b last:border-b-0 transition"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.display_name || suggestion.name}</div>
                      <div className="text-xs text-gray-400">{suggestion.type}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Loading indicator */}
            {suggestionsLoading && showLocationSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 px-4 py-2 text-sm text-gray-500">
                Loading suggestions...
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => onRun(form)}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching across all sources...' : 'Search Zillow, Airbnb, StreetEasy & Craigslist'}
          </button>
        </div>
      )}
    </div>
  );
}
