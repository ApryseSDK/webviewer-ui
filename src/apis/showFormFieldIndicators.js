import actions from 'actions';

/**
 * Show form field indicators to help navigate or guide users through the process of form filling.
 * @method UI.showFormFieldIndicators
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.showFormFieldIndicators();
  });
 */
export default (store) => () => {
  store.dispatch(actions.enableElement('formFieldIndicatorContainer'));
};