import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#displaySearchResult__anchor
 */
export default (result, documentViewerKey = 1) => {
  core.getDocumentViewer(documentViewerKey).displaySearchResult(result);
};
