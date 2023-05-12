import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getSelectedTextQuads__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getSelectedTextQuads();
