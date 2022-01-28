/**
 * Displays the custom error message
 * @method UI.showErrorMessage
 * @param {string} message An error message
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.showErrorMessage('My error message');
  });
 * @deprecated Since version 8.0. Use [displayErrorMessage]{@link UI.displayErrorMessage} instead.
 */

import actions from 'actions';

export default store => message => {
  console.warn('Deprecated since version 8.0. Please use displayErrorMessage instead');
  store.dispatch(actions.showErrorMessage(message));
};
