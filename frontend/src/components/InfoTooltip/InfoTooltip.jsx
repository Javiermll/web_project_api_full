import React, { useEffect, useRef } from "react";
import "./InfoTooltip.css";

export default function InfoTooltip({ isOpen, success, message, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    closeBtnRef.current?.focus();
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="info-tooltip__overlay" onClick={onClose}>
      <div
        className="info-tooltip"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          className="info-tooltip__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>

        <div
          className={`info-tooltip__icon ${
            success ? "info-tooltip__icon_success" : "info-tooltip__icon_error"
          }`}
        >
          {success ? "✓" : "✕"}
        </div>
        <p className="info-tooltip__message">{message}</p>
      </div>
    </div>
  );
}
