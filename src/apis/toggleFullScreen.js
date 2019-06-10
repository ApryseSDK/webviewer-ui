/**
 * Toggles full scree mode of the browser.
 * @method WebViewer#toggleFullScreen
 * @example // 5.1 and after
WebViewer(...)
  .then(function(instance) {
    instance.toggleFullScreen();
  });
 * @example // 4.0 ~ 5.0
var viewerElement = document.getElementById('viewer');
var viewer = new PDFTron.WebViewer(...);

viewerElement.addEventListener('ready', function() {
  var instance = viewer.getInstance();
  instance.toggleFullScreen();
});
 */

import toggleFullscreen from 'helpers/toggleFullscreen';

export default () => {
  toggleFullscreen();
};
