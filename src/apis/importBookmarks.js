import core from 'core';

/**
 * Imports user bookmarks
 * @method UI.importBookmarks
 * @param {object} bookmarks A dictionary with page numbers as keys and the bookmark text as the values. ex: {"1":"Bookmark 1","3":"Bookmark 2"}. Behaviour is undefined otherwise.
 * @param {number} [documentViewerKey] The key of the document viewer to set the bookmarks for. Default: the active document viewer key.
 * @example
WebViewer(...)
  .then(function(instance) {
    // load the user bookmarks data for id 'doc123'
    fetch('/server/bookmarksHandler.js?documentId=doc123', {
      method: 'GET'
    }).then(function(response) {
      if (response.status === 200) {
        response.text().then(function(bookmarksString) {
          // {"0":"Bookmark 1","2":"Bookmark 2"}
          const bookmarks = JSON.parse(bookmarksString);
          instance.UI.importBookmarks(bookmarks);
        });
      }
    });
  });
 */
export default (store) => (bookmarks, documentViewerKey) => {
  const activeDocumentViewerKey = store.getState().viewer.activeDocumentViewerKey;
  documentViewerKey = documentViewerKey || activeDocumentViewerKey;
  core.setUserBookmarks(bookmarks, documentViewerKey);
};
