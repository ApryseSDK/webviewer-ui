import actions from 'actions';

/**
 * hide outline control
 * @method WebViewerInstance#hideOutlineControl
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.hideOutlineControl();
  });
 */

export default store => () => {
  store.dispatch(actions.setOutlineControlVisibility(false));
};
