/**
 * Sets the WebViewer UI to be a read only mode. In read only mode, users cannot create/edit annotations.
 * @method WebViewer#setReadOnly
 * @param {boolean} isReadOnly Whether or not to set the WebViewer UI to be in in read only mode.
 * @example // sets the viewer to read only mode
viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.setReadOnly(true);
});
 */

import core from 'core';

export default isReadOnly =>  {
  core.setReadOnly(isReadOnly);  
};


