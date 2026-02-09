import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Edit,
  Plus,
  Download,
  Trash2,
  Pencil,
  BookmarkPlus,
} from "lucide-react";
import presetsFallback from "./preset/systemPresets.json";
import { parseConfig } from "./config/parseConfig";
import PreviewManager from "./PreviewManager";

const LOCAL_KEY = "ghostty_config_store_v1";

function loadLocalPresets() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalPresets(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function normalizeId(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PresetExplorer({ schema, onApply }) {
  const [active, setActive] = useState(null);
  const [presets, setPresets] = useState(presetsFallback);
  const [localPresets, setLocalPresets] = useState(() => loadLocalPresets());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [remoteConfigs, setRemoteConfigs] = useState({});
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    config: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("/presets/index.json")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && Array.isArray(data.presets)) {
          setPresets(data.presets);
        }
      })
      .catch(() => {
        setPresets(presetsFallback);
      });
  }, []);

  const allPresets = useMemo(() => {
    const community = presets.map(p => ({ ...p, source: "community" }));
    const local = localPresets.map(p => ({ ...p, source: "local" }));
    return [...local, ...community];
  }, [presets, localPresets]);

  const categories = useMemo(() => {
    const set = new Set(allPresets.map(p => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [allPresets]);

  const filtered = useMemo(() => {
    return allPresets.filter(p => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [allPresets, query, category]);

  const selected = allPresets.find(p => p.id === active) || null;
  const selectedConfigText =
    (selected && selected.config) ||
    (selected && remoteConfigs[selected.id]) ||
    "";

  useEffect(() => {
    if (!selected || selected.config || !selected.sourceUrl) return;
    if (remoteConfigs[selected.id]) return;

    fetch(selected.sourceUrl)
      .then(r => (r.ok ? r.text() : ""))
      .then(text => {
        if (text) {
          setRemoteConfigs(prev => ({ ...prev, [selected.id]: text }));
        }
      })
      .catch(() => {});
  }, [selected, remoteConfigs]);

  function downloadPreset(preset) {
    const text =
      preset.config || remoteConfigs[preset.id] || "";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = normalizeId(preset.name || "ghostty-config");
    a.href = url;
    a.download = `${filename || "ghostty-config"}.conf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeLocalPreset(id) {
    const next = localPresets.filter(p => p.id !== id);
    setLocalPresets(next);
    saveLocalPresets(next);
    if (active === id) setActive(null);
  }

  function savePreset() {
    if (!form.name.trim() || !form.config.trim()) return;
    let id = editId;
    if (!id) {
      const baseId = normalizeId(form.name || "custom");
      let candidate = baseId || "custom";
      let counter = 2;
      while (allPresets.some(p => p.id === candidate)) {
        candidate = `${baseId || "custom"}-${counter++}`;
      }
      id = candidate;
    }

    const next = editId
      ? localPresets.map(p =>
          p.id === editId
            ? {
                ...p,
                name: form.name.trim(),
                category: form.category.trim() || "Custom",
                description: form.description.trim() || "Local preset",
                config: form.config.trim() + "\n",
              }
            : p
        )
      : [
          {
            id,
            name: form.name.trim(),
            category: form.category.trim() || "Custom",
            description: form.description.trim() || "Local preset",
            config: form.config.trim() + "\n",
          },
          ...localPresets,
        ];

    setLocalPresets(next);
    saveLocalPresets(next);
    setActive(id);
    setShowAdd(false);
    setEditId(null);
    setForm({ name: "", category: "", description: "", config: "" });
  }

  function openEdit(preset) {
    setEditId(preset.id);
    setForm({
      name: preset.name || "",
      category: preset.category || "",
      description: preset.description || "",
      config:
        preset.config ||
        remoteConfigs[preset.id] ||
        "",
    });
    setShowAdd(true);
  }

  function openAdd() {
    setEditId(null);
    setForm({ name: "", category: "", description: "", config: "" });
    setShowAdd(true);
  }

  function closeModal() {
    setShowAdd(false);
    setEditId(null);
    setForm({ name: "", category: "", description: "", config: "" });
  }

  function saveCopy(preset) {
    const baseName = preset.name ? `${preset.name} (copy)` : "Custom preset";
    const baseId = normalizeId(baseName || "custom");
    let id = baseId || "custom";
    let counter = 2;
    while (allPresets.some(p => p.id === id)) {
      id = `${baseId || "custom"}-${counter++}`;
    }

    const next = [
      {
        id,
        name: baseName,
        category: preset.category || "Custom",
        description: preset.description || "Saved from community",
        config: selectedConfigText.trim() + "\n",
      },
      ...localPresets,
    ];

    setLocalPresets(next);
    saveLocalPresets(next);
    setActive(id);
  }

  function handleFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setForm(prev => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
        config: text,
      }));
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex h-full w-screen bg-[var(--bg-0)]">
      {/* PRESET LIST */}
      <aside className="w-72 border-r border-[var(--border-1)] p-3 space-y-3 overflow-auto bg-[var(--bg-1)]">
        <div className="sticky top-0 z-10 bg-[var(--bg-1)] pb-3 border-b border-[var(--border-1)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-2)]">
              Config Store
            </h3>
            <button
              onClick={openAdd}
              className="p-1.5 rounded bg-[var(--bg-2)] border border-[var(--border-1)] hover:bg-[var(--bg-3)]"
              title="Add config"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search presets..."
              className="w-full rounded bg-[var(--bg-2)] border border-[var(--border-1)] px-2 py-1 text-xs text-[var(--text-2)] placeholder:text-[var(--text-3)]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded bg-[var(--bg-2)] border border-[var(--border-1)] px-2 py-1 text-xs text-[var(--text-2)]"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-xs text-[var(--text-3)]">No presets found.</div>
        )}

        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`w-full text-left p-2 rounded border transition ${
              active === p.id
                ? "border-[var(--accent)] bg-[var(--bg-2)] shadow-[0_0_14px_rgba(125,227,165,0.18)]"
                : "border-[var(--border-1)] hover:bg-[var(--bg-2)]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">{p.name}</div>
              {p.source === "local" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-3)] text-[var(--text-2)] border border-[var(--border-1)]">
                  LOCAL
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-3)]">{p.description}</div>
          </button>
        ))}
      </aside>

      {/* PREVIEW */}
      <main className="flex-1 overflow-hidden bg-[var(--bg-0)]">
        {!selected && (
          <div className="text-[var(--text-3)] text-sm p-4">
            Select a preset to preview.
          </div>
        )}

        {selected && (
          <PreviewManager
            title={selected.name}
            subtitle={
              selected.source === "local"
                ? `${selected.category} - Local`
                : selected.category
            }
            config={parseConfig(selectedConfigText, schema)}
            configText={selectedConfigText}
            actions={
              <>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(selectedConfigText)
                  }
                  className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                  title="Copy config"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => downloadPreset(selected)}
                  className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                  title="Download config"
                >
                  <Download size={14} />
                </button>
                {selected.source !== "local" && (
                  <button
                    onClick={() => saveCopy(selected)}
                    className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                    title="Save to store"
                  >
                    <BookmarkPlus size={14} />
                  </button>
                )}
                <button
                  onClick={() => onApply(parseConfig(selectedConfigText, schema))}
                  className="p-2 bg-[var(--accent)] text-black rounded shadow-[0_0_12px_var(--glow)]"
                  title="Open in editor"
                >
                  <Edit size={14} />
                </button>
                {selected.source === "local" && (
                  <button
                    onClick={() => openEdit(selected)}
                    className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                    title="Edit config entry"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {selected.source === "local" && (
                  <button
                    onClick={() => removeLocalPreset(selected.id)}
                    className="p-2 bg-[var(--bg-2)] border border-[var(--border-1)] rounded"
                    title="Remove local preset"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </>
            }
          />
        )}
      </main>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-xl rounded-xl border border-[var(--border-1)] bg-[var(--bg-1)] p-4 space-y-3 shadow-[var(--shadow-strong)]">
            <div className="text-sm font-semibold">
              {editId ? "Edit Config Entry" : "Add to Config Store"}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full rounded bg-[var(--bg-2)] border border-[var(--border-1)] px-2 py-1 text-xs text-[var(--text-2)]"
              />
              <input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="Category (optional)"
                className="w-full rounded bg-[var(--bg-2)] border border-[var(--border-1)] px-2 py-1 text-xs text-[var(--text-2)]"
              />
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description (optional)"
                className="w-full rounded bg-[var(--bg-2)] border border-[var(--border-1)] px-2 py-1 text-xs text-[var(--text-2)]"
              />
              <textarea
                value={form.config}
                onChange={(e) => setForm({ ...form, config: e.target.value })}
                placeholder="Paste your Ghostty config here"
                className="h-48 w-full rounded bg-black border border-[var(--border-1)] px-2 py-2 text-xs font-mono text-[var(--text-2)]"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".conf,.txt"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-xs rounded bg-[var(--bg-2)] border border-[var(--border-1)]"
                >
                  Import file
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-2 py-1 text-xs rounded bg-[var(--bg-2)] border border-[var(--border-1)]"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreset}
                  className="px-2 py-1 text-xs rounded bg-[var(--accent)] text-black shadow-[0_0_12px_var(--glow)]"
                >
                  {editId ? "Save changes" : "Save to store"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
