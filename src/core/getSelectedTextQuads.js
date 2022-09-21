import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#getSelectedTextQuads__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getSelectedTextQuads();
