/**
 * Toggles full scree mode of the browser.
 * @method UI.toggleFullScreen
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.toggleFullScreen();
  });
 */

import toggleFullscreen from 'helpers/toggleFullscreen';

export default () => {
  toggleFullscreen();
};
