/**
 * Sets the current page number (1-indexed) of the document loaded in the WebViewer.
 * @method WebViewer#setCurrentPageNumber
 * @param {number} pageNumber The page number (1-indexed) of the document to set.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  instance.setCurrentPageNumber(2);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.setCurrentPageNumber(2);
  });
});
 */

import core from 'core';

export default pageNumber => {
  core.setCurrentPage(pageNumber);
};
