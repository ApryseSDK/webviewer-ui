/**
 * Rotates the document in the WebViewer clockwise.
 * @method WebViewer#rotateClockwise
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);

instance.rotateClockwise();
 */

import core from 'core';

export default () => {
  core.rotateClockwise();  
};
