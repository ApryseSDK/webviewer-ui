import actions from 'actions';

/**
 * Enable the confirmation modal when applying a crop to a page
 *
 * @method UI.enableApplyCropWarningModal
 * @example
 WebViewer(...)
 .then(function(instance) {
    instance.UI.enableApplyCropWarningModal();
  });
 */
const enableApplyCropWarningModal = (store) => () => {
  store.dispatch(actions.enableApplyCropWarningModal());
};

export default enableApplyCropWarningModal;
