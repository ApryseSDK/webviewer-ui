import selectors from 'selectors';
/**
 * Returns a boolean to denote if the UI is in desktop only mode.
 * @method UI.isInDesktopOnlyMode
 * @return {boolean} boolean to denote if the UI is in desktop only mode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.isInDesktopOnlyMode();
  });
 */
export default store => () => {
  return selectors.isInDesktopOnlyMode(store.getState());
};
