import actions from 'actions';

/**
 * Hide form field indicators.
 * @method UI.hideFormFieldIndicators
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.hideFormFieldIndicators();
  });
 */
export default (store) => () => {
  store.dispatch(actions.disableElement('formFieldIndicatorContainer'));
};