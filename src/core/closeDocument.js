import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.DocumentViewer.html#closeDocument__anchor
 * @fires documentUnloaded on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:documentUnloaded__anchor
 */
export default (documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).closeDocument();
