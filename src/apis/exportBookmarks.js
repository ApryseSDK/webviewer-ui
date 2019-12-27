/**
 * Returns a dictionary with page indices as keys and the bookmark text as the values
 * @method WebViewerInstance#exportBookmarks
 * @return {Object} A dictionary with page indices as keys and the bookmark text as the values. ex: {"0":"Bookmark 1","2":"Bookmark 2"}
 * @example
WebViewer(...)
  .then(function(instance) {
    // Save the annotation data for doc123
    const bookmarks = instance.exportBookmarks();
    const bookmarksString = JSON.stringify(bookmarks);
    fetch('/server/bookmarksHandler.js?documentId=doc123', {
      method: 'POST',
      body: bookmarksString // written into a json file on server
    });
  });
 */

import selectors from 'selectors';

export default store => () => {
  return selectors.getBookmarks(store.getState());
};
