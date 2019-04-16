/**
 * Rotates the document in the WebViewer counter-clockwise.
 * @method WebViewer#rotateCounterClockwise
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.rotateCounterClockwise();
});
 */

import core from 'core';

export default () => {
  core.rotateCounterClockwise();  
};
