'use client';

import { useState } from 'react';
import {
  Star, Shield, MapPin, Bed, Bath, Maximize, ChevronRight,
  Heart, X, GitCompareArrows, ExternalLink, AlertTriangle,
} from 'lucide-react';

function isRealUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return !parsed.pathname.includes('seed') && parsed.hostname !== 'example.com';
  } catch {
    return false;
  }
}

const SOURCE_COLORS: Record<string, string> = {
  zillow_api: 'bg-blue-100 text-blue-700',
  airbnb_api: 'bg-rose-100 text-rose-700',
  streeteasy_scrape: 'bg-emerald-100 text-emerald-700',
  craigslist_scrape: 'bg-purple-100 text-purple-700',
};

const SOURCE_LABELS: Record<string, string> = {
  zillow_api: 'Zillow',
  airbnb_api: 'Airbnb',
  streeteasy_scrape: 'StreetEasy',
  craigslist_scrape: 'Craigslist',
};

function VerificationBadge({ status }: { status: string }) {
  if (status === 'VERIFIED_LIVE') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <Shield className="w-3 h-3" /> Verified
      </span>
    );
  }
  if (status === 'PARTIAL') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        <AlertTriangle className="w-3 h-3" /> Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
      <X className="w-3 h-3" /> Dead
    </span>
  );
}

export function ListingCard({
  item,
  onSelect,
  onShortlist,
  onReject,
  onCompareToggle,
  isComparing,
}: {
  item: any;
  onSelect: () => void;
  onShortlist: () => void;
  onReject: () => void;
  onCompareToggle: () => void;
  isComparing: boolean;
}) {
  const listing = item.listing;
  const [imgError, setImgError] = useState(false);
  const imageUrl = listing.image_url;

  const scoreColor =
    item.score >= 70 ? 'text-green-600 bg-green-50' :
    item.score >= 50 ? 'text-yellow-600 bg-yellow-50' :
    'text-red-600 bg-red-50';

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all hover:shadow-lg cursor-pointer overflow-hidden ${
        isComparing ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden" onClick={onSelect}>
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={listing.title || 'Listing'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        {/* Score badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-sm font-bold ${scoreColor}`}>
          {item.score}/100
        </div>
        {/* Source badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {item.sources.map((s: any) => (
            <span
              key={s.id}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${SOURCE_COLORS[s.id] || 'bg-gray-100 text-gray-600'}`}
            >
              {SOURCE_LABELS[s.id] || s.id}
            </span>
          ))}
        </div>
        {/* Rating */}
        {listing.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded-full text-white text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {listing.rating} ({listing.reviews_count})
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4" onClick={onSelect}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{listing.title || 'Untitled listing'}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {listing.neighborhood || 'Unknown neighborhood'}
            </p>
          </div>
          <VerificationBadge status={listing.verification_status} />
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ${listing.monthly_rent?.toLocaleString() ?? '???'}
          </span>
          <span className="text-sm text-gray-500">/ month</span>
          {item.effective_cost && item.effective_cost !== listing.monthly_rent && (
            <span className="text-xs text-gray-400 ml-auto">
              ${item.effective_cost.toLocaleString()} effective
            </span>
          )}
        </div>

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
          {listing.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`}
            </span>
          )}
          {listing.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {listing.bathrooms} BA
            </span>
          )}
          {listing.sqft && (
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" /> {listing.sqft} sqft
            </span>
          )}
        </div>

        {/* Commute & Confidence */}
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className={`px-2 py-1 rounded-md font-medium ${
            item.commute_summary.classification === 'GOOD'
              ? 'bg-green-50 text-green-700'
              : item.commute_summary.classification === 'OK'
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {item.commute_summary.low_minutes}-{item.commute_summary.high_minutes} min commute
          </span>
          <span className="text-gray-400">
            {Math.round((item.confidence || 0) * 100)}% confidence
          </span>
        </div>

        {/* Why selected */}
        {item.why_selected.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.why_selected.slice(0, 3).map((reason: string) => (
              <span key={reason} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full">
                {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onShortlist(); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
        >
          <Heart className="w-4 h-4" /> Save
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onReject(); }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
        >
          <X className="w-4 h-4" /> Pass
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition ${
            isComparing
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <GitCompareArrows className="w-4 h-4" />
        </button>
        {isRealUrl(listing.canonical_url) ? (
          <a
            href={listing.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center py-2 px-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="flex items-center justify-center py-2 px-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            title="View details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
