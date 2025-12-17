import React from "react";

export default function LiveTerminalPreview({ config }) {
  const style = {
    backgroundColor: config["background"] || "#0f0f0f",
    color: config["foreground"] || "#e5e5e5",
    fontFamily: config["font-family"] || "monospace",
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
    <div className="h-full flex items-center justify-center bg-zinc-900 p-6">
      <div
        className="rounded-lg shadow-xl overflow-hidden"
        style={{
          width: 520,
          height: 320,
          background: style.backgroundColor,
          opacity: style.opacity,
        }}
      >
        {/* TITLE BAR */}
        <div className="h-7 bg-zinc-800 flex items-center px-3 text-xs text-zinc-300">
          {config["title"] || "Ghostty Preview"}
        </div>

        {/* TERMINAL */}
        <div className="h-full font-mono" style={style}>
          <Line>$ echo "Hello Ghostty"</Line>
          <Line>Hello Ghostty</Line>
          <Line>$ ls</Line>
          <Line>src  config  README.md</Line>
          <Line>
            $ <Cursor type={cursorStyle} />
          </Line>
        </div>
      </div>
    </div>
  );
}

function Line({ children }) {
  return <div className="whitespace-pre">{children}</div>;
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
