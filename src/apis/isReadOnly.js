/**
 * Returns whether the current mode is read only.
 * @method WebViewer#isReadOnly
 * @returns {boolean} Whether the current mode is read only.
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  console.log(instance.isReadOnly());
});
 */

import core from 'core';

export default () => !!core.getIsReadOnly();
