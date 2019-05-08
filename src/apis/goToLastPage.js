/**
 * Go to the last page of the document. Makes the document viewer display the last page of the document.
 * @method WebViewer#goToLastPage
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  const { docViewer } = instance;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.goToLastPage();
  });
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', function() {
    instance.goToLastPage();
  });
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  core.setCurrentPage(selectors.getTotalPages(store.getState()));  
};
