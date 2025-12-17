import { useMemo, useState } from "react";
import { LayoutList } from "lucide-react";

import { SCHEMA } from "./Ghosty/config/config";
import ConfigGenerator from "./Ghosty/ConfigGenerator";
import PresetExplorer from "./Ghosty/PresetExplorer";
import { serializeConfig } from "./Ghosty/config/serializeConfig";
import LiveTerminalPreview from "./Ghosty/LiveTerminalPreview";

export default function App() {
  const [config, setConfig] = useState({});
  const [tab, setTab] = useState("config");
  const [showPreview, setShowPreview] = useState(true);

  const exported = useMemo(
    () => serializeConfig(SCHEMA, config),
    [config]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="font-semibold">Ghostty Config Generator</h2>

        <div className="flex gap-2">
          <button
            onClick={() => setTab("presets")}
            className={`p-2 rounded ${
              tab === "presets" ? "bg-indigo-600" : "bg-zinc-800"
            }`}
            title="Presets"
          >
            <LayoutList size={14} />
          </button>

          <button
            onClick={() => setTab("config")}
            className={`p-2 rounded ${
              tab === "config" ? "bg-indigo-600" : "bg-zinc-800"
            }`}
            title="Editor"
          >
            Editor
          </button>

          {tab === "config" && (
            <button
              onClick={() => setShowPreview(v => !v)}
              className="p-2 bg-zinc-800 rounded"
              title="Toggle preview"
            >
              Preview
            </button>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* CONFIG EDITOR */}
        {tab === "config" && (
          <>
            <div className="flex-1 overflow-hidden">
              <ConfigGenerator
                schema={SCHEMA}
                value={config}
                onChange={setConfig}
              />
            </div>

            {showPreview && (
              <div className="w-[420px] border-l border-zinc-800">
                <LiveTerminalPreview config={config} />
              </div>
            )}
          </>
        )}

        {/* PRESETS */}
        {tab === "presets" && (
          <div className="flex-1 overflow-hidden">
            <PresetExplorer
              schema={SCHEMA}
              onApply={(c) => {
                setConfig(c);
                setTab("config");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
