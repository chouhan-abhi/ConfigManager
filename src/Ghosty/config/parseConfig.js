export function parseConfig(text, schema, prev = {}) {
  const next = { ...prev };
  const lines = text.split(/\r?\n/);

  // Build key → def map
  const defs = {};
  for (const group of Object.values(schema)) {
    for (const section of Object.values(group)) {
      for (const def of Object.values(section)) {
        if (def.key) defs[def.key] = def;
      }
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Ignore comments & empty lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Split ONLY on first "="
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let raw = trimmed.slice(eqIndex + 1).trim();

    const def = defs[key];
    if (!def) continue; // unknown keys ignored for now

    // Empty value resets to default
    if (raw === "") {
      next[key] = def.default;
      continue;
    }

    const value = parseValue(raw, def);

    if (def.render === "repeatable") {
      next[key] = Array.isArray(next[key])
        ? [...next[key], value]
        : [value];
    } else {
      next[key] = value;
    }
  }

  return next;
}

function parseValue(raw, def) {
  // Remove wrapping quotes if present
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1);
  }

  switch (def.render) {
    case "boolean":
      return raw === "true";

    case "number":
      // Allow floats, .8, etc
      return Number(raw);

    case "select":
    case "text":
    case "color":
    default:
      // Keep string exactly as-is (important for enums & units)
      return raw;
  }
}
