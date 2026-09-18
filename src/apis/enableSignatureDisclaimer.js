import actions from 'actions';

/**
 * Enables disclaimer to be shown in the signature modal.
 *
 * Users are also able to set the disclaimer text using the `UI.setTranslations` API keying
 * into the 'message.signatureDisclaimer' key.
 *
 * See more: https://sdk.apryse.com/api/web/UI.html#.enableSignatureDisclaimer__anchor.
 * @method UI.enableSignatureDisclaimer
 * @example
 * WebViewer(...)
 *   .then(function(instance) {
 *     instance.UI.enableSignatureDisclaimer();
 *     instance.UI.setTranslations('en', {
 *       'message.signatureDisclaimer': '...'
 *     });
 *   });
 */
export default (store) => () => {
  store.dispatch(actions.setSignatureDisclaimerEnabled(true));
};