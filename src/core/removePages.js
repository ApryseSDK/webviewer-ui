/**
 * https://www.pdftron.com/api/web/CoreControls.Document.html#removePages__anchor
 * @fires layoutChanged on DocumentViewer
 * @see https://www.pdftron.com/api/web/namespaces.list.html#event:layoutChanged__anchor
 */
export default arr => window.docViewer.getDocument().removePages(arr);
