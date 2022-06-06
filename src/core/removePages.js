/**
 * https://www.pdftron.com/api/web/Core.Document.html#removePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:pagesUpdated__anchor
 */
export default arr => window.documentViewer.getDocument().removePages(arr);
