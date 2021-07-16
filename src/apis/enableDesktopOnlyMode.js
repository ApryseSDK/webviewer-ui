import actions from 'actions';
/**
 * Enables desktop only mode on WebViewer UI.
 * This means that at small browser width/height, mobile/tablet CSS styling will not be applied.
 * @method UI.enableDesktopOnlyMode
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.enableDesktopOnlyMode();
  });
 */
export default store => () => {
  store.dispatch(actions.setEnableDesktopOnlyMode(true));
};
