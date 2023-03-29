/**
 * Removes a search pattern from the redaction search panel
 * @method UI.removeRedactionSearchPattern
 * @param {UI.RedactionSearchPatterns | string} searchPattern A search pattern to remove from the redaction search panel. If you added a custom search pattern with {@link UI.addRedactionSearchPattern}, you must pass the type of the search pattern you added.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.removeRedactionSearchPattern(instance.UI.RedactionSearchPatterns.EMAILS);
  });

// If you added a custom search pattern for Social Security Number where the type is 'socialSecurityNumber'.
WebViewer(...)
.then(function(instance) {
  instance.UI.removeRedactionSearchPattern('socialSecurityNumber');
});
 */

import actions from 'actions';

export default (store) => (redactionSearchPattern) => {
  store.dispatch(actions.removeRedactionSearchPattern(redactionSearchPattern));
};