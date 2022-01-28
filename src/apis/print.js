/**
 * Print the current document.
 * @method UI.print
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;
    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.print();
    });
  });
 */

import { print } from 'helpers/print';
import selectors from 'selectors';

export default store => () => {
  print(
    store.dispatch,
    selectors.isEmbedPrintSupported(store.getState()),
    selectors.getSortStrategy(store.getState()),
    selectors.getColorMap(store.getState()),
  );
};
