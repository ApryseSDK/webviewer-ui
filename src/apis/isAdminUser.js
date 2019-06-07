/**
 * Returns whether the current user is admin.
 * @method WebViewer#isAdminUser
 * @returns {boolean} Whether the user is admin.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    console.log(instance.isAdminUser());
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  console.log(instance.isAdminUser());
});
 */

import core from 'core';

export default () => !!core.getIsAdminUser();