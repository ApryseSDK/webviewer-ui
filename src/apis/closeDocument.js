/**
 * Closes the document that's currently opened.
 * @method UI.closeDocument
 * @return {Promise<void>} A promise resolved after document is closed.
 * @example
WebViewer(...)
  .then(function(instance) {
    const docViewer = instance.Core.documentViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      setTimeout(function() {
        instance.UI.closeDocument().then(function() {
          console.log('Document is closed');
        });
      }, 3000);
    });
  });
 */

import core from 'core';

export default ({ dispatch }) => () => core.closeDocument(dispatch);