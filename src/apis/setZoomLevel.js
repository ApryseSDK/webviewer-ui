/**
 * Sets zoom level.
 * @method WebViewerInstance#setZoomLevel
 * @param {(string|number)} zoomLevel Zoom level in either number or percentage.
 * @example
WebViewer(...)
  .then(function(instance) {
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