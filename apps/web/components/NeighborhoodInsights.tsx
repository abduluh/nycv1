'use client';

import { TrendingUp, Users, Train, Coffee, ShieldCheck, DollarSign } from 'lucide-react';

type NeighborhoodData = {
  name: string;
  count: number;
  avgRent: number;
  avgScore: number;
};

const NEIGHBORHOOD_INFO: Record<string, { vibe: string; transit: string; walkScore: number; safety: string }> = {
  'Midtown': { vibe: 'Business hub, tourist-heavy, 24/7 energy', transit: 'All major lines', walkScore: 98, safety: 'High' },
  'Chelsea': { vibe: 'Art galleries, High Line, foodie paradise', transit: 'A/C/E, 1/2/3, L', walkScore: 97, safety: 'High' },
  'Upper East Side': { vibe: 'Classic NYC elegance, museums, quiet streets', transit: '4/5/6, Q', walkScore: 95, safety: 'Very High' },
  'Upper West Side': { vibe: 'Family-friendly, Central Park, intellectual', transit: '1/2/3, B/C', walkScore: 96, safety: 'Very High' },
  'West Village': { vibe: 'Charming streets, brownstones, nightlife', transit: '1/2/3, A/C/E', walkScore: 99, safety: 'High' },
  'East Village': { vibe: 'Young, artsy, diverse food scene', transit: 'L, 6, F', walkScore: 98, safety: 'Moderate-High' },
  'SoHo': { vibe: 'Shopping, cast-iron architecture, trendy', transit: 'N/R, 6, C/E', walkScore: 99, safety: 'High' },
  'Tribeca': { vibe: 'Upscale family area, loft living', transit: '1/2/3, A/C', walkScore: 96, safety: 'Very High' },
  'Flatiron': { vibe: 'Madison Square Park, tech offices, dining', transit: 'N/R/W, 6, F', walkScore: 98, safety: 'High' },
  'Gramercy': { vibe: 'Quiet, exclusive park, residential', transit: '6, L', walkScore: 97, safety: 'Very High' },
  'Murray Hill': { vibe: 'Young professionals, restaurants, bars', transit: '6, 7', walkScore: 96, safety: 'High' },
  "Hell's Kitchen": { vibe: 'Theater, restaurants, rapidly developing', transit: 'A/C/E, N/Q/R', walkScore: 97, safety: 'Moderate-High' },
  'Financial District': { vibe: 'Historic, waterfront, post-work quiet', transit: 'All major lines', walkScore: 97, safety: 'High' },
  'Williamsburg': { vibe: 'Hipster haven, waterfront, nightlife', transit: 'L, G, J/M', walkScore: 93, safety: 'Moderate-High' },
  'Long Island City': { vibe: 'Rapid growth, skyline views, affordable', transit: '7, N/W, E/M', walkScore: 89, safety: 'Moderate' },
  'Astoria': { vibe: 'Diverse food, families, great value', transit: 'N/W, M/R', walkScore: 92, safety: 'Moderate-High' },
  'Lower East Side': { vibe: 'Nightlife, art, eclectic food', transit: 'F, J/M/Z', walkScore: 98, safety: 'Moderate' },
};

export function NeighborhoodInsights({ items }: { items: any[] }) {
  // Aggregate by neighborhood
  const neighborhoods = new Map<string, { rents: number[]; scores: number[] }>();

  items.forEach((item) => {
    const hood = item.listing.neighborhood;
    if (!hood) return;
    if (!neighborhoods.has(hood)) {
      neighborhoods.set(hood, { rents: [], scores: [] });
    }
    const data = neighborhoods.get(hood)!;
    if (item.listing.monthly_rent) data.rents.push(item.listing.monthly_rent);
    data.scores.push(item.score);
  });

  const stats: NeighborhoodData[] = Array.from(neighborhoods.entries())
    .map(([name, { rents, scores }]) => ({
      name,
      count: rents.length,
      avgRent: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  if (stats.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Neighborhood Insights</h3>
        <p className="text-gray-500 text-sm">Run a search to see neighborhood analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Insights</h3>
      <div className="space-y-4">
        {stats.map((hood) => {
          const info = NEIGHBORHOOD_INFO[hood.name];
          return (
            <div key={hood.name} className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{hood.name}</h4>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {hood.count} listing{hood.count > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  Avg: ${hood.avgRent.toLocaleString()}/mo
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  Avg Score: {hood.avgScore}/100
                </div>
              </div>

              {info && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5" /> {info.vibe.split(',')[0]}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5" /> {info.transit.split(',')[0]}...
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Walk Score: {info.walkScore}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Safety: {info.safety}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
