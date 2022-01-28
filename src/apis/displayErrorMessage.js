/**
 * Displays the custom error message
 * @method UI.displayErrorMessage
 * @param {string} message An error message
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.displayErrorMessage('My error message');
  });
 */

import actions from 'actions';

export default store => message => {
  store.dispatch(actions.showErrorMessage(message));
};
