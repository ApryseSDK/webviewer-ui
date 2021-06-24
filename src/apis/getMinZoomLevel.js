/**
 * Return the min zoom level
 * @method UI.getMinZoomLevel
 * @return {number} min zoom level
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getMinZoomLevel());
    });
  });
 */

import zoomFactors from 'constants/zoomFactors';

export default () => zoomFactors.getMinZoomLevel();