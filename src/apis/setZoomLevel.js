/**
 * Sets zoom level.
 * @method WebViewer#setZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example // 5.1 and after
WebViewer(...)
.then(instance => {
  const { docViewer } = instance;

  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.setZoomLevel('150%'); // or setZoomLevel(1.5)
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
    instance.setZoomLevel('150%'); // or setZoomLevel(1.5)
  });
});
 */

import core from 'core';
import getActualZoomLevel from 'helpers/getActualZoomLevel';

export default zoomLevel => {
  zoomLevel = getActualZoomLevel(zoomLevel);

  if (zoomLevel) {
    core.zoomTo(zoomLevel);
  } else {
  console.warn('Type of the argument for setZoomLevel must be either string or number');
  }
};