import core from 'core';

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

const getAnnotationPosition = annotation => {
  const { left, top, right, bottom } = getAnnotationPageCoordinates(annotation);

  const pageNumber = annotation.getPageNumber();
  const topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageNumber);
  let bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageNumber);

  const isNote = annotation instanceof window.Annotations.StickyAnnotation;
  if (isNote) {
    const zoom = core.getZoom();
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    // the visual size of a sticky annotation isn't the same as the rect we get above due to its NoZoom property
    // here we do some calculations to try to make the rect have the same size as what the annotation looks in the canvas
    bottomRight = {
      x: topLeft.x + width / zoom * 1.2,
      y: topLeft.y + height / zoom * 1.2,
    };
  }

  return { topLeft, bottomRight };
};

const getAnnotationPageCoordinates = annotation => {
  const rect = annotation.getRect();
  let { x1: left, y1: top, x2: right, y2: bottom } = rect;

  const isNote = annotation instanceof window.Annotations.StickyAnnotation;
  const noteAdjustment = annotation.Width;

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

const getSelectedTextPosition = allQuads => {
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

const getSelectedTextPageNumber = allQuads => {
  const pageNumbers = Object.keys(allQuads).map(pageNumber => Number(pageNumber));
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

    Object.keys(allQuads).forEach(pageNumber => {
      allQuads[pageNumber].forEach(quad => {
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

const getPopupDimensions = popup => {
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
 * @param {number} approximateHeight The max height of the popup element.
 * this is specifically used for the annotation popup to keep the popup on the same side of the annotation.
 */
export const calcPopupTop = ({ topLeft, bottomRight }, { height }) => {
  const scrollContainer = core.getScrollViewElement();
  const boundingBox = scrollContainer.getBoundingClientRect();
  const visibleRegion = {
    left: boundingBox.left + scrollContainer.scrollLeft,
    right: boundingBox.left + scrollContainer.scrollLeft + boundingBox.width,
    top: boundingBox.top + scrollContainer.scrollTop,
    bottom: boundingBox.top + scrollContainer.scrollTop + boundingBox.height,
  };

  // gap between the annotation selection box and the popup element
  const gap = 13;
  const annotTop = topLeft.y - gap;
  const annotBottom = bottomRight.y + gap;

  let top;
  if (annotBottom + height < visibleRegion.bottom) {
    top = annotBottom;
  } else if (annotTop - height > visibleRegion.top) {
    top = annotTop - height;
  } else {
    // there's no room for it in the vertical axis, so just choose the top of the visible region
    top = visibleRegion.top + 5;
  }

  return Math.round(top - scrollContainer.scrollTop);
};
