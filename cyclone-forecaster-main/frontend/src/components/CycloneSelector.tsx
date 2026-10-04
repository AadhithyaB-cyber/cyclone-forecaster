import { useEffect, useState } from "react";
import { fetchCyclones } from "../api";
import type { Cyclone } from "../types";

export default function CycloneSelector({
  selectedId,
  onChange,
}: {
  selectedId: string | null;
  onChange: (id: string) => void;
}) {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);

  useEffect(() => {
    fetchCyclones().then((list) => {
      setCyclones(list);
      if (!selectedId && list.length) onChange(list[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <select
      value={selectedId || ""}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm"
    >
      {cyclones.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}