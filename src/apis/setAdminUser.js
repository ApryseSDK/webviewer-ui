/**
 * Sets the current user to be admin or not. Admin users have permission to edit/delete any annotations, including the ones they didn't create.
 * @method CoreControls.ReaderControl#setAdminUser
 * @param {boolean} isAdmin Whether or not to set the current user to be an admin.
 * @example // sets the current user to be an admin
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setAdminUser(true);
});
 */

import core from 'core';

export default isAdmin =>  {
  core.setIsAdminUser(isAdmin);
};
