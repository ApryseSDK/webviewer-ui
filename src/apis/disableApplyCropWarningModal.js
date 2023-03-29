import actions from 'actions';

/**
 * Disable the confirmation modal when applying a crop to a page
 *
 * @method UI.disableApplyCropWarningModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.disableApplyCropWarningModal();
  });
 */
const disableApplyCropWarningModal = (store) => () => {
  store.dispatch(actions.disableApplyCropWarningModal());
};

export default disableApplyCropWarningModal;
