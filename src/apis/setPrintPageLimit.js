/**
 * Sets the print page limit. This is a limit how many pages will be rendered at once. The viewer's default limit is 0 (unlimited).
 * @method UI.setPrintPageLimit
 * @param {number} limit The page rendering limit of the document to print. Must be a positive number or zero (unlimited).
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.setPrintPageLimit(100);
  });
 */

import actions from 'actions';

export default store => limit => {
    if (limit < 0) {
        throw Error('Value must be a positive number or zero (unlimited)');
    }
    store.dispatch(actions.setPrintPageLimit(limit));
};
