import actions from 'actions';

/**
 * Disable the confirmation modal when deleting a page from the thumbnail view
 *
 * @method UI.disablePageDeletionConfirmationModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.disablePageDeletionConfirmationModal();
  });
 */
function disablePageDeletionConfirmationModal(store) {
  return function disablePageDeletionConfirmationModal() {
    store.dispatch(actions.disablePageDeletionConfirmationModal());
  };
}

export default disablePageDeletionConfirmationModal;
