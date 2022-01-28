/**
 * Stops on-going page processing to cancel a print job.
 * @method UI.cancelPrint
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.Core.documentViewer;
    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.print();
      instance.UI.cancelPrint();
    });
  });
 */

import { cancelPrint } from 'helpers/print';

export default () => {
  cancelPrint();
};
