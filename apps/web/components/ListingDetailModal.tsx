'use client';

import { useState } from 'react';
import {
  X, Star, Shield, MapPin, Bed, Bath, Maximize, Calendar,
  DollarSign, ChevronLeft, ChevronRight, ExternalLink, PawPrint,
  AlertTriangle, CheckCircle, Clock,
} from 'lucide-react';

function isRealUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return !parsed.pathname.includes('seed') && parsed.hostname !== 'example.com';
  } catch {
    return false;
  }
}

const SOURCE_LABELS: Record<string, string> = {
  zillow_api: 'Zillow',
  airbnb_api: 'Airbnb',
  streeteasy_scrape: 'StreetEasy',
  craigslist_scrape: 'Craigslist',
};

export function ListingDetailModal({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const listing = item.listing;
  const images = listing.images?.length > 0 ? listing.images : listing.image_url ? [listing.image_url] : [];
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative h-72 md:h-96 bg-gray-100">
            <img
              src={images[currentImg]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImg((p) => (p - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImg((p) => (p + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImg(i)}
                      className={`w-2 h-2 rounded-full transition ${i === currentImg ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{listing.title || 'Untitled'}</h2>
              <p className="text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {listing.neighborhood || 'Unknown'}, NYC
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-gray-900">
                ${listing.monthly_rent?.toLocaleString() ?? '???'}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>
          </div>

          {/* Rating */}
          {listing.rating && (
            <div className="mt-3 flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{listing.rating}</span>
              <span className="text-gray-500">({listing.reviews_count} reviews)</span>
            </div>
          )}

          {/* Specs grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <Bed className="w-5 h-5 mx-auto text-gray-400" />
              <div className="font-semibold mt-1">{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} BR`}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <Bath className="w-5 h-5 mx-auto text-gray-400" />
              <div className="font-semibold mt-1">{listing.bathrooms} BA</div>
            </div>
            {listing.sqft && (
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <Maximize className="w-5 h-5 mx-auto text-gray-400" />
                <div className="font-semibold mt-1">{listing.sqft} sqft</div>
              </div>
            )}
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <PawPrint className="w-5 h-5 mx-auto text-gray-400" />
              <div className="font-semibold mt-1">{listing.pet_policy}</div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">About this place</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Cost breakdown */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent</span>
                <span className="font-medium">${listing.monthly_rent?.toLocaleString()}</span>
              </div>
              {listing.cleaning_fee != null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning Fee</span>
                  <span className="font-medium">${listing.cleaning_fee}</span>
                </div>
              )}
              {listing.service_fee != null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${listing.service_fee}</span>
                </div>
              )}
              {listing.deposit != null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-medium">${listing.deposit}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Effective Monthly Cost</span>
                <span>${item.effective_cost?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Score & Analysis */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Score Analysis</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className={`text-3xl font-bold ${item.score >= 70 ? 'text-green-600' : item.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {item.score}
                </div>
                <div className="text-sm text-gray-500">
                  <div>out of 100</div>
                  <div>{Math.round((item.confidence || 0) * 100)}% confidence</div>
                </div>
              </div>
              {item.why_selected.length > 0 && (
                <div className="space-y-1">
                  {item.why_selected.map((reason: string) => (
                    <div key={reason} className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 shrink-0" /> {reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Commute & Risks</h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium mb-3 ${
                item.commute_summary.classification === 'GOOD'
                  ? 'bg-green-50 text-green-700'
                  : item.commute_summary.classification === 'OK'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                <Clock className="w-4 h-4" />
                {item.commute_summary.low_minutes}-{item.commute_summary.high_minutes} min ({item.commute_summary.classification})
              </div>
              {item.risks.length > 0 && (
                <div className="space-y-1">
                  {item.risks.map((risk: string) => (
                    <div key={risk} className="flex items-center gap-2 text-sm text-amber-700">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {risk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Available: {listing.available_from} to {listing.available_to}</span>
            <span>&middot;</span>
            <span>Min stay: {listing.min_stay_days} days</span>
          </div>

          {/* Sources */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sources:</span>
            {item.sources.map((s: any) => (
              isRealUrl(s.url) ? (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {SOURCE_LABELS[s.id] || s.id} <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span key={s.url} className="inline-flex items-center gap-1 text-sm text-gray-500">
                  {SOURCE_LABELS[s.id] || s.id} (demo data)
                </span>
              )
            ))}
          </div>

          {/* Close */}
          {!images.length && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
