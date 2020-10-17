/**
 * Stops on-going page processing to cancel a print job.
 * @method WebViewerInstance#cancelPrint
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;
    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.print();
      instance.cancelPrint();
    });
  });
 */

import { cancelPrint } from 'helpers/print';

export default () => {
  cancelPrint();
};
