/**
 * Imports user bookmarks
 * @method UI.importBookmarks
 * @param {object} bookmarks A dictionary with page indices as keys and the bookmark text as the values. ex: {"0":"Bookmark 1","2":"Bookmark 2"}. Behaviour is undefined otherwise.
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

import actions from 'actions';

export default store => bookmarks => {
  store.dispatch(actions.setBookmarks(bookmarks));
};
