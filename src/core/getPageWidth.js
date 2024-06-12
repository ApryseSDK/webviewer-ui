import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageWidth__anchor
 */
export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getPageWidth(pageNumber);
