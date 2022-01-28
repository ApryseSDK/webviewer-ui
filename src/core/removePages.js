/**
 * https://www.pdftron.com/api/web/Core.Document.html#removePages__anchor
 * @fires layoutChanged on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:layoutChanged__anchor
 */
export default arr => window.documentViewer.getDocument().removePages(arr);
