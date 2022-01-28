/**
 * https://www.pdftron.com/api/web/Core.Document.html#movePages__anchor
 * @fires layoutChanged on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:layoutChanged__anchor
 */
export default (pageArray, newLocation) => window.documentViewer.getDocument().movePages(pageArray, newLocation);