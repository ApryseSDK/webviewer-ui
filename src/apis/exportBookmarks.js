import core from 'core';

/**
 * Returns a dictionary with page numbers as keys and the bookmark text as the values
 * @method UI.exportBookmarks
 * @param {number} [documentViewerKey] The key of the document viewer to export the bookmarks from. Default: the active document viewer key.
 * @return {Object} A dictionary with page numbers as keys and the bookmark text as the values. ex: {"1":"Bookmark 1","3":"Bookmark 2"}
 * @example
WebViewer(...)
  .then(function(instance) {
    // Save the annotation data for doc123
    const bookmarks = instance.UI.exportBookmarks();
    const bookmarksString = JSON.stringify(bookmarks);
    fetch('/server/bookmarksHandler.js?documentId=doc123', {
      method: 'POST',
      body: bookmarksString // written into a json file on server
    });
  });
 */
export default (store) => (documentViewerKey) => {
  const activeDocumentViewerKey = store.getState().viewer.activeDocumentViewerKey;
  documentViewerKey = documentViewerKey || activeDocumentViewerKey;
  return core.getUserBookmarks(documentViewerKey);
};
