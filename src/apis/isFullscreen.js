import isFullscreen from 'helpers/isFullscreen';

/**
 * Returns whether in fullscreen mode.
 * @method UI.isFullscreen
 * @returns {boolean} Whether in fullscreen mode.
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.isFullscreen());
  });
 */
export default () => {
  return isFullscreen();
};
