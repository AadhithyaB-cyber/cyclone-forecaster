import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DashboardEntry } from "../types";

const riskColor: Record<string, string> = {
  severe: "#dc2626",
  high: "#ea580c",
  moderate: "#ca8a04",
  low: "#16a34a",
};

export default function MapView({ zones }: { zones: DashboardEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || zones.length === 0) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        [zones[0].lat, zones[0].lng],
        10
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // clear old markers before re-adding
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    zones.forEach((z) => {
      const marker = L.circleMarker([z.lat, z.lng], {
        radius: 10,
        color: riskColor[z.risk_level] || "#16a34a",
        fillColor: riskColor[z.risk_level] || "#16a34a",
        fillOpacity: 0.7,
      })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${z.zone_name}</strong><br/>Risk: ${z.risk_level} (${z.risk_score}/100)`);
      markersRef.current.push(marker);
    });
  }, [zones]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-slate-700"
      style={{ height: 350 }}
    />
  );
}