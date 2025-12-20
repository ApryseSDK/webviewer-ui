/**
 * Returns the current layout mode of the WebViewer Instance
 * @method UI.getLayoutMode
 * @return {string} Current layout mode
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this API
    docViewer.addEventListener('documentLoaded', function() {
      console.log(instance.UI.getLayoutMode());
    });
  });
 */

import selectors from 'selectors';

export default (store) => () => selectors.getDisplayMode(store.getState());
