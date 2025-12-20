import isFullscreen from 'helpers/isFullscreen';

/**
 * Checks if the WebViewer UI is currently in fullscreen mode
 * @method UI.isFullscreen
 * @memberof UI
 * @returns {boolean} True if the UI is in fullscreen mode, false otherwise
 * @see UI.toggleFullScreen
 * @example
WebViewer(...)
  .then(function(instance) {
    const isFullscreenMode = instance.UI.isFullscreen();
    console.log('Fullscreen mode active:', isFullscreenMode);
  });
 */
export default () => {
  return isFullscreen();
};
