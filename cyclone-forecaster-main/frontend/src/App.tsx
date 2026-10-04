import { useState } from "react";
import CycloneOverview from "./components/CycloneOverview";
import CycloneSelector from "./components/CycloneSelector";
import Dashboard from "./components/Dashboard";
import ZoneDetailView from "./components/ZoneDetailView";

export default function App() {
  const [cycloneId, setCycloneId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0b1220]">
      <header className="border-b border-slate-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Cyclone Impact <span className="text-blue-400">& Infrastructure Vulnerability Forecaster</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI-augmented risk ranking for disaster response officers.
            </p>
          </div>
          <CycloneSelector selectedId={cycloneId} onChange={setCycloneId} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <CycloneOverview cycloneId={cycloneId} />
        {selected ? (
          <ZoneDetailView zoneId={selected} cycloneId={cycloneId} onBack={() => setSelected(null)} />
        ) : (
          <Dashboard cycloneId={cycloneId} onSelect={setSelected} />
        )}
      </main>
    </div>
  );
}