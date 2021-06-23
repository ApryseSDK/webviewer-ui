/**
 * Return the max zoom level
 * @method UI.getMaxZoomLevel
 * @return {number} max zoom level
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.UI.getMaxZoomLevel());
    });
  });
 */

import zoomFactors from 'constants/zoomFactors';

export default () => zoomFactors.getMaxZoomLevel();