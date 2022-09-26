import core from 'core';

/**
 * https://www.pdftron.com/api/web/Core.Document.html#movePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:pagesUpdated__anchor
 */
export default (pageArray, newLocation, documentViewerKey = 1) => core.getDocumentViewer(documentViewerKey).getDocument().movePages(pageArray, newLocation);
