/**
 * Go to the next page of the document. Makes the document viewer display the next page of the document.
 * @method WebViewer#goToNextPage
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.goToNextPage();
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
    instance.goToNextPage();
  });
});
 */

import core from 'core';
import selectors from 'selectors';

export default store => () => {
  const state = store.getState();
  const currentPage = selectors.getCurrentPage(state);
  const totalPages = selectors.getTotalPages(state);

  const DisplayModes = window.CoreControls.DisplayModes;
  const currentDisplayMode = window.readerControl.getLayoutMode();
  let pageIncrease = 1;
  if (currentDisplayMode !== DisplayModes.Single
    && currentDisplayMode !== DisplayModes.Continuous) {
    pageIncrease = 2;
  }

  if (currentPage === totalPages) {
    console.warn('you are at the last page');
  } else {
    const nextPage = currentPage + pageIncrease > totalPages ? totalPages : currentPage + pageIncrease;
    core.setCurrentPage(nextPage);
  }
};
