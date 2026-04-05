const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function getLocationSuggestions(query: string, limit: number = 8) {
  const res = await fetch(
    `${API_BASE}/locations/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.suggestions || [];
}

export async function runSearch(payload: any) {
  const res = await fetch(`${API_BASE}/search/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Search failed with status ${res.status}`);
  }

  return res.json();
}

export async function shortlistListing(listingId: string) {
  const res = await fetch(`${API_BASE}/shortlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingId, state: 'SHORTLISTED' }),
  });
  return res.json();
}

export async function rejectListing(listingId: string) {
  const res = await fetch(`${API_BASE}/shortlist/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingId }),
  });
  return res.json();
}

export async function compareListings(listingIds: string[]) {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listings: listingIds }),
  });
  return res.json();
}

export async function fetchNeighborhoodInsights(neighborhood: string) {
  const res = await fetch(`${API_BASE}/neighborhoods/${encodeURIComponent(neighborhood)}`);
  if (!res.ok) return null;
  return res.json();
}
