import actions from 'actions';

/**
 * Show outline control
 * @method WebViewerInstance#showOutlineControl
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.showOutlineControl();
  });
 */

export default store => () => {
  store.dispatch(actions.setOutlineControlVisibility(true));
};
