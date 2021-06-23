/**
 * Return the current zoom level
 * @method UI.getZoomLevel
 * @return {number} Zoom level (0 ~ 1)
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.UI.getZoomLevel());
    });
  });
 */

import core from 'core';

export default () => core.getZoom();
