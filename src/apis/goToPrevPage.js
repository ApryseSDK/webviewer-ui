/**
 * Go to the previous page of the document. Makes the document viewer display the previous page of the document.
 * @method WebViewer#goToPrevPage
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  instance.goToPrevPage();
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;
  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.goToPrevPage();
  });
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const currentPage = selectors.getCurrentPage(store.getState());
  
  if (currentPage === 1) {
  console.warn('You are at the first page');
  } else {
    const prevPage = currentPage - 1;
    core.setCurrentPage(prevPage);  
  }
};