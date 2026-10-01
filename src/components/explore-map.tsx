"use client";

import { CustomRadarMap, type MapVenue } from "@/components/custom-radar-map";

export type { MapVenue };

export function ExploreMap({
  venues,
  center,
  zoom,
}: {
  venues: MapVenue[];
  center?: [number, number];
  zoom?: number;
}) {
  return <CustomRadarMap venues={venues} center={center} zoom={zoom} />;
}