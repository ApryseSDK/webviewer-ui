import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageWidth__anchor
 */
export default (pageNumber, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getPageWidth(pageNumber);
