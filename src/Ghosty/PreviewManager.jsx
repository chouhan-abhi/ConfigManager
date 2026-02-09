import React, { useMemo, useState } from "react";
import { Monitor, Code2, Sparkles } from "lucide-react";
import LiveTerminalPreview from "./LiveTerminalPreview";

export default function PreviewManager({
  title,
  subtitle,
  config,
  configText,
  actions,
}) {
  const [tab, setTab] = useState("preview");

  const safeConfigText = useMemo(
    () => (typeof configText === "string" ? configText : ""),
    [configText]
  );

  const meta = {
    theme: config?.theme || config?.["theme"] || "custom",
    font: config?.["font-family"] || "JetBrains Mono",
    size: config?.["font-size"] || 14,
    opacity:
      config?.["background-opacity"] ??
      config?.["background-image-opacity"] ??
      1,
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--bg-1)]">
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-1)] px-3 py-2">
          <div>
            {title && (
              <div className="text-sm font-semibold leading-tight">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-xs text-[var(--text-3)]">{subtitle}</div>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-1)] px-3 py-2 text-xs">
        <div className="flex items-center gap-2 rounded-full bg-[var(--bg-2)] p-1 border border-[var(--border-1)]">
          <button
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1 rounded-full px-2 py-1 transition ${
              tab === "preview"
                ? "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--glow)]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-3)]"
            }`}
          >
            <Monitor size={14} />
            Preview
          </button>
          <button
            onClick={() => setTab("config")}
            className={`flex items-center gap-1 rounded-full px-2 py-1 transition ${
              tab === "config"
                ? "bg-[var(--accent)] text-black shadow-[0_0_12px_var(--glow)]"
                : "text-[var(--text-2)] hover:bg-[var(--bg-3)]"
            }`}
          >
            <Code2 size={14} />
            Config
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[var(--text-3)]">
          <Sparkles size={12} />
          <span>theme: {meta.theme}</span>
          <span>font: {meta.font}</span>
          <span>size: {meta.size}px</span>
          <span>opacity: {meta.opacity}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === "preview" ? (
          <LiveTerminalPreview config={config || {}} />
        ) : (
          <pre className="h-full overflow-auto bg-black p-3 text-sm font-mono text-[var(--text-2)]">
{safeConfigText || "# No config available"}
          </pre>
        )}
      </div>
    </div>
  );
}
