/**
 * Sets page labels that will be displayed in UI. You may want to use this API if the document's page labels start with characters/numbers other than 1.
 * @method WebViewer#setPageLabels
 * @param {Array.<string>} pageLabels Page labels that will be displayed in UI.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.setPageLabels(['i', 'ii', 'iii', '4', '5']); // assume a document has 5 pages
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
    instance.setPageLabels(['i', 'ii', 'iii', '4', '5']); // assume a document has 5 pages
  });
});
 */

import actions from 'actions';

export default store => pageLabels => {
  store.dispatch(actions.setPageLabels(pageLabels));
};