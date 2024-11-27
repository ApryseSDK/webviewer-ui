import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#addUserBookmark__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#addUserBookmark__anchor
 */
export default (pageNumber, text, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).addUserBookmark(pageNumber, text);
};
