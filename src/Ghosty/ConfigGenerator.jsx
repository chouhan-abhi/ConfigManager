import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Info,
  Folder,
  FileText,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------
   MAIN CONFIG GENERATOR (Responsive)
------------------------------------------------------------ */
export default function ConfigGenerator({ schema, value, onChange }) {
  const groups = Object.keys(schema);

  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(groups.map(g => [g, false]))
  );

  const [active, setActive] = useState(() => {
    const g = groups[0];
    const s = Object.keys(schema[g])[0];
    return { group: g, section: s };
  });

  const [showSidebar, setShowSidebar] = useState(false);

  const sectionSchema =
    schema[active.group]?.[active.section] || {};

  const entries = Object.entries(sectionSchema);

  function update(key, v) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-zinc-950">
      {/* -------------------------------------------------- */}
      {/* MOBILE OVERLAY */}
      {/* -------------------------------------------------- */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/60 z-30 sm:hidden"
        />
      )}

      {/* -------------------------------------------------- */}
      {/* DIRECTORY TREE */}
      {/* -------------------------------------------------- */}
      <aside
        className={`
          fixed z-40 inset-y-0 left-0 w-72
          bg-zinc-950 border-r border-zinc-800
          transform transition-transform
          sm:static sm:translate-x-0
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 sm:hidden">
          <span className="text-sm font-semibold">Sections</span>
          <button onClick={() => setShowSidebar(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="p-2 overflow-auto h-full">
          {groups.map(group => (
            <DirectoryGroup
              key={group}
              name={group}
              sections={Object.keys(schema[group])}
              open={openGroups[group]}
              active={active}
              onToggle={() =>
                setOpenGroups(o => ({ ...o, [group]: !o[group] }))
              }
              onSelect={(section) => {
                setActive({ group, section });
                setShowSidebar(false);
              }}
            />
          ))}
        </div>
      </aside>

      {/* -------------------------------------------------- */}
      {/* SETTINGS PANEL */}
      {/* -------------------------------------------------- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
          <button
            onClick={() => setShowSidebar(true)}
            className="sm:hidden p-1.5 bg-zinc-800 rounded"
          >
            <Menu size={16} />
          </button>

          <h2 className="text-sm sm:text-lg font-semibold truncate">
            {active.group} / {active.section}
          </h2>
        </header>

        {/* Settings */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 space-y-3">
          {entries.map(([key, def]) => (
            <SettingRow
              key={key}
              def={def}
              value={value[key]}
              onChange={(v) => update(key, v)}
            />
          ))}

          {entries.length === 0 && (
            <div className="opacity-60 text-sm">
              No settings in this section.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------
   DIRECTORY GROUP
------------------------------------------------------------ */
function DirectoryGroup({
  name,
  sections,
  open,
  active,
  onToggle,
  onSelect,
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-2 py-1 rounded hover:bg-zinc-900"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <Folder size={16} />
        <span className="text-sm font-medium">{name}</span>
      </button>

      {open && (
        <div className="ml-6 mt-1 space-y-1">
          {sections.map(section => {
            const isActive =
              active.group === name && active.section === section;

            return (
              <button
                key={section}
                onClick={() => onSelect(section)}
                className={`flex items-center gap-2 w-full px-2 py-1 rounded text-sm ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-zinc-900 opacity-80"
                }`}
              >
                <FileText size={14} />
                {section}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   SINGLE SETTING ROW
------------------------------------------------------------ */
function SettingRow({ def, value, onChange }) {
  const [open, setOpen] = useState(false);
  const v = value ?? def.default;

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{def.label}</span>
          {def.key && (
            <span className="text-xs opacity-50 font-mono">
              {def.key}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {def.doc && (
            <button
              onClick={() => setOpen(!open)}
              className="opacity-60 hover:opacity-100"
              title="Show documentation"
            >
              <Info size={16} />
            </button>
          )}
          <RenderControl def={def} value={v} onChange={onChange} />
        </div>
      </div>

      {open && def.doc && (
        <div className="px-3 pb-3 text-xs opacity-80 leading-relaxed border-t border-zinc-800 whitespace-pre-wrap">
          {def.doc}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   RENDER CONTROL
------------------------------------------------------------ */
function RenderControl({ def, value, onChange }) {
  switch (def.render) {
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    case "number":
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 bg-zinc-800 rounded px-2 py-1 text-sm"
        />
      );

    case "color":
      return (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-6"
        />
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 rounded px-2 py-1 text-sm"
        >
          {def.options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );

    case "text":
      return (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 rounded px-2 py-1 text-sm w-full sm:w-40"
        />
      );

    case "keybindings":
      return (
        <button className="text-xs opacity-70 hover:opacity-100">
          Edit →
        </button>
      );

    case "repeatable":
      return (
        <button className="text-xs opacity-70 hover:opacity-100">
          Manage →
        </button>
      );

    default:
      return null;
  }
}
