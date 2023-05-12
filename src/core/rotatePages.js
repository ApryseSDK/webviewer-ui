import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#rotatePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.html#event:pagesUpdated__anchor
 */
export default (arr, rotation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().rotatePages(arr, rotation);
