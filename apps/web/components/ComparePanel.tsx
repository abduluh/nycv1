'use client';

import { X, Star, MapPin, DollarSign, Bed, Bath, Shield, Clock } from 'lucide-react';

export function ComparePanel({
  items,
  onClose,
  onRemove,
}: {
  items: any[];
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparing {items.length} listing{items.length > 1 ? 's' : ''}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-500 w-40">Property</th>
                {items.map((item) => (
                  <th key={item.listing.id} className="text-left py-2 px-4 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 truncate max-w-[160px]">
                        {item.listing.title}
                      </span>
                      <button
                        onClick={() => onRemove(item.listing.id)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Neighborhood"
                items={items}
                render={(item) => (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {item.listing.neighborhood || '—'}
                  </span>
                )}
              />
              <CompareRow
                label="Monthly Rent"
                items={items}
                render={(item) => (
                  <span className="font-semibold text-gray-900">
                    ${item.listing.monthly_rent?.toLocaleString() ?? '—'}
                  </span>
                )}
                highlight={(items) => {
                  const min = Math.min(...items.map((i) => i.listing.monthly_rent ?? Infinity));
                  return (item: any) => item.listing.monthly_rent === min;
                }}
              />
              <CompareRow
                label="Effective Cost"
                items={items}
                render={(item) => <span>${item.effective_cost?.toLocaleString() ?? '—'}</span>}
              />
              <CompareRow
                label="Score"
                items={items}
                render={(item) => (
                  <span className={`font-bold ${item.score >= 70 ? 'text-green-600' : item.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {item.score}/100
                  </span>
                )}
                highlight={(items) => {
                  const max = Math.max(...items.map((i) => i.score));
                  return (item: any) => item.score === max;
                }}
              />
              <CompareRow
                label="Bedrooms"
                items={items}
                render={(item) => (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-gray-400" />
                    {item.listing.bedrooms === 0 ? 'Studio' : `${item.listing.bedrooms} BR`}
                  </span>
                )}
              />
              <CompareRow
                label="Bathrooms"
                items={items}
                render={(item) => (
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-gray-400" />
                    {item.listing.bathrooms} BA
                  </span>
                )}
              />
              <CompareRow
                label="Verification"
                items={items}
                render={(item) => {
                  const s = item.listing.verification_status;
                  return (
                    <span className={`flex items-center gap-1 ${s === 'VERIFIED_LIVE' ? 'text-green-600' : s === 'PARTIAL' ? 'text-yellow-600' : 'text-red-600'}`}>
                      <Shield className="w-3.5 h-3.5" /> {s}
                    </span>
                  );
                }}
              />
              <CompareRow
                label="Commute"
                items={items}
                render={(item) => (
                  <span className={`flex items-center gap-1 ${
                    item.commute_summary.classification === 'GOOD' ? 'text-green-600' :
                    item.commute_summary.classification === 'OK' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {item.commute_summary.low_minutes}-{item.commute_summary.high_minutes} min
                  </span>
                )}
              />
              <CompareRow
                label="Pet Policy"
                items={items}
                render={(item) => <span>{item.listing.pet_policy}</span>}
              />
              <CompareRow
                label="Rating"
                items={items}
                render={(item) => item.listing.rating ? (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {item.listing.rating}
                  </span>
                ) : <span className="text-gray-400">—</span>}
              />
              <CompareRow
                label="Source"
                items={items}
                render={(item) => <span>{item.sources.map((s: any) => s.id).join(', ')}</span>}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  items,
  render,
  highlight,
}: {
  label: string;
  items: any[];
  render: (item: any) => React.ReactNode;
  highlight?: (items: any[]) => (item: any) => boolean;
}) {
  const isHighlighted = highlight?.(items);

  return (
    <tr className="border-b border-gray-100">
      <td className="py-2.5 pr-4 font-medium text-gray-500">{label}</td>
      {items.map((item) => (
        <td
          key={item.listing.id}
          className={`py-2.5 px-4 ${isHighlighted?.(item) ? 'bg-green-50' : ''}`}
        >
          {render(item)}
        </td>
      ))}
    </tr>
  );
}
