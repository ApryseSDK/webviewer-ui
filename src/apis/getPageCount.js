/**
 * Return the total number of pages of the document loaded in the WebViewer.
 * @method WebViewer#getPageCount
 * @return {number} Total number of pages
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  console.log(instance.getPageCount());
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;
  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    console.log(instance.getPageCount());
  });
});
 */

import selectors from 'selectors';

export default store => () => selectors.getTotalPages(store.getState());
