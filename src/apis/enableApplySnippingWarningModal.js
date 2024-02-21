import actions from 'actions';

/**
 * Enable the confirmation modal when snipping a page
 *
 * @method UI.enableApplySnippingWarningModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.enableApplySnippingWarningModal();
  });
 */
const enableApplySnippingWarningModal = (store) => () => {
  store.dispatch(actions.enableApplySnippingWarningModal());
};

export default enableApplySnippingWarningModal;
