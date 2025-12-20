/**
 * Returns the maximum zoom level
 * @method UI.getMaxZoomLevel
 * @return {number} Maximum zoom level
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this API
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getMaxZoomLevel());
    });
  });
 */

import zoomFactors from 'constants/zoomFactors';

export default () => zoomFactors.getMaxZoomLevel();