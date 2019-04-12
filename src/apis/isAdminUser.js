/**
 * Returns whether the current user is admin.
 * @method CoreControls.ReaderControl#isAdminUser
 * @returns {boolean} Whether the user is admin.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.isAdminUser());
});
 */

import core from 'core';

export default () => !!core.getIsAdminUser();