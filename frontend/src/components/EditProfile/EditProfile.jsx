// src/components/Main/components/EditProfile/EditProfile.jsx
import React, { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import api from "../../utils/apiInstance";
import "../Popup/Popup.css";
import closeIcon from "../../assets/images/Close_Icon.png";

export default function EditProfile({ onClose, onUpdateUser }) {
  const { currentUser } = useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [descError, setDescError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [currentUser]);

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    if (value.length < 2 || value.length > 40) {
      setNameError("El nombre debe tener entre 2 y 40 caracteres.");
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);
    if (value.length < 2 || value.length > 200) {
      setDescError("La descripción debe tener entre 2 y 200 caracteres.");
    } else {
      setDescError("");
    }
  };

  const isFormValid =
    name.length >= 2 &&
    name.length <= 40 &&
    description.length >= 2 &&
    description.length <= 200 &&
    !nameError &&
    !descError;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    try {
      await onUpdateUser({
        name,
        about: description,
      });
      onClose();
    } catch (err) {
      // Maneja el error si es necesario
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || !currentUser.name) {
    return null; // O un loader/spinner si prefieres
  }

  return (
    <div className="popup">
      <div className="popup__container">
        <h2 className="popup__title">Editar perfil</h2>
        <form
          className="popup__form"
          name="edit-profile"
          id="edit-profile-form"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="popup__set">
            <label className="popup__field">
              <input
                type="text"
                id="popup-name"
                name="popup-name"
                className="popup__input"
                placeholder="Nombre"
                required
                minLength={2}
                maxLength={40}
                value={name}
                onChange={handleNameChange}
              />
              <span className="popup__error popup-name-error">{nameError}</span>
            </label>
            <label className="popup__field">
              <input
                type="text"
                id="popup-about"
                name="popup-about"
                className="popup__input"
                placeholder="Acerca de"
                required
                minLength={2}
                maxLength={200}
                value={description}
                onChange={handleDescriptionChange}
              />
              <span className="popup__error popup-about-error">
                {descError}
              </span>
            </label>
            <button
              type="submit"
              className="popup__button button"
              disabled={!isFormValid || isLoading}
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
    </div>
  );
}
