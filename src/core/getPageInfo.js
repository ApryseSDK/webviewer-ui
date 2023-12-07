import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#getPageInfo__anchor
 */
export default (pageNumber, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().getPageInfo(pageNumber);
