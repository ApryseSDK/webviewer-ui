import core from 'core';

export const getAnnotationPopupPositionBasedOn = (annotation, popup) => {
  const { left, top } = calcAnnotationPopupPosition(getAnnotationPosition(annotation), getPopupDimensions(popup));
  
  return { left, top };
};

export const getTextPopupPositionBasedOn = (allQuads, popup) => {
  const { left, top } = calcTextPopupPosition(getSelectedTextPosition(allQuads), getPopupDimensions(popup));

  return { left, top };
};

const getAnnotationPosition = annotation => {
  const { left, top, right, bottom } = getAnnotationPageCoordinates(annotation);

  const pageIndex = annotation.getPageNumber() - 1;
  let topLeft = convertPageCoordinatesToWindowCoordinates(left, top, pageIndex);
  let bottomRight = convertPageCoordinatesToWindowCoordinates(right, bottom, pageIndex);

  if (core.getRotation() > 1) {
    const tmp = topLeft;
    topLeft = bottomRight;
    bottomRight = tmp;
  }
  
  return { topLeft, bottomRight };
};

const getAnnotationPageCoordinates = annotation => {
  const { x1: left, y1: top } = annotation.getRect();
  let { x2: right, y2: bottom } = annotation.getRect();

  if (annotation instanceof window.Annotations.StickyAnnotation) {
    const zoom = core.getZoom();
    right = left + annotation.getWidth() / zoom;
    bottom = top + annotation.getHeight() / zoom;
  }

  return { left, top, right, bottom };
};

const getSelectedTextPosition = allQuads => {
  const { startPageIndex, endPageIndex } = getSelectedTextPageIndex(allQuads);
  const { left, right, top, bottom } = getSelectedTextPageCoordinates(allQuads, startPageIndex, endPageIndex);

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
    const lastQuad = endPageQuads[endPageQuads.length-1];
    const bottom = lastQuad.y1;

    return { top, bottom };
  };

  const getLeftAndRight = () => {
    let left, right;

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
  const topThreshold = 300;
  const top = calcPopupTop(annotationPosition, popupDimension, topThreshold);
  const left = calcPopupLeft(annotationPosition, popupDimension);

  return { left, top };
};

const calcTextPopupPosition = (selectedTextPosition, popupDimension) => {
  const topThreshold = 150;
  const top = calcPopupTop(selectedTextPosition, popupDimension, topThreshold);
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

  return left;
};

const calcPopupTop = ({ topLeft, bottomRight } , { height }, topThreshold) => {
  const { scrollTop } = core.getScrollViewElement();
  const topGap = 10;
  const bottomGap = 17;

  let top = topLeft.y - scrollTop - topGap;

  if (top < topThreshold) {
    top = bottomRight.y - scrollTop + bottomGap;
  } else {
    top -= height;
  }

  return top;
};