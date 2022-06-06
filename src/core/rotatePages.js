/**
 * https://www.pdftron.com/api/web/Core.Document.html#rotatePages__anchor
 * @fires pagesUpdated on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:pagesUpdated__anchor
 */
export default (arr, rotation) => window.documentViewer.getDocument().rotatePages(arr, rotation);
