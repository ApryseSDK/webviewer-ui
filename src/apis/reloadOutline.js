/**
 * Reloads the Bookmark Outline in the WebViewer UI.
 * @method UI.reloadOutline
 * @example
WebViewer(...)
  .then(function(instance) {
    const { documentViewer } = instance.Core;

    // you must have a document loaded when calling this api
    documentViewer.addEventListener('documentLoaded', async () => {
      const doc = documentViewer.getDocument();
      const pdfDoc = await doc.getPDFDoc();
      const firstBookmark = await doc.getFirstBookmark();

      const bookmarkToDelete = await firstBookmark.find('bookmark-to-delete');
      if (bookmarkToDelete !== null && await bookmarkToDelete.isValid()) {
        await bookmarkToDelete.delete();
        instance.UI.reloadOutline();
      }
    });
  });
 */

import core from 'core';
import actions from 'actions';

export default (store) => () => {
  core.getOutlines((outlines) => {
    store.dispatch(actions.setOutlines(outlines));
  });
};
