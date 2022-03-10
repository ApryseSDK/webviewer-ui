import actions from 'actions';

/**
 * Enable the confirmation modal when deleting a page from the thumbnail view
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
