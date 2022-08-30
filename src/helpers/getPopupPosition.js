import core from 'core';

// gap between the annotation selection box and the popup element
const gap = 17;

export const getAnnotationPopupPositionBasedOn = (annotation, popup) => {
  const { left, top } = calcAnnotationPopupPosition(
    getAnnotationPosition(annotation),
    getPopupDimensions(popup)
  );

  return { left: Math.max(left, 4), top };
};

export const getTextPopupPositionBasedOn = (allQuads, popup) => {
  const { left, top } = calcTextPopupPosition(
    getSelectedTextPosition(allQuads),
    getPopupDimensions(popup)
  );

  return { left, top };
};

export const getAnnotationPosition = (annotation) => {
  const { left, top, right, bottom } = getAnnotationPageCoordinates(annotation);

  const pageNumber = annotation.getPageNumber();
  const topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageNumber);
  const bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageNumber);

  if (annotation['NoZoom']) {
    const isNote = annotation instanceof window.Annotations.StickyAnnotation;
    const rect = annotation.getRect();
    const width = isNote ? window.Annotations.StickyAnnotation['SIZE'] : rect.getWidth();
    const height = isNote ? window.Annotations.StickyAnnotation['SIZE'] : rect.getHeight();
    const rotation = core.getCompleteRotation(annotation.PageNumber);
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

const getAnnotationPageCoordinates = (annotation) => {
  const rect = annotation.getRect();
  let { x1: left, y1: top, x2: right, y2: bottom } = rect;

  const isNote = annotation instanceof window.Annotations.StickyAnnotation;
  const noteAdjustment = window.Annotations.StickyAnnotation['SIZE'];

  const rotation = core.getCompleteRotation(annotation.PageNumber);
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

const getSelectedTextPosition = (allQuads) => {
  const { startPageNumber, endPageNumber } = getSelectedTextPageNumber(allQuads);
  const { left, right, top, bottom } = getSelectedTextPageCoordinates(
    allQuads,
    startPageNumber,
    endPageNumber
  );

  let topLeft = convertPageCoordinatesToWindowCoordinates(left, top, startPageNumber);
  let bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, endPageNumber);

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

const convertPageCoordinatesToWindowCoordinates = (x, y, pageNumber) => {
  const displayMode = core.getDisplayModeObject();

  return displayMode.pageToWindow({ x, y }, pageNumber);
};

const getPopupDimensions = (popup) => {
  const { width, height } = popup.current.getBoundingClientRect();

  return { width, height };
};

const calcAnnotationPopupPosition = (annotationPosition, popupDimension) => {
  const top = calcPopupTop(annotationPosition, popupDimension);
  const left = calcPopupLeft(annotationPosition, popupDimension);

  return { left, top };
};

const calcTextPopupPosition = (selectedTextPosition, popupDimension) => {
  const top = calcPopupTop(selectedTextPosition, popupDimension);
  const left = calcPopupLeft(selectedTextPosition, popupDimension);

  return { left, top };
};

export const calcPopupLeft = ({ topLeft, bottomRight }, { width }) => {
  const { scrollLeft } = core.getScrollViewElement();
  const center = (topLeft.x + bottomRight.x) / 2 - scrollLeft;
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
export const calcPopupTop = ({ topLeft, bottomRight }, { height }) => {
  const padding = 5;
  const scrollContainer = core.getScrollViewElement();
  const boundingBox = scrollContainer.getBoundingClientRect();
  const visibleRegion = {
    left: boundingBox.left + scrollContainer.scrollLeft,
    right: boundingBox.left + scrollContainer.scrollLeft + boundingBox.width,
    top: boundingBox.top + scrollContainer.scrollTop,
    bottom: boundingBox.top + scrollContainer.scrollTop + boundingBox.height,
  };

  const annotTop = topLeft.y - gap;
  const annotBottom = bottomRight.y + gap;

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
  const annotTop = annotPosition.top - gap;
  const annotBottom = annotPosition.bottom + gap;
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
