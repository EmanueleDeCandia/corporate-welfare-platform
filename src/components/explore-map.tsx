"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import { venueTypeLabel } from "@/lib/utils";

export type MapVenue = {
  id: number;
  name: string;
  slug: string;
  type: string;
  city: string;
  lat: number;
  lng: number;
};

const typeColor: Record<string, string> = {
  hotel: "#1C3A2E",
  agriturismo: "#C45C26",
  theater: "#7A2E32",
  restaurant: "#B8954A",
};

function markerIcon(type: string) {
  const color = typeColor[type] ?? "#1C3A2E";
  return L.divIcon({
    className: "radici-marker",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -24],
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${color};border:3px solid #FBF7F0;box-shadow:0 8px 18px rgba(16,36,28,.35)"></div>`,
  });
}

export function ExploreMap({
  venues,
  center = [42.7, 12.6],
  zoom = 6,
}: {
  venues: MapVenue[];
  center?: [number, number];
  zoom?: number;
}) {
  useEffect(() => {
    // Avoid default leaflet icon requests that break under bundlers.
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {venues.map((venue) => (
        <Marker key={venue.id} position={[venue.lat, venue.lng]} icon={markerIcon(venue.type)}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="text-[10px] uppercase tracking-[0.14em] text-olive">
                {venueTypeLabel(venue.type)}
              </p>
              <p className="font-serif text-lg text-forest">{venue.name}</p>
              <p className="text-xs text-olive">{venue.city}</p>
              <Link href={`/strutture/${venue.slug}`} className="mt-2 inline-block text-xs text-terracotta">
                Apri scheda →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}