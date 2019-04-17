/**
 * Toggles full scree mode of the browser.
 * @method WebViewer#toggleFullScreen
 * @example const viewerElement = document.getElementById('viewer');
const instance = await WebViewer({ ... }, viewerElement);
instance.toggleFullScreen();
 */

import toggleFullscreen from 'helpers/toggleFullscreen';

export default () => {
  toggleFullscreen();
};
