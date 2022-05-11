export default (element, overlay, isTabletAndMobile, isSmallBrowserHeight) => {
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

  let maxHeight;
  const verticalGap = isTabletAndMobile ? 14 : 6;
  let top = buttonBottom + verticalGap;
  if (buttonBottom > window.innerHeight / 2) {
    top = 0;
    maxHeight = window.innerHeight;
  } else if ((buttonBottom + overlayHeight > window.innerHeight) && !isSmallBrowserHeight) {
    top = window.innerHeight - overlayHeight - verticalGap;
  }

  return {
    left: !isNaN(left) ? Math.max(left, 0) : left,
    right,
    top,
    ...(maxHeight && { maxHeight })
  };
};
