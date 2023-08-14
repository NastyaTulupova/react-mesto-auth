import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({
  isOpen,
  onClose,
  onAddPlace,
  isPreloadingAddPlacePopup,
}) {
  const placeName = React.useRef();
  const placeLink = React.useRef();

  React.useEffect(() => {
    placeName.current.value = "";
    placeLink.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: placeName.current.value,
      link: placeLink.current.value,
    });
  }

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isPreloadingAddPlacePopup ? "Сохранение..." : "Создать"}
    >
      <div className="form__input-container">
        <input
          required
          type="text"
          className="form__item"
          id="place-name-input"
          name="name"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          ref={placeName}
        />
        <span className="error" id="place-name-input-error"></span>
      </div>
      <div className="form__input-container">
        <input
          required
          type="url"
          className="form__item"
          id="link-input"
          name="link"
          placeholder="Ссылка на картинку"
          ref={placeLink}
        />
        <span className="error" id="link-input-error"></span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
