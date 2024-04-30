import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#setUserBookmarks__anchor
 */
export default (bookmarks, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).setUserBookmarks(bookmarks);
};
