/**
 * Return the max zoom level
 * @method WebViewerInstance#getMaxZoomLevel
 * @return {number} max zoom level
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.getMaxZoomLevel());
    });
  });
 */

import zoomFactors from 'constants/zoomFactors';

export default () => zoomFactors.getMaxZoomLevel();