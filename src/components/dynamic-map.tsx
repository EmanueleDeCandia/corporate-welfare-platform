"use client";

import dynamic from "next/dynamic";
import type { MapVenue } from "@/components/explore-map";

const ExploreMap = dynamic(() => import("@/components/explore-map").then((mod) => mod.ExploreMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-mist text-sm text-olive">Caricamento mappa…</div>
  ),
});

export function DynamicMap(props: {
  venues: MapVenue[];
  center?: [number, number];
  zoom?: number;
}) {
  return <ExploreMap {...props} />;
}