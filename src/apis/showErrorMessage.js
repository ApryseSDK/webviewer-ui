/**
 * Displays the custom error message
 * @method WebViewerInstance#showErrorMessage
 * @param {string} message An error message
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.showErrorMessage('My error message');
  });
 */

import actions from 'actions';

export default store => message => {
  store.dispatch(actions.showErrorMessage(message));
};
