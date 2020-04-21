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

  const pageIndex = annotation.getPageNumber() - 1;
  const topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageIndex);
  const bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageIndex);

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
  const { startPageIndex, endPageIndex } = getSelectedTextPageIndex(allQuads);
  const { left, right, top, bottom } = getSelectedTextPageCoordinates(
    allQuads,
    startPageIndex,
    endPageIndex
  );

  let topLeft = convertPageCoordinatesToWindowCoordinates(left, top, startPageIndex);
  let bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, endPageIndex);

  if (core.getRotation() > 1) {
    const tmp = topLeft;
    topLeft = bottomRight;
    bottomRight = tmp;
  }

  return { topLeft, bottomRight };
};

const getSelectedTextPageIndex = allQuads => {
  const pageIndices = Object.keys(allQuads).map(pageIndex => Number(pageIndex));
  // Object.keys returns keys in arbitrary order so use Math.min/max instead of index to access array
  const startPageIndex = Math.min(...pageIndices);
  const endPageIndex = Math.max(...pageIndices);

  return { startPageIndex, endPageIndex };
};

const getSelectedTextPageCoordinates = (allQuads, startPageIndex, endPageIndex) => {
  const getTopAndBottom = () => {
    const firstQuad = allQuads[startPageIndex][0];
    const top = firstQuad.y3;

    const endPageQuads = allQuads[endPageIndex];
    const lastQuad = endPageQuads[endPageQuads.length - 1];
    const bottom = lastQuad.y1;

    return { top, bottom };
  };

  const getLeftAndRight = () => {
    let left;
    let right;

    Object.keys(allQuads).forEach(pageIndex => {
      allQuads[pageIndex].forEach(quad => {
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

const convertPageCoordinatesToWindowCoordinates = (x, y, pageIndex) => {
  const displayMode = core.getDisplayModeObject();

  return displayMode.pageToWindow({ x, y }, pageIndex);
};

const getPopupDimensions = popup => {
  const { width, height } = popup.current.getBoundingClientRect();

  return { width, height };
};

const calcAnnotationPopupPosition = (annotationPosition, popupDimension) => {
  const approximateHeight = 350;
  const top = calcPopupTop(annotationPosition, popupDimension, approximateHeight);
  const left = calcPopupLeft(annotationPosition, popupDimension);

  return { left, top };
};

const calcTextPopupPosition = (selectedTextPosition, popupDimension) => {
  const approximateHeight = 50;
  const top = calcPopupTop(selectedTextPosition, popupDimension, approximateHeight);
  const left = calcPopupLeft(selectedTextPosition, popupDimension);

  return { left, top };
};

const calcPopupLeft = ({ topLeft, bottomRight }, { width }) => {
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
const calcPopupTop = ({ topLeft, bottomRight }, { height }, approximateHeight) => {
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
  // in the current design the height of the annotation popup changes when the style edit button is clicked
  // however we don't know the height of it when an annotation is selected
  // if we instead use `height` then we might see the case where the style picker shows on the other side of the annotation
  if (annotBottom + approximateHeight < visibleRegion.bottom) {
    top = annotBottom;
  } else if (annotTop - approximateHeight > visibleRegion.top) {
    top = annotTop - height;
  } else if (annotBottom + height < visibleRegion.bottom) {
    // either side doesn't have enough space for the approximate height, we try to use the actual height of the popup element
    top = annotBottom;
  } else if (annotTop - height > visibleRegion.top) {
    top = annotTop - height;
  } else {
    // there's no room for it in the vertical axis, so just choose the top of the visible region
    top = visibleRegion.top + 5;
  }

  return Math.round(top - scrollContainer.scrollTop);
};
