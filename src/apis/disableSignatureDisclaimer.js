import actions from 'actions';

/**
 * Disables disclaimer from being shown in the signature modal.
 * See more: https://sdk.apryse.com/api/web/UI.html#.disableSignatureDisclaimer__anchor.
 * @method UI.disableSignatureDisclaimer
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     instance.UI.disableSignatureDisclaimer();
 *   });
 */
export default (store) => () => {
  store.dispatch(actions.setSignatureDisclaimerEnabled(false));
};