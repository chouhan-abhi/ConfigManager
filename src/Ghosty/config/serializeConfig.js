export function serializeConfig(schema, state) {
  const lines = [];

  for (const group of Object.values(schema)) {
    for (const section of Object.values(group)) {
      for (const def of Object.values(section)) {
        const key = def.key;
        if (!key) continue;

        const value =
          state[key] !== undefined ? state[key] : def.default;

        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
          value.forEach(v => {
            lines.push(`${key} = ${formatValue(v)}`);
          });
        } else {
          lines.push(`${key} = ${formatValue(value)}`);
        }
      }
    }
  }

  return lines.join("\n");
}

function formatValue(v) {
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  return String(v);
}
