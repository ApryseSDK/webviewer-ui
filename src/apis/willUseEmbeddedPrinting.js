/**
 * Returns whether Webviewer will use/not use embedded printing.
 * Will return false if the browser doesn't support embedded printing or if UI.useEmbeddedPrint is set to false.
 * @method UI.willUseEmbeddedPrinting
 * @example
WebViewer(...)
  .then(function(instance) {
    instance.UI.willUseEmbeddedPrinting(); // Returns true/false if embedded printing is supported and enabled
  });
 */

import selectors from 'selectors';

export default (store) => () => !!selectors.isEmbedPrintSupported(store.getState());