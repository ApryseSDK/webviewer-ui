import actions from 'actions';

/**
 * hide outline control
 * @method UI.hideOutlineControl
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.hideOutlineControl();
  });
 */

export default (store) => () => {
  store.dispatch(actions.setOutlineControlVisibility(false));
};
