/**
 * Sets name of the current user
 * @method WebViewer#setAnnotationUser
 * @param {string} username Username to be used for current user.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setAnnotationUser('Guest-1');
});
 */

import core from 'core';

export default userName => {
  core.setCurrentUser(userName);
};
