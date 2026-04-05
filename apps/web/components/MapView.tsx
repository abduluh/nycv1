'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

export function MapView({
  items,
  onSelectListing,
}: {
  items: any[];
  onSelectListing: (item: any) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const container = mapRef.current;

    // Dynamic import for Leaflet (SSR-safe)
    import('leaflet').then((L) => {
      // Guard: container may have been unmounted while import resolved
      if (!container.isConnected) return;

      const map = L.map(container, {
        center: [40.7580, -73.9855], // Midtown NYC
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds: [number, number][] = [];

      items.forEach((item) => {
        const { lat, lng } = item.listing;
        if (lat == null || lng == null) return;

        bounds.push([lat, lng]);

        const scoreColor =
          item.score >= 70 ? '#22c55e' :
          item.score >= 50 ? '#eab308' :
          '#ef4444';

        const icon = L.divIcon({
          html: `<div style="
            background: ${scoreColor};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 11px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">${item.score}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width:200px">
              <strong>${item.listing.title || 'Listing'}</strong><br/>
              <span style="color:#666">${item.listing.neighborhood || ''}</span><br/>
              <strong style="font-size:16px">$${item.listing.monthly_rent?.toLocaleString() ?? '?'}/mo</strong><br/>
              <span>Score: ${item.score}/100</span>
            </div>
          `);

        marker.on('click', () => {
          onSelectListing(item);
        });

        markersRef.current.push(marker);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    });
  }, [items, mapReady, onSelectListing]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
          <div className="text-center text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-2" />
            <p>Run a search to see listings on the map</p>
          </div>
        </div>
      )}
    </div>
  );
}
