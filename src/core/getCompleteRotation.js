import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getCompleteRotation__anchor
 */
export default (pageNumber, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getCompleteRotation(pageNumber);
