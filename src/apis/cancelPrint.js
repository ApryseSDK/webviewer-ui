/**
 * Stops ongoing page processing to cancel a print job
 * @method UI.cancelPrint
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;
    // you must have a document loaded when calling this API
    docViewer.addEventListener('documentLoaded', function() {
      instance.UI.print();
      instance.UI.cancelPrint();
    });
  });
 */

import { cancelPrint } from 'helpers/rasterPrint';

export default () => {
  cancelPrint();
};
