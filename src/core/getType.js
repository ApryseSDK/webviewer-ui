import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#getType__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().getType();
