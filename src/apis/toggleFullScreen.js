/**
 * Toggles full scree mode of the browser.
 * @method WebViewer#toggleFullScreen
 * @example viewerElement.addEventListener('ready', () => {
  const instance = viewer.getInstance();
  instance.toggleFullScreen();
});
 */

import toggleFullscreen from 'helpers/toggleFullscreen';

export default () => {
  toggleFullscreen();
};
