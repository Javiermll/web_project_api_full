import React, { useState } from "react";
import api from "../../utils/apiInstance"; // Importa la instancia que gestiona el token
import "../Popup/Popup.css";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function NewCard({ onClose, onAddCard }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [errors, setErrors] = useState({ name: "", link: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Validación en cada cambio
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setErrors((prev) => ({
      ...prev,
      name: !value.trim() ? "El título es obligatorio." : "",
    }));
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLink(value);
    setErrors((prev) => ({
      ...prev,
      link: !value.trim()
        ? "El enlace es obligatorio."
        : !/^https?:\/\/.+\..+/.test(value)
        ? "El enlace debe ser válido."
        : "",
    }));
  };

  const isFormValid =
    name.trim() &&
    link.trim() &&
    !errors.name &&
    !errors.link;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddCard({ name, link });
    onClose();
  };

  return (
    <form
      className="popup__form"
      name="card-form"
      id="new-card-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <button className="popup__close-button" type="button" onClick={onClose}>
        <img src={closeIcon} alt="Boton de cerrar formulario" />
      </button>

      <label className="popup__field">
        <input
          className="popup__input popup__input_type_card-name"
          id="card-name"
          maxLength="30"
          minLength="1"
          name="card-name"
          placeholder="Title"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span className="popup__error" id="card-name-error">
          {errors.name}
        </span>
      </label>

      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id="card-link"
          name="card-link"
          placeholder="Image link"
          required
          type="url"
          value={link}
          onChange={handleLinkChange}
        />
        <span className="popup__error" id="card-link-error">
          {errors.link}
        </span>
      </label>

      <button
        className="button popup__button"
        type="submit"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
