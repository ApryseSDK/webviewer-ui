import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getDocument__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument();
