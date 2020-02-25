export default (toolButton, popup) => {
  const buttonRect = toolButton.getBoundingClientRect();
  const popupRect = popup.current.getBoundingClientRect();
  const buttonCenter = (buttonRect.left + buttonRect.right) / 2;
  const popupTop = buttonRect.bottom + 1;
  let popupLeft = buttonCenter - popupRect.width / 2;
  const popupRight = buttonCenter + popupRect.width / 2;

  popupLeft =
    popupRight > window.innerWidth
      ? window.innerWidth - popupRect.width - 12
      : popupLeft;
  popupLeft = popupLeft < 0 ? 0 : popupLeft;

  return { left: popupLeft, top: popupTop };
};
