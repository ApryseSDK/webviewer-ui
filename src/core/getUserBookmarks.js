import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getUserBookmarks__anchor
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#getUserBookmarks__anchor
 */
export default (documentViewerKey = 1) => {
  return core.getDocumentViewer(documentViewerKey).getUserBookmarks();
};
