import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#clearSelection__anchor
 * @fires textSelected on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:textSelected__anchor
 */
export default (documentViewerKey) => core.getDocumentViewer(documentViewerKey).clearSelection();
