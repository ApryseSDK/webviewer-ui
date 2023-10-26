import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageSearchResults__anchor
 */
export default function getPageSearchResults(pageNumber, documentViewerKey = 1) {
  return core.getDocumentViewer(documentViewerKey).getPageSearchResults(pageNumber);
}
