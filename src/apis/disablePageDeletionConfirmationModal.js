import actions from 'actions';

/**
 * Disable the confirmation modal when deleteing a page from the thumnail view
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
