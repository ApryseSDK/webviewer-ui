import actions from 'actions';
/**
 * Disables desktop only mode on WebViewer UI.
 * This means that at small browser width/height, mobile/tablet CSS styling will be applied.
 * @method UI.disableDesktopOnlyMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.disableDesktopOnlyMode();
  });
 */
export default store => () => {
  store.dispatch(actions.setEnableDesktopOnlyMode(false));
};
