import core from 'core';
import { getWebComponentScale } from './getWebComponentScale';
import getRootNode from './getRootNode';

// gap between the annotation selection box and the popup element
const defaultGap = 17;

export const getAnnotationPopupPositionBasedOn = (annotation, popup, documentViewerKey = 1, gap = defaultGap) => {
  const { left, top } = calcAnnotationPopupPosition(
    getAnnotationPosition(annotation, documentViewerKey),
    getPopupDimensions(popup),
    documentViewerKey,
    gap,
  );

  return { left: Math.max(left, 4), top };
};

export const getTextPopupPositionBasedOn = (allQuads, popup, documentViewerKey = 1) => {
  const { left, top } = calcTextPopupPosition(
    getSelectedTextPosition(allQuads, documentViewerKey),
    getPopupDimensions(popup),
    documentViewerKey,
  );

  return { left, top };
};

export const getAnnotationPosition = (annotation, documentViewerKey = 1) => {
  const { left, top, right, bottom } = getAnnotationPageCoordinates(annotation, documentViewerKey);
  const pageNumber = annotation.getPageNumber();
  const currentDocumentPageCount = core.getDocumentViewers()[documentViewerKey - 1].getPageCount();

  if (pageNumber > currentDocumentPageCount) {
    return { topLeft: null, bottomRight: null };
  }

  const topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageNumber, documentViewerKey);
  const bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageNumber, documentViewerKey);

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

const getAnnotationPageCoordinates = (annotation, documentViewerKey = 1) => {
  const rect = annotation.getRect();
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
  const { startPageNumber, endPageNumber } = getSelectedTextPageNumber(allQuads);
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
    const firstQuad = allQuads[startPageNumber][0];
    const top = firstQuad.y3;

    const endPageQuads = allQuads[endPageNumber];
    const lastQuad = endPageQuads[endPageQuads.length - 1];
    const bottom = lastQuad.y1;

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

  return displayMode.pageToWindow({ x, y }, pageNumber);
};

const getPopupDimensions = (popup) => {
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
  const { scrollLeft } = core.getScrollViewElement(documentViewerKey);
  const center = (topLeft.x + bottomRight.x) / 2 - scrollLeft;

  width /= getWebComponentScale()?.scaleX;
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
  const padding = 5;
  const scrollContainer = core.getScrollViewElement(documentViewerKey);
  const boundingBox = scrollContainer.getBoundingClientRect();
  const visibleRegion = {
    left: boundingBox.left + scrollContainer.scrollLeft,
    right: boundingBox.left + scrollContainer.scrollLeft + boundingBox.width,
    top: boundingBox.top + scrollContainer.scrollTop,
    bottom: boundingBox.top + scrollContainer.scrollTop + boundingBox.height,
  };

  const scaleY = getWebComponentScale()?.scaleY;
  const isWebComponent = window.isApryseWebViewerWebComponent;
  if (isWebComponent) {
    const hostContainer = getRootNode().host;
    const containerBox = hostContainer.getBoundingClientRect();
    visibleRegion.top = (visibleRegion.top - containerBox.top) / scaleY;
    visibleRegion.bottom = (visibleRegion.bottom - containerBox.top) / scaleY;
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
