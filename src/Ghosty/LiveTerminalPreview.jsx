import React from "react";

export default function LiveTerminalPreview({ config }) {
  const accent = config["cursor-color"] || "#7de3a5";
  const accent2 = "#ffd479";

  const style = {
    backgroundColor: config["background"] || "#0f0f0f",
    color: config["foreground"] || "#e5e5e5",
    fontFamily:
      config["font-family"] ||
      "\"JetBrains Mono\", \"SF Mono\", ui-monospace, monospace",
    fontSize: `${config["font-size"] || 14}px`,
    lineHeight: config["adjust-cell-height"]
      ? `calc(1.2 + ${config["adjust-cell-height"]})`
      : "1.4",
    padding: `${config["window-padding-y"] || 12}px ${
      config["window-padding-x"] || 12
    }px`,
    opacity: config["background-opacity"] ?? 1,
  };

  const cursorStyle =
    config["cursor-style"] === "underline"
      ? "underline"
      : config["cursor-style"] === "bar"
      ? "bar"
      : "block";

  return (
    <div className="h-full flex items-center justify-center bg-[var(--bg-1)] p-4 sm:p-6">
      <div
        className="rounded-xl shadow-[var(--shadow-strong)] overflow-hidden border border-[var(--border-1)]"
        style={{
          width: 560,
          height: 360,
          background: style.backgroundColor,
          opacity: style.opacity,
        }}
      >
        {/* TOP STATUS BAR */}
        <div className="h-7 bg-[var(--bg-2)] border-b border-[var(--border-1)] flex items-center justify-between px-3 text-[11px] text-[var(--text-2)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-3)]">ghostty</span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-3)] text-[10px]">
              CPU 12%
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[var(--bg-3)] text-[10px]">
              RAM 3.1 GB
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Wi-Fi</span>
            <span>Battery 86%</span>
            <span>11:42</span>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="h-8 bg-[var(--bg-2)] border-b border-[var(--border-1)] flex items-center px-2 gap-2 text-xs">
          <Tab label="zsh — repo" active accent={accent} />
          <Tab label="server.log" />
          <Tab label="notes.md" />
        </div>

        {/* TERMINAL */}
        <div className="h-[calc(100%-3.75rem)] font-mono relative" style={style}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "100% 3px",
              opacity: 0.12,
              mixBlendMode: "soft-light",
            }}
          />
          <div className="relative z-10 space-y-1">
            <Line>
              <Prompt accent={accent} accent2={accent2} />
              {" "}neofetch
            </Line>
            <Line>
              <span style={{ color: accent2 }}>OS:</span> Ghostty Noir
              {"  "}
              <span style={{ color: accent2 }}>Kernel:</span> 6.6.2
            </Line>
            <Line>
              <span style={{ color: accent2 }}>Shell:</span> zsh 5.9
              {"  "}
              <span style={{ color: accent2 }}>Uptime:</span> 2h 14m
            </Line>
            <Line>
              <span style={{ color: accent2 }}>Theme:</span>{" "}
              {config["theme"] || "custom"}
            </Line>
            <Line> </Line>
            <Line>
              <Prompt accent={accent} accent2={accent2} path="~/projects/ghosty" git="main" />
              {" "}ls -la
            </Line>
            <Line>
              <span style={{ color: accent2 }}>config</span>{"  "}
              presets{"  "}
              src{"  "}
              README.md
            </Line>
            <Line>
              <Prompt accent={accent} accent2={accent2} path="~/projects/ghosty" git="main" />
              {" "}git status
            </Line>
            <Line>
              On branch <span style={{ color: accent }}>main</span>, clean
            </Line>
            <Line>
              <Prompt accent={accent} accent2={accent2} path="~/projects/ghosty" git="main" />
              {" "}ghostty --validate
            </Line>
            <Line>
              <span style={{ color: accent }}>[ok]</span>{" "}
              config valid - 42 options loaded
            </Line>
            <Line>
              <Prompt accent={accent} accent2={accent2} />
              {" "}cat logs.txt
            </Line>
            <Line>
              <span style={{ color: accent2 }}>warn:</span> cursor blink
              disabled in current theme
            </Line>
            <Line>
              <span style={{ color: "#ff7b72" }}>error:</span> missing font
              fallback resolved
            </Line>
            <Line>
              <Prompt accent={accent} accent2={accent2} />
              {" "}_
              <Cursor type={cursorStyle} />
            </Line>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ children }) {
  return <div className="whitespace-pre">{children}</div>;
}

function Tab({ label, active, accent }) {
  return (
    <div
      className={`px-2 py-1 rounded-t text-[11px] border ${
        active
          ? "bg-[var(--bg-3)] border-[var(--border-1)]"
          : "bg-[var(--bg-2)] border-transparent text-[var(--text-3)]"
      }`}
      style={active ? { boxShadow: `0 0 12px ${accent}33` } : {}}
    >
      {label}
    </div>
  );
}

function Prompt({ accent, accent2 = "#ffd479", path = "~", git = "main" }) {
  return (
    <span>
      <span style={{ color: accent }}>dev@ghostty</span>
      <span style={{ color: "#7a8b83" }}>:</span>
      <span style={{ color: "#b7c7bf" }}>{path}</span>
      <span style={{ color: "#7a8b83" }}> (</span>
      <span style={{ color: accent }}>{git}</span>
      <span style={{ color: "#7a8b83" }}> )</span>
      <span style={{ color: accent2 }}> &gt;</span>
    </span>
  );
}

function Cursor({ type }) {
  if (type === "underline") {
    return <span className="inline-block w-3 h-[2px] bg-white align-bottom" />;
  }

  if (type === "bar") {
    return <span className="inline-block w-[2px] h-4 bg-white" />;
  }

  return (
    <span className="inline-block w-3 h-4 bg-white align-middle opacity-80" />
  );
}
