/**
 * Return the current username.
 * @method CoreControls.ReaderControl#getAnnotationUser
 * @return {string} Current username
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.getAnnotationUser());
});
 */

import core from 'core';

export default () => core.getCurrentUser();
