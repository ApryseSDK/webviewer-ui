/**
 * Return the current language used in WebViewer.
 * @method UI.getCurrentLanguage
 * @return {string} Current language code
 * @example
WebViewer(...)
  .then(function(instance) {
    console.log(instance.UI.getCurrentLanguage());
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getCurrentLanguage(store.getState());
