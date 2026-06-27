import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getDocument__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getDocument();
