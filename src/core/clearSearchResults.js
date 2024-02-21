import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#clearSearchResults__anchor
 */
export default (documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).clearSearchResults();
};
