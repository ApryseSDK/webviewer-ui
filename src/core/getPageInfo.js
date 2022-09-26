import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.Document.html#getPageInfo__anchor
 */
export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().getPageInfo(pageNumber);
