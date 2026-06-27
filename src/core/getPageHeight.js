import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getPageHeight__anchor
 */
export default (pageNumber, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getPageHeight(pageNumber);
