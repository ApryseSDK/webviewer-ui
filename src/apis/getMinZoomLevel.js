/**
 * Return the min zoom level
 * @method WebViewerInstance#getMinZoomLevel
 * @return {number} min zoom level
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.getMinZoomLevel());
    });
  });
 */

import zoomFactors from 'constants/zoomFactors';

export default () => zoomFactors.getMinZoomLevel();