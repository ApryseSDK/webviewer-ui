export default (element, overlay, align = 'left') => {
  const button = document.querySelector(`[data-element=${element}]`);
  let left = 0;
  let right = 'auto';

  // By default the button will be in the header
  // but a user can disable it by calling viewerInstance.actions.disableElement(...);
  if (!button) {
    return { left, right };
  }

  const { left: buttonLeft, right: buttonRight, width: buttonWidth } = button.getBoundingClientRect();
  const { width: overlayWidth } = overlay.current.getBoundingClientRect();

  if (align === 'left'){
    if (buttonLeft + overlayWidth > window.innerWidth) {
      const rightMargin = 16;
      left = 'auto';
      right = rightMargin;
    } else {
      left = buttonLeft;
      right = 'auto';
    }
  } else if (align === 'center'){
    if (buttonLeft + (overlayWidth + buttonWidth) / 2 > window.innerWidth) {
      const rightMargin = 16;
      left = 'auto';
      right = rightMargin;
    } else {
      left = buttonLeft + buttonWidth/2 - overlayWidth/2; 
      right = 'auto';
    }
  } else {
    if (buttonRight - overlayWidth < 0) {
      const leftMargin = 16;
      right = 'auto';
      left = leftMargin;
    } else {
      right = 'auto';
      left = buttonLeft - (overlayWidth - buttonWidth);
    }
  }  
  return { left, right };
};