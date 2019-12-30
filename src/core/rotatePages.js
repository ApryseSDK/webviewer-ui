/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#rotatePages__anchor
 * @fires layoutChanged on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:layoutChanged__anchor
 */
export default (arr, rotation) => window.docViewer.getDocument().rotatePages(arr, rotation);
