/**
 * Go to the previous page of the document. Makes the document viewer display the previous page of the document.
 * @method WebViewer#goToPrevPage
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.goToPrevPage();
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
    instance.goToPrevPage();
  });
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const currentPage = selectors.getCurrentPage(store.getState());

  const DisplayModes = window.CoreControls.DisplayModes;
  const currentDisplayMode = window.readerControl.getLayoutMode();
  let pageDecrease = 1;
  if (currentDisplayMode !== DisplayModes.Single
    && currentDisplayMode !== DisplayModes.Continuous) {
    pageDecrease = 2;
  }

  if (currentPage === 1) {
    console.warn('You are at the first page');
  } else {
    const prevPage = currentPage - pageDecrease > 1 ? currentPage - pageDecrease : 1;
    core.setCurrentPage(prevPage);
  }
};