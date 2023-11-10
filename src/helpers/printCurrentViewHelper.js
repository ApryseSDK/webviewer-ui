import core from 'core';
import getRootNode, { getInstanceNode } from './getRootNode';

/**
 * @ignore
 * Utility function that returns a bounding box of the current view of WebViewer.
 * @param {number} pageNumber Page number of the current page being viewed.
 * @returns {Core.Math.Rect} A {@link Core.Math.Rect} containing the two points that form a bounding box of current view.
 */
function getCurrentViewRect(pageNumber) {
  const displayMode = core.getDisplayModeObject();
  const containerElement = core.getScrollViewElement();
  const documentElement = core.getViewerElement();
  const headerElement = getRootNode().querySelector('.Header');
  const headerItemsElements = getRootNode().querySelector('.HeaderToolsContainer');
  const isApryseWebViewerWebComponent = window.isApryseWebViewerWebComponent;
  let innerWidth = window.innerWidth;
  let innerHeight = window.innerHeight;
  let containerScrollLeft = containerElement.scrollLeft;
  let documentElementOffsetLeft = documentElement.offsetLeft;

  if (isApryseWebViewerWebComponent) {
    const instanceRect = getInstanceNode().getBoundingClientRect();
    innerWidth = instanceRect.width;
    innerHeight = instanceRect.height;
    containerScrollLeft = instanceRect.x + containerElement.scrollLeft;
    documentElementOffsetLeft = instanceRect.x + documentElement.offsetLeft;
  }

  const coordinates = [];
  const headerHeight = (headerElement?.clientHeight + headerItemsElements?.clientHeight) || 0;

  coordinates[0] = displayMode.windowToPageNoRotate({
    x: Math.max(containerScrollLeft, documentElementOffsetLeft),
    y: Math.max(containerElement.scrollTop + headerHeight, 0)
  }, pageNumber);

  coordinates[1] = displayMode.windowToPageNoRotate({
    x: Math.min(innerWidth, documentElementOffsetLeft + documentElement.offsetWidth) + containerScrollLeft,
    y: innerHeight + containerElement.scrollTop
  }, pageNumber);

  const x1 = Math.min(coordinates[0].x, coordinates[1].x);
  const y1 = Math.min(coordinates[0].y, coordinates[1].y);
  const x2 = Math.max(coordinates[0].x, coordinates[1].x);
  const y2 = Math.max(coordinates[0].y, coordinates[1].y);

  return new window.Core.Math.Rect(x1, y1, x2, y2);
}

/**
 * @ignore
 * Utility function that checks if current view rect contains the entire page.
 * @param {Core.Math.Rect} currentViewRect Object containing { x1, y1, x2, y2 } positions.
 * @param {object} pageDimensions Object containing width and height of page to compare.
 * @returns {boolean} Returns true if the whole page fits within current view rect.
 */
function doesCurrentViewContainEntirePage(currentViewRect, pageDimensions) {
  if (!currentViewRect || !pageDimensions) {
    return undefined;
  }

  const dimesions = {
    width: currentViewRect.x2 - currentViewRect.x1,
    height: currentViewRect.y2 - currentViewRect.y1
  };

  return (
    dimesions.width >= pageDimensions.width &&
    dimesions.height >= pageDimensions.height
  );
}

export {
  getCurrentViewRect,
  doesCurrentViewContainEntirePage
};