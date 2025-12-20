/**
 * Returns the current fit mode of the WebViewer Instance UI
 * @method UI.getFitMode
 * @return {string} Current fit mode
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this API
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getFitMode());
    });
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getFitMode(store.getState());