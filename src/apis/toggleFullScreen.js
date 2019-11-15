/**
 * Toggles full scree mode of the browser.
 * @method WebViewer#toggleFullScreen
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.toggleFullScreen();
  });
 */

import toggleFullscreen from 'helpers/toggleFullscreen';

export default () => {
  toggleFullscreen();
};
