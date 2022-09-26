import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 */
export default (bookmarks, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setUserBookmarks(bookmarks);
};
