"use client";

import { CustomRadarMap, type MapVenue } from "@/components/custom-radar-map";

export function DynamicMap(props: {
  venues: MapVenue[];
  center?: [number, number];
  zoom?: number;
}) {
  return <CustomRadarMap {...props} />;
}