import core from 'core';
import { getWebComponentScale } from './getWebComponentScale';
import getRootNode from './getRootNode';

// gap between the annotation selection box and the popup element
const defaultGap = 17;
const fallbackPosition = { left: 0, top: 0 };

const isValidPoint = (point) => (
  point &&
  Number.isFinite(point.x) &&
  Number.isFinite(point.y)
);

const hasValidBounds = ({ topLeft, bottomRight } = {}) => (
  isValidPoint(topLeft) &&
  isValidPoint(bottomRight)
);

const getSafeScale = () => {
  const scale = getWebComponentScale() || {};
  const scaleX = Number.isFinite(scale.scaleX) && scale.scaleX !== 0 ? scale.scaleX : 1;
  const scaleY = Number.isFinite(scale.scaleY) && scale.scaleY !== 0 ? scale.scaleY : 1;
  return { scaleX, scaleY };
};

const getWindowScroll = () => ({
  scrollX: window.pageXOffset || window.scrollX || 0,
  scrollY: window.pageYOffset || window.scrollY || 0,
});

const getRtlSafeScrollLeft = (element) => {
  if (!element) {
    return 0;
  }
  const coreScrollLeft = window.Core?.getScrollLeft?.(element);
  if (Number.isFinite(coreScrollLeft)) {
    return coreScrollLeft;
  }
  return Number.isFinite(element.scrollLeft) ? element.scrollLeft : 0;
};

/** @ignore */
const getScrollContainerDocRect = (scrollContainer) => {
  const { top, left, width, height } = scrollContainer.getBoundingClientRect();
  const { scrollX, scrollY } = getWindowScroll();
  const docTop = top + scrollY + scrollContainer.scrollTop;
  const docLeft = left + scrollX + getRtlSafeScrollLeft(scrollContainer);
  return {
    top: docTop,
    left: docLeft,
    bottom: docTop + height,
    right: docLeft + width,
  };
};

/**
 * Returns true if any part of the annotation is within the visible area of the scroll container.
 * @ignore
 * @param {object} annotation The annotation to check.
 * @param {HTMLElement} scrollContainer The scroll container element.
 * @param {number} [documentViewerKey=1] The document viewer key.
 * @returns {boolean}
 */
export const isAnnotationInView = (annotation, scrollContainer, documentViewerKey = 1) => {
  const { topLeft, bottomRight } = getAnnotationPosition(annotation, documentViewerKey);
  if (!topLeft || !bottomRight || !scrollContainer) {
    return false;
  }

  const visibleRegion = getScrollContainerDocRect(scrollContainer);

  return (
    bottomRight.y > visibleRegion.top &&
    topLeft.y < visibleRegion.bottom &&
    bottomRight.x > visibleRegion.left &&
    topLeft.x < visibleRegion.right
  );
};

export const getAnnotationPopupPositionBasedOn = (annotation, popup, documentViewerKey = 1, gap = defaultGap) => {
  const annotationPosition = getAnnotationPosition(annotation, documentViewerKey);
  if (!hasValidBounds(annotationPosition)) {
    return fallbackPosition;
  }

  const { left, top } = calcAnnotationPopupPosition(
    annotationPosition,
    getPopupDimensions(popup),
    documentViewerKey,
    gap,
    popup?.current,
  );

  if (!Number.isFinite(left) || !Number.isFinite(top)) {
    return fallbackPosition;
  }

  return { left: Math.max(left, 4), top };
};

export const getTextPopupPositionBasedOn = (allQuads, popup, documentViewerKey = 1) => {
  const selectedTextPosition = getSelectedTextPosition(allQuads, documentViewerKey);
  if (!hasValidBounds(selectedTextPosition)) {
    return fallbackPosition;
  }

  const { left, top } = calcTextPopupPosition(
    selectedTextPosition,
    getPopupDimensions(popup),
    documentViewerKey,
    popup?.current,
  );

  if (!Number.isFinite(left) || !Number.isFinite(top)) {
    return fallbackPosition;
  }

  return { left, top };
};

export const getAnnotationPosition = (annotation, documentViewerKey = 1) => {
  if (!annotation || typeof annotation.getPageNumber !== 'function') {
    return { topLeft: null, bottomRight: null };
  }

  const pageNumber = annotation.getPageNumber();
  const currentDocumentViewer = core.getDocumentViewers()?.[documentViewerKey - 1];
  const currentDocumentPageCount = currentDocumentViewer?.getPageCount?.();
  if (!Number.isFinite(currentDocumentPageCount)) {
    return { topLeft: null, bottomRight: null };
  }

  if (pageNumber > currentDocumentPageCount) {
    return { topLeft: null, bottomRight: null };
  }

  const { left, top, right, bottom } = getAnnotationPageCoordinates(annotation, documentViewerKey);
  const topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageNumber, documentViewerKey);
  const bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageNumber, documentViewerKey);
  if (!hasValidBounds({ topLeft, bottomRight })) {
    return { topLeft: null, bottomRight: null };
  }

  if (annotation['NoZoom']) {
    const isNote = annotation instanceof window.Core.Annotations.StickyAnnotation;
    const rect = annotation.getRect();
    const width = isNote ? window.Core.Annotations.StickyAnnotation['SIZE'] : rect.getWidth();
    const height = isNote ? window.Core.Annotations.StickyAnnotation['SIZE'] : rect.getHeight();
    const rotation = core.getCompleteRotation(annotation.PageNumber, documentViewerKey);
    if (rotation === 0) {
      bottomRight.x = topLeft.x + width;
      bottomRight.y = topLeft.y + height;
      if (isNote) {
        bottomRight.x += width * 0.2;
      }
    } else {
      if (isNote) {
        bottomRight.x = topLeft.x + width * 1.2;
        bottomRight.y = topLeft.y + height;
      } else {
        if (rotation === 1) {
          topLeft.x = bottomRight.x - height;
          bottomRight.y = topLeft.y + width;
        } else if (rotation === 2) {
          topLeft.x = bottomRight.x - width;
          topLeft.y = bottomRight.y - height;
        } else if (rotation === 3) {
          topLeft.y = bottomRight.y - width;
          bottomRight.x = topLeft.x + height;
        }
      }
    }
  }

  return { topLeft, bottomRight };
};

const getWidgetNormalizedRect = (annotation) => {
  const rect = annotation.getRect();
  if (annotation instanceof window.Core.Annotations.WidgetAnnotation) {
    const rotationInDegrees = annotation['rotation'];
    let width = rect['x2'] - rect['x1'];
    let height = rect['y2'] - rect['y1'];

    const rotation = rotationInDegrees;
    if (rotation === 90 || rotation === 270) {
      [width, height] = [height, width];
    }

    return new window.Core.Math.Rect(rect['x1'], rect['y1'], rect['x1'] + width, rect['y1'] + height);
  }
  return rect;
};

const getAnnotationPageCoordinates = (annotation, documentViewerKey = 1) => {
  const rect = getWidgetNormalizedRect(annotation);
  let { x1: left, y1: top, x2: right, y2: bottom } = rect;

  const isNote = annotation instanceof window.Core.Annotations.StickyAnnotation;
  const noteAdjustment = window.Core.Annotations.StickyAnnotation['SIZE'];

  const rotation = core.getCompleteRotation(annotation.PageNumber, documentViewerKey);
  if (rotation === 1) {
    [top, bottom] = [bottom, top];
    if (isNote) {
      top -= noteAdjustment;
      bottom -= noteAdjustment;
    }
  } else if (rotation === 2) {
    [left, right] = [right, left];
    [top, bottom] = [bottom, top];
    if (isNote) {
      top -= noteAdjustment;
      bottom -= noteAdjustment;
      left -= noteAdjustment;
      right -= noteAdjustment;
    }
  } else if (rotation === 3) {
    [left, right] = [right, left];
    if (isNote) {
      left -= noteAdjustment;
      right -= noteAdjustment;
    }
  }

  return { left, top, right, bottom };
};

const getSelectedTextPosition = (allQuads, documentViewerKey) => {
  if (!allQuads || Object.keys(allQuads).length === 0) {
    return { topLeft: null, bottomRight: null };
  }

  const { startPageNumber, endPageNumber } = getSelectedTextPageNumber(allQuads);
  if (!Number.isFinite(startPageNumber) || !Number.isFinite(endPageNumber)) {
    return { topLeft: null, bottomRight: null };
  }

  const { left, right, top, bottom } = getSelectedTextPageCoordinates(
    allQuads,
    startPageNumber,
    endPageNumber
  );

  let topLeft = convertPageCoordinatesToWindowCoordinates(left, top, startPageNumber, documentViewerKey);
  let bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, endPageNumber, documentViewerKey);

  if (core.getRotation() > 1) {
    const tmp = topLeft;
    topLeft = bottomRight;
    bottomRight = tmp;
  }

  if (!hasValidBounds({ topLeft, bottomRight })) {
    return { topLeft: null, bottomRight: null };
  }

  return { topLeft, bottomRight };
};

const getSelectedTextPageNumber = (allQuads) => {
  const pageNumbers = Object.keys(allQuads).map((pageNumber) => Number(pageNumber));
  // Object.keys returns keys in arbitrary order so use Math.min/max instead of index to access array
  const startPageNumber = Math.min(...pageNumbers);
  const endPageNumber = Math.max(...pageNumbers);

  return { startPageNumber, endPageNumber };
};

const getSelectedTextPageCoordinates = (allQuads, startPageNumber, endPageNumber) => {
  const getTopAndBottom = () => {
    const firstPageQuads = allQuads[startPageNumber];
    const firstQuad = firstPageQuads?.[0];
    if (!firstQuad) {
      return { top: null, bottom: null };
    }
    let top;

    if (firstQuad.y1 < firstQuad.y3) {
      top = firstQuad.y1;
    } else {
      top = firstQuad.y3;
    }

    const endPageQuads = allQuads[endPageNumber];
    if (!Array.isArray(endPageQuads) || endPageQuads.length === 0) {
      return { top: null, bottom: null };
    }
    const lastQuad = endPageQuads[endPageQuads.length - 1];
    let bottom;

    if (lastQuad.y1 < lastQuad.y3) {
      bottom = lastQuad.y3;
    } else {
      bottom = lastQuad.y1;
    }

    return { top, bottom };
  };

  const getLeftAndRight = () => {
    let left;
    let right;

    Object.keys(allQuads).forEach((pageNumber) => {
      allQuads[pageNumber].forEach((quad) => {
        const { x1: quadLeft, x2: quadRight } = quad;

        if (!left || quadLeft < left) {
          left = quadLeft;
        }
        if (!right || quadRight > right) {
          right = quadRight;
        }
      });
    });

    return { left, right };
  };

  const { top, bottom } = getTopAndBottom();
  const { left, right } = getLeftAndRight();

  return { left, top, bottom, right };
};

const convertPageCoordinatesToWindowCoordinates = (x, y, pageNumber, documentViewerKey = 1) => {
  const displayMode = core.getDisplayModeObject(documentViewerKey);
  if (!displayMode || typeof displayMode.pageToWindow !== 'function') {
    return null;
  }

  return displayMode.pageToWindow({ x, y }, pageNumber);
};

const getPopupDimensions = (popup) => {
  if (!popup?.current || typeof popup.current.getBoundingClientRect !== 'function') {
    return { width: 0, height: 0 };
  }

  const { width, height } = popup.current.getBoundingClientRect();
  return { width, height };
};

const calcAnnotationPopupPosition = (annotationPosition, popupDimension, documentViewerKey, gap, anchorNode) => {
  const top = calcPopupTop(annotationPosition, popupDimension, documentViewerKey, anchorNode, gap);
  const left = calcPopupLeft(annotationPosition, popupDimension, documentViewerKey, anchorNode);

  return { left, top };
};

const calcTextPopupPosition = (selectedTextPosition, popupDimension, documentViewerKey, anchorNode) => {
  const top = calcPopupTop(selectedTextPosition, popupDimension, documentViewerKey, anchorNode, defaultGap);
  const left = calcPopupLeft(selectedTextPosition, popupDimension, documentViewerKey, anchorNode);

  return { left, top };
};

/** @ignore */
export const getContainingBlockDocOffset = (anchorNode) => {
  const { scrollX, scrollY } = getWindowScroll();
  const localRoot = anchorNode?.getRootNode?.();
  const hostContainer = window.isApryseWebViewerWebComponent ? (localRoot?.host || getRootNode()?.host) : null;
  if (!hostContainer || typeof hostContainer.getBoundingClientRect !== 'function') {
    return { top: scrollY, left: scrollX };
  }
  const { top, left } = hostContainer.getBoundingClientRect();
  return {
    top: (Number.isFinite(top) ? top : 0) + scrollY,
    left: (Number.isFinite(left) ? left : 0) + scrollX,
  };
};

export const calcPopupLeft = ({ topLeft, bottomRight }, { width }, documentViewerKey, anchorNode) => {
  if (!hasValidBounds({ topLeft, bottomRight })) {
    return fallbackPosition.left;
  }

  const scrollViewElement = core.getScrollViewElement(documentViewerKey);
  const scrollLeft = scrollViewElement ? getRtlSafeScrollLeft(scrollViewElement) : 0;
  const containingBlockLeft = getContainingBlockDocOffset(anchorNode).left;

  const annotCenter = (topLeft.x + bottomRight.x) / 2;
  const scaledWidth = width / getSafeScale().scaleX;
  let left = annotCenter - scrollLeft - containingBlockLeft - scaledWidth / 2;

  if (left < 0) {
    left = 0;
  } else if (left + scaledWidth > window.innerWidth) {
    left = window.innerWidth - scaledWidth;
  }

  return Math.round(left);
};

/**
 * @ignore
 * @param {number} annotationPosition The position of the annotation (topLeft, bottomRight)
 * @param {number} popupDimension The deminition of the popup (width, height)
 * this is specifically used for the annotation popup to keep the popup on the same side of the annotation.
 */
export const calcPopupTop = ({ topLeft, bottomRight }, { height }, documentViewerKey, anchorNode, gap = defaultGap) => {
  if (!hasValidBounds({ topLeft, bottomRight })) {
    return fallbackPosition.top;
  }

  const scrollContainer = core.getScrollViewElement(documentViewerKey);
  if (!scrollContainer || typeof scrollContainer.getBoundingClientRect !== 'function') {
    return fallbackPosition.top;
  }

  const padding = 5;
  const visibleRegion = getScrollContainerDocRect(scrollContainer);
  const scaledHeight = height / getSafeScale().scaleY;
  const annotTop = topLeft.y - gap;
  const annotBottom = bottomRight.y + gap;

  const fitsBelow = annotBottom + scaledHeight < visibleRegion.bottom;
  const fitsAbove = annotTop - scaledHeight > visibleRegion.top;
  const moreRoomAbove = annotTop > visibleRegion.bottom - annotBottom;

  let top;
  if (fitsBelow) {
    top = annotBottom;
  } else if (fitsAbove) {
    top = annotTop - scaledHeight;
  } else if (moreRoomAbove) {
    top = visibleRegion.top + padding;
  } else {
    top = visibleRegion.bottom - padding - scaledHeight;
  }

  return Math.round(top - scrollContainer.scrollTop - getContainingBlockDocOffset(anchorNode).top);
};

export const getReaderModePopupPositionBasedOn = (annotPosition, popup, viewer) => {
  const { width, height } = popup.current.getBoundingClientRect();
  const viewerRect = viewer.current.getBoundingClientRect();

  let top = 5;
  const annotTop = annotPosition.top - defaultGap;
  const annotBottom = annotPosition.bottom + defaultGap;
  if (annotBottom + height < viewerRect.height) {
    top = annotBottom;
  } else if (annotTop > height) {
    top = annotTop - height;
  }
  top = Math.round(top + viewerRect.top);

  const center = (annotPosition.left + annotPosition.right) / 2;
  let left = center - width / 2;
  if (left < 0) {
    left = 0;
  } else if (left + width > viewerRect.width) {
    left = viewerRect.width - width;
  }
  left = Math.round(left + viewerRect.left);

  return { top, left };
};

export const getMouseEventPosition = (e) => {
  let { x, y } = e;

  if (window.isApryseWebViewerWebComponent) {
    const instanceRect = getRootNode().host.getBoundingClientRect();
    x -= instanceRect.left;
    y -= instanceRect.top;
  }

  return {
    top: y,
    left: x,
  };
};
