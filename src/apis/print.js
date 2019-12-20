/**
 * Print the current document.
 * @method WebViewerInstance#print
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.print();
    });
  });
 */

import print from 'helpers/print';
import selectors from 'selectors';

export default store => () => {
  print(store.dispatch, selectors.isEmbedPrintSupported(store.getState()));
};
