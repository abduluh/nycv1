'use client';

import { Home, DollarSign, TrendingUp, XCircle, Search } from 'lucide-react';

export function StatsBar({
  results,
  rejected,
  loading,
}: {
  results: any[];
  rejected: any[];
  loading: boolean;
}) {
  const avgRent = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.listing.monthly_rent ?? 0), 0) / results.length)
    : 0;
  const avgScore = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
    : 0;
  const sources = new Set(results.flatMap((r) => r.sources.map((s: any) => s.id)));

  const stats = [
    {
      icon: Home,
      label: 'Listings Found',
      value: results.length,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: DollarSign,
      label: 'Avg Rent',
      value: avgRent > 0 ? `$${avgRent.toLocaleString()}` : '—',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'Avg Score',
      value: avgScore > 0 ? `${avgScore}/100` : '—',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: XCircle,
      label: 'Rejected',
      value: rejected.length,
      color: 'text-red-600 bg-red-50',
    },
    {
      icon: Search,
      label: 'Sources',
      value: sources.size > 0 ? sources.size : '—',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-500">{stat.label}</div>
            <div className="text-lg font-bold text-gray-900">
              {loading ? '...' : stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
