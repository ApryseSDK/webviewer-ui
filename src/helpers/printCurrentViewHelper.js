/**
 * @ignore
 * Utility function that returns a bounding box of the current view of WebViewer.
 * @param {object} core Core object
 * @param {number} pageNumber Page number of the current page being viewed.
 * @returns {Core.Math.Rect} A {@link Core.Math.Rect} containing the two points that form a bounding box of current view.
 */
function getCurrentViewRect(core, pageNumber) {
  const displayMode = core.getDisplayModeObject();
  const containerElement = core.getScrollViewElement();
  const documentElement = core.getViewerElement();
  const containerRect = containerElement.getBoundingClientRect();
  const documentRect = documentElement.getBoundingClientRect();
  const { scrollLeft, scrollTop } = containerElement;

  const coordinates = [
    displayMode.windowToPageNoRotate({
      x: scrollLeft + Math.max(containerRect.left, documentRect.left),
      y: scrollTop + Math.max(containerRect.top, documentRect.top)
    }, pageNumber),
    displayMode.windowToPageNoRotate({
      x: scrollLeft + Math.min(containerRect.right, documentRect.right),
      y: scrollTop + Math.min(containerRect.bottom, documentRect.bottom)
    }, pageNumber),
  ];

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