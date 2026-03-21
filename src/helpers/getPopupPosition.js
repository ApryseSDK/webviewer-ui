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

/**
 * Returns true if any part of the annotation is within the visible area of the scroll container.
 * Coordinates from `getAnnotationPosition` are in scroll-content space (via `pageToWindow`).
 * `getBoundingClientRect` returns viewport-relative values, so scroll offsets are added to convert them to the same coordinate space before comparing.
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

  const { top, bottom, left, right } = scrollContainer.getBoundingClientRect();
  const { scrollTop, scrollLeft } = scrollContainer;

  const isVerticallyVisible = bottomRight.y > top + scrollTop && topLeft.y < bottom + scrollTop;
  const isHorizontallyVisible = bottomRight.x > left + scrollLeft && topLeft.x < right + scrollLeft;

  return isVerticallyVisible && isHorizontallyVisible;
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

const calcAnnotationPopupPosition = (annotationPosition, popupDimension, documentViewerKey, gap) => {
  const top = calcPopupTop(annotationPosition, popupDimension, documentViewerKey, gap);
  const left = calcPopupLeft(annotationPosition, popupDimension, documentViewerKey);

  return { left, top };
};

const calcTextPopupPosition = (selectedTextPosition, popupDimension, documentViewerKey) => {
  const top = calcPopupTop(selectedTextPosition, popupDimension, documentViewerKey);
  const left = calcPopupLeft(selectedTextPosition, popupDimension, documentViewerKey);

  return { left, top };
};

export const calcPopupLeft = ({ topLeft, bottomRight }, { width }, documentViewerKey) => {
  if (!hasValidBounds({ topLeft, bottomRight })) {
    return fallbackPosition.left;
  }

  const scrollViewElement = core.getScrollViewElement(documentViewerKey);
  const scrollLeft = Number.isFinite(scrollViewElement?.scrollLeft) ? scrollViewElement.scrollLeft : 0;
  const center = (topLeft.x + bottomRight.x) / 2 - scrollLeft;

  width /= getSafeScale().scaleX;
  let left = center - width / 2;

  if (left < 0) {
    left = 0;
  } else if (left + width > window.innerWidth) {
    left = window.innerWidth - width;
  }

  return Math.round(left);
};

/**
 * @ignore
 * @param {number} annotationPosition The position of the annotation (topLeft, bottomRight)
 * @param {number} popupDimension The deminition of the popup (width, height)
 * this is specifically used for the annotation popup to keep the popup on the same side of the annotation.
 */
export const calcPopupTop = ({ topLeft, bottomRight }, { height }, documentViewerKey, gap = defaultGap) => {
  if (!hasValidBounds({ topLeft, bottomRight })) {
    return fallbackPosition.top;
  }

  const padding = 5;
  const scrollContainer = core.getScrollViewElement(documentViewerKey);
  if (!scrollContainer || typeof scrollContainer.getBoundingClientRect !== 'function') {
    return fallbackPosition.top;
  }

  const boundingBox = scrollContainer.getBoundingClientRect();
  const visibleRegion = {
    left: boundingBox.left + scrollContainer.scrollLeft,
    right: boundingBox.left + scrollContainer.scrollLeft + boundingBox.width,
    top: boundingBox.top + scrollContainer.scrollTop,
    bottom: boundingBox.top + scrollContainer.scrollTop + boundingBox.height,
  };

  const scaleY = getSafeScale().scaleY;
  const isWebComponent = window.isApryseWebViewerWebComponent;
  if (isWebComponent) {
    const rootNode = getRootNode();
    const hostContainer = rootNode && rootNode.host;
    if (hostContainer && typeof hostContainer.getBoundingClientRect === 'function') {
      const containerBox = hostContainer.getBoundingClientRect();
      visibleRegion.top = (visibleRegion.top - containerBox.top) / scaleY;
      visibleRegion.bottom = (visibleRegion.bottom - containerBox.top) / scaleY;
    }
  }

  const annotTop = topLeft.y - gap;
  const annotBottom = bottomRight.y + gap;

  height /= scaleY;

  let top;
  if (annotBottom + height < visibleRegion.bottom) {
    top = annotBottom;
  } else if (annotTop - height > visibleRegion.top) {
    top = annotTop - height;
  } else {
    // if there is no enough room to fit the style popup in either way (top or bottom)
    // We want to place it on the side that has more space
    if (annotTop > visibleRegion.bottom - annotBottom) { // if top has more space, place it to top
      top = visibleRegion.top + padding;
    } else { // otherwise, place it to bottom
      top = visibleRegion.bottom - padding - height;
    }
  }

  return Math.round(top - scrollContainer.scrollTop);
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

  const paddingLeft = parseFloat(viewer.current.firstChild.style.paddingLeft);
  const center = (annotPosition.left + annotPosition.right) / 2 + paddingLeft;
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
