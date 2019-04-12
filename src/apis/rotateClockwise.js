/**
 * Rotates the document in the WebViewer clockwise.
 * @method CoreControls.ReaderControl#rotateClockwise
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.rotateClockwise();
});
 */

import core from 'core';

export default () => {
  core.rotateClockwise();  
};
