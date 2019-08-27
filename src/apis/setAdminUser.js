/**
 * Sets the current user to be admin or not. Admin users have permission to edit/delete any annotations, including the ones they didn't create.
 * @method WebViewer#setAdminUser
 * @param {boolean} isAdmin Whether or not to set the current user to be an admin.
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.setAdminUser(true); // sets the current user to be an admin
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.setAdminUser(true); // sets the current user to be an admin
});
 */

import core from 'core';

export default isAdmin => {
  core.setIsAdminUser(isAdmin);
};
