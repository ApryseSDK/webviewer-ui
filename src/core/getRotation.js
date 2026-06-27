import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getRotation__anchor
 */
export default (pageNumber, documentViewerKey) => core.getDocumentViewer(documentViewerKey).getRotation(pageNumber);
