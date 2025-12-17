# Ghostty Config Manager

A modern, visual configuration editor for **Ghostty Terminal**.  
This app removes the need to manually edit config files by providing a powerful GUI, live preview, presets, and safe import/export.

![Preview](https://raw.githubusercontent.com/chouhan-abhi/ConfigManager/refs/heads/main/public/ScreenShots/preview.png)

🌐 **Live App:** https://config.dracket.art/

---

## ✨ Features

- 📁 **Directory-style settings UI**  
  Browse Ghostty configs by group & section like a file explorer.

- 🧠 **Schema-driven editor**  
  Every option is backed by a schema with:
  - defaults
  - documentation
  - render hints (boolean, color, select, repeatable, keybindings)

- ⌨️ **Keybinding editor**
  - Action dropdowns
  - Conflict detection
  - Platform-aware normalization

- 🎨 **Live terminal preview**
  See how your configuration *feels* while editing.

- 📦 **Preset Explorer**
  - Curated community-inspired presets
  - Preview, copy, apply, or customize
  - Use presets as a starting point

- 🔁 **Safe Import / Export**
  - Preserves comments
  - Preserves unknown keys
  - Round‑trip safe editing

- 📋 **One‑click copy**
  Instantly copy final config for Ghostty.

---

## 🧩 Project Structure

```
src/
├─ Ghosty/
│  ├─ config/
│  │  ├─ config.ts          # Full Ghostty schema
│  │  ├─ parseConfig.ts     # Robust config parser
│  │  ├─ serializeConfig.ts# Export to Ghostty format
│  ├─ ConfigGenerator.tsx  # Directory-style editor UI
│  ├─ PresetExplorer.tsx   # Presets browser
│  ├─ LiveTerminalPreview.tsx
├─ App.tsx
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/chouhan-abhi/ConfigManager
cd ConfigManager
npm install
npm run dev
```

---

## 📥 Importing Existing Config

1. Click **Import**
2. Paste your Ghostty config
3. Apply → UI updates automatically

Supports:
- Comments (`#`)
- Empty values
- Percentages, durations, colors
- Repeated keys

---

## 📤 Exporting Config

- Click **Export**
- Edit in raw mode if needed
- Copy to clipboard
- Paste directly into Ghostty config file

---

## 🎯 Goal of the Project

> **Eliminate manual Ghostty configuration entirely.**

This app aims to expose **every Ghostty option** through a polished UI, while staying fully compatible with the native config format.

---

## 🛠 Tech Stack

- React + Vite
- Tailwind CSS
- Lucide Icons
- Schema‑first architecture

---

## 📄 License

MIT

---

Made with ❤️ for Ghostty users.
