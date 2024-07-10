/**
 * Displays the custom error message
 * @method UI.showWarningMessage
 * @param {(string|object)} options Warning string message to display or an object for controlling the warning popup
 * @param {string} options.confirmBtnText The text that will be rendered in the confirm button
 * @param {string} options.title The title of the modal
 * @param {string} options.message The text that will rendered in the body of the modal
 * @param {function} options.onConfirm The callback function that will be invoked when the user clicks the Confirm button. The callback must return a Promise that resolves.
 * @param {function} options.onCancel The callback function that will be invoked when the user clicks the Cancel button. The callback must return a Promise that resolves.
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.showWarningMessage({
      title: 'This is my warning modal title',
      message: 'This is the body of my modal',
      confirmBtnText: 'Okay!',
      onConfirm: () => {
        console.log('The user clicked the confirm button');
        return Promise.resolve();
      },
      onCancel: () => {
        console.log('The user clicked the cancel button');
        return Promise.resolve();
      },
    });
  });
 */
import actions from 'actions';

export default (store) => (options) => {
  store.dispatch(actions.showWarningMessage(options));
};
