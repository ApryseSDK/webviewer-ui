import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#displayBookmark__anchor
 */
export default (outline, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).displayBookmark(outline);
};
