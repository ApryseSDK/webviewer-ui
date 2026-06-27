import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#getType__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).getDocument()?.getType();
