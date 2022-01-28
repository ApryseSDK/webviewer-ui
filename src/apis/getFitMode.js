/**
 * Return the current fit mode of the WebViewerInstance UI.
 * @method UI.getFitMode
 * @return {string} Current fit mode
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getFitMode());
    });
  });
 */

import selectors from 'selectors';

export default store => () => selectors.getFitMode(store.getState());