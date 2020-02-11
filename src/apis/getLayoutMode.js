/**
 * Return the current layout mode of the WebViewerInstance.
 * @method WebViewerInstance#getLayoutMode
 * @return {string} Current layout mode
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.getLayoutMode());
    });
  });
 */

import selectors from 'selectors';

export default store => () => selectors.getDisplayMode(store.getState());
