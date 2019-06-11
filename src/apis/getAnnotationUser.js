/**
 * Return the current username.
 * @method WebViewer#getAnnotationUser
 * @return {string} Current username
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    console.log(instance.getAnnotationUser());
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.getAnnotationUser());
});
 */

import core from 'core';

export default () => core.getCurrentUser();
