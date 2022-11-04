import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getPageWidth__anchor
 */
export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getPageWidth(pageNumber);
