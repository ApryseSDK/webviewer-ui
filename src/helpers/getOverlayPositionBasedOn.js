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
  const { width: overlayWidth } = overlay.current.getBoundingClientRect();

  if (buttonLeft + overlayWidth > window.innerWidth) {
    const rightMargin = 2;
    left = 'auto';
    right = rightMargin;
  } else {
    left = buttonLeft;
    right = 'auto';
  }

  return {
    left: !isNaN(left) ? Math.max(left, 0) : left,
    right,
    top: buttonBottom + (isTabletAndMobile ? 14 : 6),
  };
};
