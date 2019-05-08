/**
 * Rotates the document in the WebViewer counter-clockwise.
 * @method WebViewer#rotateCounterClockwise
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  const { docViewer } = instance;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.rotateCounterClockwise();
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
    instance.rotateCounterClockwise();
  });
});
 */

import core from 'core';

export default () => {
  core.rotateCounterClockwise();  
};
