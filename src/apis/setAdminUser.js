/**
 * Sets the current user to be admin or not. Admin users have permission to edit/delete any annotations, including the ones they didn't create.
 * @method WebViewer#setAdminUser
 * @param {boolean} isAdmin Whether or not to set the current user to be an admin.
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.setAdminUser(true); // sets the current user to be an admin
 */

import core from 'core';

export default isAdmin =>  {
  core.setIsAdminUser(isAdmin);
};
