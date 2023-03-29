import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#cancelLoadThumbnail__anchor
 */
export default (requestId, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().cancelLoadThumbnail(requestId);
