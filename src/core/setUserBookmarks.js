/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 */
export default (bookmarks) => {
  window.documentViewer.setUserBookmarks(bookmarks);
};
