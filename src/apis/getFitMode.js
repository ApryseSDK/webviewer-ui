/**
 * Return the current fit mode of the WebViewer.
 * @method WebViewer#getFitMode
 * @return {CoreControls.ReaderControl#FitMode} Current fit mode
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  const { docViewer } = instance;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    console.log(instance.getFitMode());
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
    console.log(instance.getFitMode());
  });
});
 */

import selectors from 'selectors';

export default store => () => selectors.getFitMode(store.getState());