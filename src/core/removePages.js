import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#removePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:pagesUpdated__anchor
 */
export default (arr, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().removePages(arr);
