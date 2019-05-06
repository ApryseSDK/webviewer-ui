/**
 * Sets the layout mode of the viewer.
 * @method WebViewer#setLayoutMode
 * @param {CoreControls.ReaderControl#LayoutMode} layoutMode Layout mode of WebViewer.
 * @example // 5.1 and after
const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
const { docViewer, LayoutMode } = instance;

// you must have a document loaded when calling this api
docViewer.on('documentLoaded', () => {
  instance.setLayoutMode(LayoutMode.FacingContinuous);
});
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer({ ... }, viewerElement);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  var docViewer = instance.docViewer;
  var LayoutMode = instance.LayoutMode;
  // you must have a document loaded when calling this api
  docViewer.on('documentLoaded', () => {
    instance.setLayoutMode(LayoutMode.FacingContinuous);
  });
});
 */

import core from 'core';

export default mode =>  {
  core.setDisplayMode(mode);
};
