/**
 * Closes the document that's currently opened.
 * @method WebViewer#closeDocument
 * @return {Promise} A promise resolved after document is closed.
 * @example
WebViewer(...)
  .then(function(instance) {
    var docViewer = instance.docViewer;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      setTimeout(function() {
        instance.closeDocument().then(function() {
          console.log('Document is closed');
        });
      }, 3000);
    });
  });
 */

import core from 'core';

export default ({ dispatch }) => () => core.closeDocument(dispatch);