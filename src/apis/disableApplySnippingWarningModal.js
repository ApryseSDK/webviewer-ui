import actions from 'actions';

/**
 * Disable the confirmation modal when snipping a page
 *
 * @method UI.disableApplySnippingWarningModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.disableApplySnippingWarningModal();
  });
 */
const disableApplySnippingWarningModal = (store) => () => {
  store.dispatch(actions.disableApplySnippingWarningModal());
};

export default disableApplySnippingWarningModal;
