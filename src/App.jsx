import { useMemo, useState } from "react";
import { LayoutList, Monitor, Settings, Copy, Download } from "lucide-react";

import { SCHEMA } from "./Ghosty/config/config";
import ConfigGenerator from "./Ghosty/ConfigGenerator";
import PresetExplorer from "./Ghosty/PresetExplorer";
import { serializeConfig } from "./Ghosty/config/serializeConfig";
import PreviewManager from "./Ghosty/PreviewManager";

export default function App() {
  const [config, setConfig] = useState({});
  const [tab, setTab] = useState("config");
  const [showPreview, setShowPreview] = useState(false); // hidden by default on mobile

  const exported = useMemo(
    () => serializeConfig(SCHEMA, config),
    [config]
  );

  function copyConfig() {
    navigator.clipboard.writeText(exported);
  }

  function downloadConfig() {
    const blob = new Blob([exported], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ghostty.conf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-0)] text-[var(--text-1)]">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}
      <header className="flex items-center justify-between gap-3 px-3 py-2 sm:px-5 sm:py-3 border-b border-[var(--border-1)] bg-[var(--bg-1)]">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--glow)]" />
          <div>
            <h2 className="font-semibold text-sm sm:text-base tracking-wide">
              Ghostty Config Manager
            </h2>
            <p className="text-[11px] text-[var(--text-3)]">
              Terminal Noir edition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-[var(--bg-2)] p-1 rounded-full border border-[var(--border-1)]">
          {/* Presets */}
          <button
            onClick={() => setTab("presets")}
            className={`p-2 rounded-full transition ${
              tab === "presets"
                ? "bg-[var(--accent)] text-black shadow-[0_0_14px_var(--glow)]"
                : "bg-transparent text-[var(--text-2)] hover:bg-[var(--bg-3)]"
            }`}
            title="Presets"
          >
            <LayoutList size={16} />
          </button>

          {/* Editor */}
          <button
            onClick={() => setTab("config")}
            className={`p-2 rounded-full transition ${
              tab === "config"
                ? "bg-[var(--accent)] text-black shadow-[0_0_14px_var(--glow)]"
                : "bg-transparent text-[var(--text-2)] hover:bg-[var(--bg-3)]"
            }`}
            title="Editor"
          >
            <Settings size={16} />
          </button>

          {/* Preview toggle (mobile + desktop) */}
          {tab === "config" && (
            <button
              onClick={() => setShowPreview(v => !v)}
              className={`p-2 rounded-full transition ${
                showPreview
                  ? "bg-[var(--accent-2)] text-black shadow-[0_0_12px_rgba(255,212,121,0.35)]"
                  : "bg-transparent text-[var(--text-2)] hover:bg-[var(--bg-3)]"
              }`}
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
                  border-t border-[var(--border-1)] bg-[var(--bg-1)]
                  sm:static sm:h-auto sm:w-[440px] sm:border-l sm:border-t-0
                "
              >
                <PreviewManager
                  title="Preview Manager"
                  subtitle="Live terminal + exported config"
                  config={config}
                  configText={exported}
                  actions={
                    <>
                      <button
                        onClick={copyConfig}
                        className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                        title="Copy config"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={downloadConfig}
                        className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                        title="Download config"
                      >
                        <Download size={14} />
                      </button>
                    </>
                  }
                />
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
