/**
 * Sets the layout mode of the viewer.
 * @method WebViewer#setLayoutMode
 * @param {CoreControls.ReaderControl#LayoutMode} layoutMode Layout mode of WebViewer.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;
    var LayoutMode = instance.LayoutMode;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.setLayoutMode(LayoutMode.FacingContinuous);
    });
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
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
