import actions from 'actions';

/**
 * Show outline control
 * @method UI.showOutlineControl
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.showOutlineControl();
  });
 */

export default store => () => {
  store.dispatch(actions.setOutlineControlVisibility(true));
};
