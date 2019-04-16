/**
 * Sets the current page number (1-indexed) of the document loaded in the WebViewer.
 * @method WebViewer#setCurrentPageNumber
 * @param {number} pageNumber The page number (1-indexed) of the document to set.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setCurrentPageNumber(1);
});
 */

import core from 'core';

export default pageNumber => {
  core.setCurrentPage(pageNumber);
};
