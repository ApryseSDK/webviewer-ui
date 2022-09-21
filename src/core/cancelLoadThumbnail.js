import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.Document.html#cancelLoadThumbnail__anchor
 */
export default (requestId, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().cancelLoadThumbnail(requestId);
