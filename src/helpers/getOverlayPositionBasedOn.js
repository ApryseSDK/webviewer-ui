export default (element, overlay, isTabletAndMobile) => {
  const button = document.querySelector(`[data-element=${element}]`);
  let left = 0;
  let right = 'auto';

  // by default the button is visible in the header
  // but it can be removed from the DOM by calling viewerInstance.disableElement(...);
  // in this case we are not able to position the overlay correctly so we just "hide" the overlay
  if (!button || !overlay.current) {
    return { left: -9999, right };
  }

  const {
    bottom: buttonBottom,
    left: buttonLeft,
  } = button.getBoundingClientRect();
  const { width: overlayWidth, height: overlayHeight } = overlay.current.getBoundingClientRect();

  if (buttonLeft + overlayWidth > window.innerWidth) {
    const rightMargin = 6;
    left = window.innerWidth - rightMargin - overlayWidth;
    right = 'auto';
  } else {
    left = buttonLeft;
    right = 'auto';
  }

  const verticalGap = isTabletAndMobile ? 14 : 6;
  let top = buttonBottom + verticalGap;
  if (buttonBottom > 100) {
    // if the buttons are not on the top of the page, the popup can adjust its position to "pass" them, otherwise the popup should always be below them
    if (buttonBottom + overlayHeight > window.innerHeight) {
      const calculatedTop = window.innerHeight - overlayHeight - verticalGap;
      top = calculatedTop > 0 ? calculatedTop : 0;
    }
  }

  return {
    left: !isNaN(left) ? Math.max(left, 0) : left,
    right,
    top,
  };
};
