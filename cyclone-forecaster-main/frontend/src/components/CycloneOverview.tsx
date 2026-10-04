import { useEffect, useState } from "react";
import { fetchCyclone } from "../api";
import type { Cyclone } from "../types";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CycloneOverview({ cycloneId }: { cycloneId: string | null }) {
  const [cyclone, setCyclone] = useState<Cyclone | null>(null);

  useEffect(() => {
    if (cycloneId) fetchCyclone(cycloneId).then(setCyclone);
  }, [cycloneId]);

  if (!cyclone) return null;

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-400 font-semibold mb-1">
            {cyclone.status}
          </p>
          <h2 className="text-xl font-bold text-slate-100">{cyclone.name}</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-400">
            {cyclone.current_wind_speed_kmh} km/h
          </p>
          <p className="text-xs text-slate-400">current wind speed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Predicted Landfall</p>
          <p className="text-slate-200 mt-0.5">{cyclone.landfall_location}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Landfall ETA</p>
          <p className="text-slate-200 mt-0.5">{formatDateTime(cyclone.landfall_eta)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Predicted Track</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {cyclone.predicted_path.map((p, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {p.wind_speed_kmh}km/h
                </span>
              </div>
              {i < cyclone.predicted_path.length - 1 && (
                <div className="w-8 h-0.5 bg-slate-700 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}