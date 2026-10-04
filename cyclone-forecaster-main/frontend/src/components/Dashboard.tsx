import { useEffect, useState } from "react";
import { fetchDashboard, reportDownloadUrl } from "../api";
import type { DashboardEntry } from "../types";
import RiskBadge from "./RiskBadge";
import MapView from "./MapView";

export default function Dashboard({
  cycloneId,
  onSelect,
}: {
  cycloneId: string | null;
  onSelect: (zoneId: string) => void;
}) {
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!cycloneId) return;
    setLoading(true);
    fetchDashboard(cycloneId)
      .then((res) => setEntries(res.zones))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycloneId]);

  if (loading) {
    return <p className="text-slate-400">Loading dashboard…</p>;
  }

  if (error) {
    return (
      <p className="text-red-400">
        Couldn't reach the backend ({error}). Is the FastAPI server running?
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">Response Priority Dashboard</h2>
        <div className="flex gap-3">
        <a
            href={reportDownloadUrl(cycloneId || undefined)}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Download PDF Report
          </a>
          <button
            onClick={load}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Refresh
          </button>
        </div>
      </div>

      <MapView zones={entries} />

      <div className="grid gap-3">
        {entries.map((e) => (
          <button
            key={e.zone_id}
            onClick={() => onSelect(e.zone_id)}
            className="text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl p-4 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-100">{e.zone_name}</h3>
                <p className="text-sm text-slate-400">
                  {e.district} • Pop. {e.population_estimate.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-slate-500 mt-1">{e.top_factor}</p>
              </div>
              <RiskBadge riskLevel={e.risk_level} riskScore={e.risk_score} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}