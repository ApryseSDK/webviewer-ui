/**
 * Sets the current page number (1-indexed) of the document loaded in the WebViewer.
 * @method WebViewer#setCurrentPageNumber
 * @param {number} pageNumber The page number (1-indexed) of the document to set.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.setCurrentPageNumber(1);
 */

import core from 'core';

export default pageNumber => {
  core.setCurrentPage(pageNumber);
};
