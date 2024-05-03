import core from 'core';

/**
 * https://docs.apryse.com/api/web/Core.Document.html#movePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://docs.apryse.com/api/web/Core.DocumentViewer.html#event:pagesUpdated
 */
export default (pageArray, newLocation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().movePages(pageArray, newLocation);
