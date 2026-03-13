import React, { useState } from "react";
import Popup from "../Popup/Popup";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import ImagePopup from "../ImagePopup/ImagePopup";
import RemoveCard from "../RemoveCard/RemoveCard";
import EditAvatar from "../EditAvatar/EditAvatar";
import Card from "../Card/Card";
import avatar from "../../assets/images/JacquesC.jpg";
import editIcon from "../../assets/images/Vector1.png";
import addIcon from "../../assets/images/Add_Button.png";
import trashIcon from "../../assets/images/Trash.svg";
import { BeamsBackground } from "../BeamsBackground/BeamsBackground";
import "./Main.css";

function Main({
  cards,
  currentUser,
  onCardLike,
  onCardDelete,
  onAddCard,
  onUpdateUser,
  onUpdateAvatar,
  onOpenPopup,
  onClosePopup,
  popup,
}) {
  const [cardToDelete, setCardToDelete] = useState(null);

  // Popups
  const openEditProfilePopup = () => {
    onOpenPopup({
      title: "Editar perfil",
      children: (
        <EditProfile onClose={onClosePopup} onUpdateUser={onUpdateUser} />
      ),
    });
  };

  const openAddCardPopup = () => {
    onOpenPopup({
      title: "Nuevo lugar",
      children: <NewCard onClose={onClosePopup} onAddCard={onAddCard} />,
    });
  };

  const openImagePopup = (card) => {
    onOpenPopup({
      title: "Imagen",
      children: <ImagePopup card={card} onClose={onClosePopup} />,
    });
  };

  const openDeleteCardPopup = (card) => {
    console.log("Abriendo popup para borrar tarjeta:", card._id);
    setCardToDelete(card);
  };

  console.log("Renderizando Main.jsx, cards:", cards);

  React.useEffect(() => {
    if (cardToDelete) {
      onOpenPopup({
        title: "¿Estás seguro/a?",
        children: (
          <RemoveCard
            onClose={onClosePopup}
            cardId={cardToDelete._id}
            onCardRemoved={() => {
              console.log("Limpieza de cardToDelete");
              setCardToDelete(null);
            }}
            onConfirmDelete={(id) => {
              console.log("Confirmando borrado de tarjeta:", id);
              return onCardDelete(id);
            }}
          />
        ),
      });
    }
    // eslint-disable-next-line
  }, [cardToDelete]);

  const openAvatarPopup = () => {
    onOpenPopup({
      title: "Cambiar foto de perfil",
      children: (
        <EditAvatar onClose={onClosePopup} onUpdateAvatar={onUpdateAvatar} />
      ),
    });
  };

  return (
    <main className="content">
      <BeamsBackground intensity="strong" />
      <div className="content__inner">
      <section className="profile">
        <div className="profile__image-container">
          <img
            src={currentUser.avatar ? currentUser.avatar : avatar}
            alt="Avatar"
            className="profile__avatar"
          />
          <div className="profile__avatar-overlay" onClick={openAvatarPopup}>
            <img
              src={editIcon}
              alt="Editar avatar"
              className="profile__avatar-edit-icon"
            />
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__occupation">{currentUser.about}</p>
          <button
            className="profile__edit-button"
            onClick={openEditProfilePopup}
          >
            <img
              src={editIcon}
              alt="Editar perfil"
              className="profile__edit-icon"
            />
          </button>
        </div>
        <button className="profile__add-button" onClick={openAddCardPopup}>
          <img src={addIcon} alt="Add Button" className="profile__add-icon" />
        </button>
      </section>
      <section>
        <ul className="elements">
          {currentUser._id &&
            cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardLike={onCardLike}
                onDelete={openDeleteCardPopup}
                onOpenImagePopup={openImagePopup}
                trashIcon={trashIcon}
                isLiked={
                  Array.isArray(card.likes) &&
                  card.likes.some(
                    (like) =>
                      (typeof like === "string" && like === currentUser._id) ||
                      (typeof like === "object" && like._id === currentUser._id)
                  )
                }
              />
            ))}
        </ul>
      </section>
      {popup && (
        <Popup
          onClose={onClosePopup}
          title={popup.title}
          className="popup_opened"
        >
          {popup.children}
        </Popup>
      )}
      </div>
    </main>
  );
}

export default Main;
