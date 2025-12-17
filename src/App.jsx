import { useMemo, useState } from "react";
import { LayoutList, Monitor, Settings } from "lucide-react";

import { SCHEMA } from "./Ghosty/config/config";
import ConfigGenerator from "./Ghosty/ConfigGenerator";
import PresetExplorer from "./Ghosty/PresetExplorer";
import { serializeConfig } from "./Ghosty/config/serializeConfig";
import LiveTerminalPreview from "./Ghosty/LiveTerminalPreview";

export default function App() {
  const [config, setConfig] = useState({});
  const [tab, setTab] = useState("config");
  const [showPreview, setShowPreview] = useState(false); // hidden by default on mobile

  const exported = useMemo(
    () => serializeConfig(SCHEMA, config),
    [config]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}
      <header className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 border-b border-zinc-800">
        <h2 className="font-semibold text-sm sm:text-base truncate">
          Ghostty Config Generator
        </h2>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Presets */}
          <button
            onClick={() => setTab("presets")}
            className={`p-2 rounded ${
              tab === "presets" ? "bg-indigo-600" : "bg-zinc-800"
            }`}
            title="Presets"
          >
            <LayoutList size={16} />
          </button>

          {/* Editor */}
          <button
            onClick={() => setTab("config")}
            className={`p-2 rounded ${
              tab === "config" ? "bg-indigo-600" : "bg-zinc-800"
            }`}
            title="Editor"
          >
            <Settings size={16} />
          </button>

          {/* Preview toggle (mobile + desktop) */}
          {tab === "config" && (
            <button
              onClick={() => setShowPreview(v => !v)}
              className="p-2 bg-zinc-800 rounded"
              title="Preview"
            >
              <Monitor size={16} />
            </button>
          )}
        </div>
      </header>

      {/* -------------------------------------------------- */}
      {/* BODY */}
      {/* -------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= CONFIG EDITOR ================= */}
        {tab === "config" && (
          <>
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <ConfigGenerator
                schema={SCHEMA}
                value={config}
                onChange={setConfig}
              />
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div
                className="
                  fixed inset-x-0 bottom-0 h-[45%] z-40
                  border-t border-zinc-800 bg-zinc-950
                  sm:static sm:h-auto sm:w-[420px] sm:border-l sm:border-t-0
                "
              >
                <LiveTerminalPreview config={config} />
              </div>
            )}
          </>
        )}

        {/* ================= PRESETS ================= */}
        {tab === "presets" && (
          <div className="flex-1 overflow-hidden">
            <PresetExplorer
              schema={SCHEMA}
              onApply={(c) => {
                setConfig(c);
                setTab("config");
                setShowPreview(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
