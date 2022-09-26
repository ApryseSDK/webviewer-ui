import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#clearSelection__anchor
 * @fires textSelected on DocumentViewer
 * @see https://www.pdftron.com/api/web/Core.DocumentViewer.html#event:textSelected__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).clearSelection();
