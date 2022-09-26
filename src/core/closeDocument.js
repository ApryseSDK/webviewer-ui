import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.DocumentViewer.html#closeDocument__anchor
 * @fires documentUnloaded on DocumentViewer
 * @see onDocumentUnloaded.js (No documentation yet)
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).closeDocument();
