import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#removeUserBookmark__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#removeUserBookmark__anchor
 */
export default (pageNumber, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).removeUserBookmark(pageNumber);
};
