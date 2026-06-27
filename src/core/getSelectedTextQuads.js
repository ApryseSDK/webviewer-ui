import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#getSelectedTextQuads__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getSelectedTextQuads();
