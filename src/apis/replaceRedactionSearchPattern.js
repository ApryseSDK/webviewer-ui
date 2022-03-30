/**
 * Sets a specific regex to be used when searching for one of the supported patterns in the redaction search panel
 * @method UI.replaceRedactionSearchPattern
 * @param {UI.RedactionSearchPatterns} searchPattern A search pattern for which the regex should be replaced
 *
 * @param {string} regex The regex to be used for the search pattern
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.replaceRedactionSearchPattern(instance.UI.RedactionSearchPatterns.EMAILS, '\\w+@\\w+\\.\\w+');
  });
 */

import actions from 'actions';

export default store => (searchPattern, regex) => {
  store.dispatch(actions.replaceRedactionSearchPattern(searchPattern, regex));
};
