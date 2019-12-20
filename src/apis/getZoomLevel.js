/**
 * Return the current zoom level
 * @method WebViewerInstance#getZoomLevel
 * @return {number} Zoom level (0 ~ 1)
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.getZoomLevel());
    });
  });
 */

import core from 'core';

export default () => core.getZoom();
