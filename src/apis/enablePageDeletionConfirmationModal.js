import actions from 'actions';

/**
 * Enable the confirmation modal when deleteing a page from the thumnail view
 *
 * @method UI.enablePageDeletionConfirmationModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.enablePageDeletionConfirmationModal();
  });
 */
function enablePageDeletionConfirmationModal(store) {
  return function enablePageDeletionConfirmationModal() {
    store.dispatch(actions.enablePageDeletionConfirmationModal());
  };
}

export default enablePageDeletionConfirmationModal;
