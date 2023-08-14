import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isPreloadingEditProfilePopup, setIsPreloadingEditProfilePopup] =
    React.useState(false);
  const [isPreloadingAddPlacePopup, setIsPreloadingAddPlacePopup] =
    React.useState(false);
  const [isPreloadingEditAvatarPopup, setIsPreloadingEditAvatarPopup] =
    React.useState(false);
  React.useEffect(() => {
    Promise.all([api.getUserInfoServer(), api.getInitialCardsServer()])
      .then(([resUser, resCard]) => {
        setCurrentUser(resUser);
        setCards(resCard);
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`));
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setSelectedCard({});
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`));
  }

  //Обработчик удаления карточки
  function handleCardDelete(card) {
    api
      .deleteCardServer(card._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`));
  }

  //Обработчик данных юзера
  function handleUpdateUser(user) {
    setIsPreloadingEditProfilePopup(true);
    api
      .setUserInfoServer(user)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`))
      .finally(() => setIsPreloadingEditProfilePopup(false));
  }

  //Обработчик аватара юзера
  function handleUpdateAvatar(item) {
    setIsPreloadingEditAvatarPopup(true);
    api
      .setUserAvatarServer(item)
      .then((resUser) => {
        setCurrentUser(resUser);
        closeAllPopups();
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`))
      .finally(() => setIsPreloadingEditAvatarPopup(false));
  }

  function handleAddCard(item) {
    setIsPreloadingAddPlacePopup(true);
    api
      .addNewCardServer(item)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(`Произошла ошибка ${error}`))
      .finally(() => setIsPreloadingAddPlacePopup(false));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onEditAvatar={handleEditAvatarClick}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          cards={cards}
        />
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isPreloadingEditProfilePopup={isPreloadingEditProfilePopup}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
          isPreloadingAddPlacePopup={isPreloadingAddPlacePopup}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isPreloadingEditAvatarPopup={isPreloadingEditAvatarPopup}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
