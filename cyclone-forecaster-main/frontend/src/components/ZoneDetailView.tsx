import { useEffect, useState } from "react";
import { fetchZone, fetchRiskAssessment } from "../api";
import type { Zone, RiskAssessment } from "../types";
import RiskBadge from "./RiskBadge";

const profileLabel: Record<string, string> = {
  poor: "Poor",
  moderate: "Moderate",
  good: "Good",
  low: "Low",
  medium: "Medium",
  high: "High",
  underground: "Underground",
  "overhead-reinforced": "Overhead (Reinforced)",
  "overhead-exposed": "Overhead (Exposed)",
};

export default function ZoneDetailView({
  zoneId,
  cycloneId,
  onBack,
}: {
  zoneId: string;
  cycloneId: string | null;
  onBack: () => void;
}) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchZone(zoneId).then(setZone);
    fetchRiskAssessment(zoneId, cycloneId || undefined)
      .then(setAssessment)
      .finally(() => setLoading(false));
  }, [zoneId, cycloneId]);

  if (!zone) return <p className="text-slate-400">Loading zone…</p>;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm">
        ← Back to Dashboard
      </button>

      <div>
        <h2 className="text-2xl font-bold text-slate-100">{zone.name}</h2>
        <p className="text-slate-400">
          {zone.district} • Population {zone.population_estimate.toLocaleString("en-IN")}
        </p>
      </div>

      {/* AI Risk Assessment — the human augmentation moment */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-100">Risk Assessment</h3>
          {assessment && (
            <RiskBadge riskLevel={assessment.risk_level} riskScore={assessment.risk_score} />
          )}
        </div>
        {loading && <p className="text-slate-400 text-sm">Analyzing…</p>}
        {assessment && !loading && (
          <div className="space-y-3">
            <p className="text-slate-300">{assessment.reasoning}</p>
          </div>
        )}
      </div>
    </div>
  );
}