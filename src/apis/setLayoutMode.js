/**
 * Sets the layout mode of the viewer.
 * @method UI.setLayoutMode
 * @param {string} layoutMode Layout mode of WebViewerInstance UI.
 * @see UI.LayoutMode
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;
    const LayoutMode = instance.UI.LayoutMode;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.UI.setLayoutMode(LayoutMode.FacingContinuous);
    });
  });
 */

import core from 'core';

export default mode => {
  core.setDisplayMode(mode);
};
