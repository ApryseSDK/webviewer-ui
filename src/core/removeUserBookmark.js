import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#removeUserBookmark__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#removeUserBookmark__anchor
 */
export default (pageNumber, documentViewerKey) => {
  core.getDocumentViewer(documentViewerKey).removeUserBookmark(pageNumber);
};
