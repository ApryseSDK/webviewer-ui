/**
 * Sets the WebViewer UI to be a read only mode. In read only mode, users cannot create/edit annotations.
 * @method WebViewer#setReadOnly
 * @param {boolean} isReadOnly Whether or not to set the WebViewer UI to be in in read only mode.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setReadOnly(true); // sets the viewer to read only mode
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setReadOnly(true); // sets the viewer to read only mode
});
 */

import core from 'core';

export default isReadOnly => {
  core.setReadOnly(isReadOnly);
};
