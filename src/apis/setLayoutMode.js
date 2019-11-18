/**
 * Sets the layout mode of the viewer.
 * @method WebViewer#setLayoutMode
 * @param {WebViewer.LayoutMode} layoutMode Layout mode of WebViewer.
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;
    var LayoutMode = instance.LayoutMode;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.setLayoutMode(LayoutMode.FacingContinuous);
    });
  });
 */

import core from 'core';

export default mode => {
  core.setDisplayMode(mode);
};
