import actions from 'actions';

/**
 * @callback CustomApplyRedactionsHandler
 * @memberof UI
 * @param {Array.<Core.Annotations.Annotation>} annotations
 * @param {function} originalApplyRedactionsFunction The original applyRedactions function
 */

/**
 * @method UI.setCustomApplyRedactionsHandler
 * @param {UI.CustomApplyRedactionsHandler} customApplyRedactionsHandler
 * The function that will be invoked when clicking on the 'Redact All' button.
 * @example
 WebViewer(...)
  .then(function(instance) {
    instance.UI.setCustomApplyRedactionsHandler((annotationsToRedact, originalApplyRedactionsFunction) => {
      // custom code
      ...
      originalApplyRedactionsFunction();
    })
  });
 */

export default store => customApplyRedactionsHandler => {
  store.dispatch(actions.setCustomApplyRedactionsHandler(customApplyRedactionsHandler));
};