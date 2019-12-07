export default (element, overlay, align = 'left') => {
  const button = document.querySelector(`[data-element=${element}]`);
  let left = 0;
  let right = 'auto';

  // by default the button is visible in the header
  // but it can be removed from the DOM by calling viewerInstance.disableElement(...);
  // in this case we are not able to position the overlay correctly so we just "hide" the overlay
  if (!button || !overlay.current) {
    return { left: -9999, right };
  }

  const { top: buttonTop, bottom: buttonBottom, left: buttonLeft, right: buttonRight, width: buttonWidth } = button.getBoundingClientRect();
  const { width: overlayWidth } = overlay.current.getBoundingClientRect();

  if (align === 'left') {
    if (buttonLeft + overlayWidth > window.innerWidth) {
      const rightMargin = 16;
      left = 'auto';
      right = rightMargin;
    } else {
      left = buttonLeft;
      right = 'auto';
    }
  } else if (align === 'center') {
    if (buttonLeft + (overlayWidth + buttonWidth) / 2 > window.innerWidth) {
      const rightMargin = 16;
      left = 'auto';
      right = rightMargin;
    } else {
      left = buttonLeft + buttonWidth / 2 - overlayWidth / 2;
      right = 'auto';
    }
  } else if (buttonRight - overlayWidth < 0) {
    const leftMargin = 16;
    right = 'auto';
    left = leftMargin;
  } else {
    right = 'auto';
    left = buttonLeft - (overlayWidth - buttonWidth);
  }
  return { left, right, top: buttonBottom + 6 };
};
