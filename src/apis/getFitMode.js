/**
 * Return the current fit mode of the WebViewer.
 * @method WebViewer#getFitMode
 * @return {WebViewer.FitMode} Current fit mode
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      console.log(instance.getFitMode());
    });
  });
 */

import selectors from 'selectors';

export default store => () => selectors.getFitMode(store.getState());