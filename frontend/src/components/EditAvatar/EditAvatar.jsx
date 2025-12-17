import React, { useRef, useState } from "react";
import "../Popup/Popup.css";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function EditAvatar({ onClose, onUpdateAvatar }) {
  const inputRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = (value) => {
    if (!value.trim()) return "El enlace es obligatorio.";
    if (!/^https?:\/\/.+\..+/.test(value)) return "El enlace debe ser válido.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    const validationError = validate(value);
    setError(validationError);
    if (validationError) return;
    setIsLoading(true);
    try {
      await onUpdateAvatar({ avatar: value }); // Usa el handler global
      onClose();
    } catch (err) {
      // Maneja el error si es necesario
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = () => {
    const value = inputRef.current.value;
    setError(validate(value));
  };

  return (
    <div>
      <form
        className="popup__form popup__form-avatar"
        noValidate
        onSubmit={handleSubmit}
      >
        <fieldset className="popup__set">
          <label className="popup__field">
            <input
              type="url"
              name="avatar"
              id="avatar-url"
              className="popup__input"
              placeholder="Enlace de la imagen"
              required
              ref={inputRef}
              onChange={handleChange}
            />
            <span className="popup__error avatar-url-error">{error}</span>
          </label>
          <button
            type="submit"
            className="popup__button button"
            disabled={!!error || isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </fieldset>
      </form>
      <button className="popup__close-button" onClick={onClose}>
        <img
          src={closeIcon}
          alt="Cerrar formulario"
          className="popup__close-image"
        />
      </button>
    </div>
  );
}
