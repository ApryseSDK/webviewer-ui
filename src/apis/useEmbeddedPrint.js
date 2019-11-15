/**
 * Use/not use embedded printing. Only applicable to Chrome.
 * The printing process will be faster and the quality might be higher when using Chrome's native printing.
 * You may not want to use embedded printing if there are custom annotations in your document.
 * @method WebViewer#useEmbeddedPrint
 * @param {boolean} [use=true] Whether or not to use embedded printing
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.useEmbeddedPrint(false); // disable embedded printing
  });
 */

import actions from 'actions';

export default store => useEmbeddedPrint => {
  store.dispatch(actions.useEmbeddedPrint(useEmbeddedPrint));
};