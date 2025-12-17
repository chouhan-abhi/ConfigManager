import React, { useState } from "react";
import { Copy, Edit, Check } from "lucide-react";
import presets from "./preset/systemPresets.json";
import { parseConfig } from "./config/parseConfig";

export default function PresetExplorer({ schema, onApply }) {
  const [active, setActive] = useState(null);

  const selected = presets.find(p => p.id === active);

  return (
    <div className="flex h-full w-screen">
      {/* PRESET LIST */}
      <aside className="w-72 border-r border-zinc-800 p-3 space-y-2 overflow-auto">
        <h3 className="text-sm font-semibold mb-2 opacity-80">Presets</h3>

        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`w-full text-left p-2 rounded border ${
              active === p.id
                ? "border-indigo-600 bg-zinc-800"
                : "border-zinc-700 hover:bg-zinc-900"
            }`}
          >
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-xs opacity-60">{p.description}</div>
          </button>
        ))}
      </aside>

      {/* PREVIEW */}
      <main className="flex-1 p-4 space-y-3">
        {!selected && (
          <div className="opacity-60 text-sm">
            Select a preset to preview.
          </div>
        )}

        {selected && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <p className="text-xs opacity-60">{selected.category}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(selected.config)
                  }
                  className="p-2 bg-zinc-800 rounded"
                  title="Copy config"
                >
                  <Copy size={14} />
                </button>

                <button
                  onClick={() =>
                    onApply(parseConfig(selected.config, schema))
                  }
                  className="p-2 bg-indigo-600 rounded"
                  title="Edit this preset"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>

            <pre className="bg-black rounded p-3 text-sm font-mono overflow-auto h-[60vh]">
{selected.config}
            </pre>
          </>
        )}
      </main>
    </div>
  );
}
