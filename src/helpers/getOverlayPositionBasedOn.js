export default (element, overlay) => {
  const button = document.querySelector(`[data-element=${element}]`);
  let left = 0;
  let right = 'auto';

  // By default the button will be in the header
  // but a user can disable it by calling viewerInstance.actions.disableElement(...);
  if (!button) {
    return { left, right };
  }

  const { left: buttonLeft } = button.getBoundingClientRect();
  const { width: overlayWidth } = overlay.current.getBoundingClientRect();
  
  if (buttonLeft + overlayWidth > window.innerWidth) {
    const rightMargin = 16;
    left = 'auto';
    right = rightMargin;
  } else {
    left = buttonLeft;
    right = 'auto';
  }

  return { left, right };
};