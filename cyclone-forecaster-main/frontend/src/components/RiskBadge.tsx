const riskStyles: Record<string, string> = {
  severe: "bg-red-600/20 text-red-400 border-red-600/50",
  high: "bg-orange-600/20 text-orange-400 border-orange-600/50",
  moderate: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50",
  low: "bg-green-600/20 text-green-400 border-green-600/50",
};

export default function RiskBadge({
  riskLevel,
  riskScore,
}: {
  riskLevel: string;
  riskScore: number;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm font-semibold ${riskStyles[riskLevel] || riskStyles.low}`}
    >
      <span className="uppercase tracking-wide">{riskLevel}</span>
      <span className="opacity-70">•</span>
      <span>{riskScore}/100</span>
    </div>
  );
}
