import getRootNode from 'helpers/getRootNode';

const getLeftPosition = (relativeButtonLeft, overlayWidth, innerWidth) => {
  if (relativeButtonLeft + overlayWidth <= innerWidth) {
    return relativeButtonLeft;
  }

  const rightMargin = 6;
  return innerWidth - rightMargin - overlayWidth;
};

const getTopPosition = (relativeButtonBottom, overlayHeight, innerHeight, verticalGap) => {
  let top = relativeButtonBottom + verticalGap;
  const canShiftUp = relativeButtonBottom > 100 && relativeButtonBottom + overlayHeight > innerHeight;

  if (canShiftUp) {
    const calculatedTop = innerHeight - overlayHeight - verticalGap;
    top = calculatedTop > 0 ? calculatedTop : 0;
  }

  return top;
};

export default (element, overlay, isTabletAndMobile, rootNodeOverride, selector = 'data-element') => {
  const isApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;
  const rootNode = rootNodeOverride || getRootNode();
  const host = isApryseWebViewerWebComponent ? rootNode?.host : null;
  const innerWidth = host ? host.clientWidth : window.innerWidth;
  const innerHeight = host ? host.clientHeight : window.innerHeight;
  const button = rootNode?.querySelector(`[${selector}="${element}"]`);

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
  const rootLeft = host ? host.getBoundingClientRect().left : 0;
  const rootTop = host ? host.getBoundingClientRect().top : 0;
  const relativeButtonBottom = buttonBottom - rootTop;
  const relativeButtonLeft = buttonLeft - rootLeft;

  const { width: overlayWidth, height: overlayHeight } = overlay.current.getBoundingClientRect();
  left = getLeftPosition(relativeButtonLeft, overlayWidth, innerWidth);

  const verticalGap = isTabletAndMobile ? 14 : 6;
  // if the buttons are not on the top of the page, the popup can adjust its position to "pass" them, otherwise the popup should always be below them
  const top = getTopPosition(relativeButtonBottom, overlayHeight, innerHeight, verticalGap);

  return {
    left: !isNaN(left) ? Math.max(left, 0) : left,
    right,
    top,
  };
};
