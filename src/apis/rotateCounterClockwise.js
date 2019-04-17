/**
 * Rotates the document in the WebViewer counter-clockwise.
 * @method WebViewer#rotateCounterClockwise
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.rotateCounterClockwise();
 */

import core from 'core';

export default () => {
  core.rotateCounterClockwise();  
};
