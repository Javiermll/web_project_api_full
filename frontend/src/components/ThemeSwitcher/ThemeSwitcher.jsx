import { useState } from "react";
import "./ThemeSwitcher.css";

const THEMES = [
  {
    id: "clasico",
    label: "Clásico",
    swatch: "linear-gradient(135deg, #6366f1, #a855f7)",
  },
  {
    id: "viaje",
    label: "Viaje",
    swatch: "linear-gradient(135deg, #f2ece0, #c1622f)",
  },
  {
    id: "oceano",
    label: "Océano",
    swatch: "linear-gradient(135deg, #083344, #2dd4bf)",
  },
  {
    id: "atardecer",
    label: "Atardecer",
    swatch: "linear-gradient(135deg, #3a1a2e, #e08e45)",
  },
  {
    id: "mono",
    label: "Mono",
    swatch: "linear-gradient(135deg, #f4f4f2, #111111)",
  },
];

export default function ThemeSwitcher({ theme, onThemeChange }) {
  const [open, setOpen] = useState(false);
  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="theme-switcher">
      <button
        type="button"
        className="theme-switcher__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Cambiar tema visual"
        aria-expanded={open}
      >
        <span
          className="theme-switcher__dot"
          style={{ background: current.swatch }}
        />
      </button>

      {open && (
        <>
          <div
            className="theme-switcher__backdrop"
            onClick={() => setOpen(false)}
          />
          <div className="theme-switcher__panel">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t.id}
                className={
                  "theme-switcher__option" +
                  (t.id === theme ? " theme-switcher__option--active" : "")
                }
                onClick={() => {
                  onThemeChange(t.id);
                  setOpen(false);
                }}
              >
                <span
                  className="theme-switcher__swatch"
                  style={{ background: t.swatch }}
                />
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
