/**
 * Return the current layout mode of the WebViewerInstance.
 * @method UI.getLayoutMode
 * @return {string} Current layout mode
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getLayoutMode());
    });
  });
 */

import selectors from 'selectors';

export default store => () => selectors.getDisplayMode(store.getState());
