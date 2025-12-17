export const SCHEMA = {
  Appearance: {
    Fonts: {
      "font-family": {
        key: "font-family",
        label: "Font Family",
        default: "",
        render: "text",
        doc: "Primary font family used to render terminal text. This should be a valid system font name."
      },
      "font-family-bold": {
        key: "font-family-bold",
        label: "Bold Font Family",
        default: "",
        render: "text",
        doc: "Optional bold variant font family. If unset, Ghostty may synthesize bold text."
      },
      "font-family-italic": {
        key: "font-family-italic",
        label: "Italic Font Family",
        default: "",
        render: "text",
        doc: "Optional italic font family used when rendering italic text."
      },
      "font-family-bold-italic": {
        key: "font-family-bold-italic",
        label: "Bold Italic Font Family",
        default: "",
        render: "text",
        doc: "Optional bold+italic font family. Used when text is both bold and italic."
      },
      "font-size": {
        key: "font-size",
        label: "Font Size",
        default: 13,
        render: "number",
        doc: "Base font size in points."
      },
      "font-synthetic-style": {
        key: "font-synthetic-style",
        label: "Synthetic Font Style",
        default: "auto",
        render: "select",
        options: ["auto", "none", "bold", "italic", "bold-italic"],
        doc: "Controls whether Ghostty synthesizes bold/italic styles if the font lacks them."
      },
      "adjust-cell-width": {
        key: "adjust-cell-width",
        label: "Cell Width Adjustment",
        default: 1.0,
        render: "number",
        doc: "Adjusts the width of each terminal cell. Useful for font metric tuning."
      },
      "adjust-cell-height": {
        key: "adjust-cell-height",
        label: "Cell Height Adjustment",
        default: 1.0,
        render: "number",
        doc: "Adjusts the height of each terminal cell."
      }
    },

    Colors: {
      theme: {
        key: "theme",
        label: "Theme",
        default: "",
        render: "text",
        doc: "Name of a built-in Ghostty theme (e.g. nord, dracula, catppuccin-mocha)."
      },
      background: {
        key: "background",
        label: "Background Color",
        default: "#000000",
        render: "color",
        doc: "Terminal background color."
      },
      foreground: {
        key: "foreground",
        label: "Foreground Color",
        default: "#ffffff",
        render: "color",
        doc: "Default foreground (text) color."
      },
      "selection-background": {
        key: "selection-background",
        label: "Selection Background",
        default: "",
        render: "color",
        doc: "Background color used for selected text."
      },
      "selection-foreground": {
        key: "selection-foreground",
        label: "Selection Foreground",
        default: "",
        render: "color",
        doc: "Foreground color used for selected text."
      },
      palette: {
        key: "palette",
        label: "Color Palette",
        default: [],
        render: "repeatable",
        doc: "Custom ANSI/256 color palette entries. Each entry may specify an index or implicit order."
      },
      "background-image": {
        key: "background-image",
        label: "Background Image",
        default: "",
        render: "file",
        doc: "Path to an image file used as the terminal background."
      },
      "background-image-opacity": {
        key: "background-image-opacity",
        label: "Background Image Opacity",
        default: 1.0,
        render: "number",
        doc: "Opacity of the background image (0.0 – 1.0)."
      }
    }
  },

  Behavior: {
    Cursor: {
      "cursor-style": {
        key: "cursor-style",
        label: "Cursor Style",
        default: "block",
        render: "select",
        options: ["block", "beam", "underline"],
        doc: "Visual style of the text cursor."
      },
      "cursor-color": {
        key: "cursor-color",
        label: "Cursor Color",
        default: "",
        render: "color",
        doc: "Color used for the cursor."
      },
      "cursor-blink": {
        key: "cursor-blink",
        label: "Cursor Blink",
        default: true,
        render: "boolean",
        doc: "Enable or disable cursor blinking."
      }
    },

    Clipboard: {
      "copy-on-select": {
        key: "copy-on-select",
        label: "Copy on Select",
        default: false,
        render: "boolean",
        doc: "Automatically copy selected text to clipboard."
      },
      "paste-on-middle-click": {
        key: "paste-on-middle-click",
        label: "Paste on Middle Click",
        default: true,
        render: "boolean",
        doc: "Paste clipboard contents when middle mouse button is clicked."
      }
    },

    Scrolling: {
      scrollback: {
        key: "scrollback",
        label: "Scrollback Lines",
        default: 10000,
        render: "number",
        doc: "Number of lines stored in the scrollback buffer."
      },
      "smooth-scroll": {
        key: "smooth-scroll",
        label: "Smooth Scrolling",
        default: false,
        render: "boolean",
        doc: "Enable smooth animated scrolling."
      }
    }
  },

  Window: {
    General: {
      "window-decorations": {
        key: "window-decorations",
        label: "Window Decorations",
        default: "auto",
        render: "select",
        options: ["auto", "none", "client", "server"],
        doc: "Controls window decorations such as titlebar and borders."
      },
      "window-padding-x": {
        key: "window-padding-x",
        label: "Horizontal Padding",
        default: "6px",
        render: "text",
        doc: "Horizontal padding inside the terminal window."
      },
      "window-padding-y": {
        key: "window-padding-y",
        label: "Vertical Padding",
        default: "6px",
        render: "text",
        doc: "Vertical padding inside the terminal window."
      }
    }
  },

  Shell: {
    Startup: {
      shell: {
        key: "shell",
        label: "Shell",
        default: "",
        render: "text",
        doc: "Shell executable to run (e.g. /bin/zsh)."
      },
      "working-directory": {
        key: "working-directory",
        label: "Working Directory",
        default: "",
        render: "text",
        doc: "Initial working directory for new terminals."
      },
      "startup-command": {
        key: "startup-command",
        label: "Startup Command",
        default: "",
        render: "text",
        doc: "Command executed when the terminal starts."
      }
    }
  },

  Keybindings: {
    General: {
      keybindings: {
        key: "keybindings",
        label: "Keybindings",
        default: [],
        render: "keybindings",
        doc: "Custom keyboard shortcuts. Supports global bindings, sequences, and platform-specific modifiers."
      }
    }
  },

  Rendering: {
    Performance: {
      renderer: {
        key: "renderer",
        label: "Renderer",
        default: "gpu",
        render: "select",
        options: ["gpu", "software"],
        doc: "Rendering backend used by Ghostty."
      },
      vsync: {
        key: "vsync",
        label: "VSync",
        default: true,
        render: "boolean",
        doc: "Enable vertical synchronization."
      }
    }
  },

  Runtime: {
    Behavior: {
      "quit-after-last-window-closed": {
        key: "quit-after-last-window-closed",
        label: "Quit After Last Window",
        default: false,
        render: "boolean",
        doc: "Exit Ghostty when the last window is closed."
      },
      "confirm-close-surface": {
        key: "confirm-close-surface",
        label: "Confirm Close",
        default: true,
        render: "boolean",
        doc: "Show confirmation dialog before closing a window."
      }
    }
  }
};
